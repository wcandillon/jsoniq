declare %rest:case-insensitive variable $format as string? external;

declare function local:contains-aspect($name as string) as boolean
{
    some $x in (() ! starts-with($$, $name)) satisfies $x
};

$format
