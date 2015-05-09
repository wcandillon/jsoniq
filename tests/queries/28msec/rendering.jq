jsoniq version "1.0";

module namespace m = "http://xbrl.io/modules/bizql/rendering";

import module namespace facts = "http://xbrl.io/modules/bizql/facts";


declare function m:breakdown-to-group($breakdown as object) as object
{
    {
        GroupLabels: $breakdown.BreakdownLabels,
        GroupCells: [
            $breakdown.BreakdownTree ! m:structural-node-to-header-rows($$)
        ]
    }
};

declare function m:structural-node-to-header-rows($structural-node as object) as array+
{
    let $bottom-rows :=
        if (exists($structural-node.Children))
        then m:concatenate-header-rows($structural-node.Children[] ! [ m:structural-node-to-header-rows($$) ])
        else ()
    let $span :=
        if(exists($bottom-rows))
        then sum(($bottom-rows[1])[].CellSpan)
        else 1
    return(
        [
            {
                CellLabels: $structural-node.Labels,
                CellConstraints: ($structural-node.ConstraintSets."", {})[1],
                CellSpan: $span
            }
        ],
        $bottom-rows
    )
};

declare function m:concatenate-header-rows($header-rows-groups as array*) as array+
{
    for $row in size($header-rows-groups[1])
    return [
        for $group in $header-rows-groups[]
        return ($group[$row])[]
    ]
};

declare function m:build-global-filter($structural-model as object) as object
{
    let $global-constraints := $structural-model.GlobalConstraints
    let $slice-constraints := accumulate(values(descendant-objects($structural-model).ConstraintSets))
    return {|
        {
            Aspects: {|
                for $aspect in keys(($global-constraints.Aspects, $slice-constraints))
                return {
                    $aspect: [
                        switch(true)
                        case empty($global-constraints.Aspects.$aspect) return flatten($slice-constraints.$aspect)
                        case empty($slice-constraints.$aspect) return flatten($global-constraints.Aspects.$aspect)
                        default return flatten($slice-constraints.$aspect)[$$ eq $global-constraints.Aspects.$aspect[]]
                    ]
               }
            |}
        },
        trim($global-constraints, "Aspects")
    |}
};

declare function m:filter($facts as object*, $filter as object) as object*
{
    for $fact in $facts
    where m:matches($fact, $filter)
    return $fact
};

declare function m:matches($left as object, $right as object) as boolean
{
    every $field in keys($right)
    satisfies
        typeswitch($right.$field)
        case object return m:matches($left.$field, $right.$field)
        case array return (some $item in $right.$field[] satisfies $left.$field eq $item)
        default return $right.$field eq $left.$field
};

declare function m:slices($table-headers as array) as object*
{
    let $first-row-of-headers := $table-headers[[1]]
    return
    if(size($table-headers) eq 1)
    then $first-row-of-headers[].CellConstraints 
    else 
    let $bottom-slices := m:slices([($table-headers[])[position() gt 1]])
    for $i in 1 to size($first-row-of-headers)
    let $offset := sum($first-row-of-headers[][position() lt $i].CellSpan)
    let $first-row-cell := $first-row-of-headers[[$i]]
    for $i in 1 to $first-row-cell.CellSpan
    return {| $bottom-slices[$offset + $i], $first-row-cell.CellConstraints |}
};

declare function m:project($header-rows-groups as object*) as object*
{
    $header-rows-groups
};

declare function m:layout($structural-model as object) as object
{
    let $facts := facts:facts-for({Filter: m:build-global-filter($structural-model)})
    return {
        ModelKind: "LayoutModel",
        TableSetLabels: $structural-model.TableSetLabels,
        TabelSet: [
            for $table in $structural-model.TableSet[]
            let $table-headers := {|
                for $axis in keys($table.Breakdowns)
                return {
                    $axis: m:project(for $breakdown in $table.Breakdowns.$axis[]
                                     return m:breakdown-to-group($breakdown))
                    
                }
            |}
            let $x-slices := m:slices($table-headers.x.GroupCells)
            let $y-slices := m:slices($table-headers.y.GroupCells)
            let $cells := [
                for $y-slice in $y-slices
                return [
                    for $x-slice in $x-slices
                    let $cell-filter := { Aspects: {| $x-slice, $y-slice|} }
                    return m:filter($facts, $cell-filter)
                ]
            ]
            return
            {
                TableHeaders: $table-headers,
                TableCells: {
                    AxisOrder: [ "y", "x" ],
                    Facts: $cells
                }
            }
        ],
        GlobalConstraints: $structural-model.GlobalConstraints
    }
};