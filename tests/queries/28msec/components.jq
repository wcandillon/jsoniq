import module namespace config = "http://apps.28.io/config";
import module namespace api = "http://apps.28.io/api";
import module namespace session = "http://apps.28.io/session";
import module namespace backend = "http://apps.28.io/backend";

import module namespace entities = "http://28.io/modules/xbrl/entities";
import module namespace archives = "http://28.io/modules/xbrl/archives";
import module namespace components = "http://28.io/modules/xbrl/components";

import module namespace sec-filings = "http://28.io/modules/xbrl/profiles/sec/filings";
import module namespace sec-networks = "http://28.io/modules/xbrl/profiles/sec/networks";
import module namespace multiplexer = "http://28.io/modules/xbrl/profiles/multiplexer";

import module namespace csv = "http://zorba.io/modules/json-csv";

declare option rest:response "first-item";

declare function local:to-csv($res as object*) as string*
{
    csv:serialize(
        for $a in $res
        for $c in $a.Components[]
        return {
            AcessionNumber : $a.AccessionNumber,
            NetworkIdentifier : $c.NetworkIdentifier,
            FactTable: $c.FactTable,
            SpreadSheet: $c.SpreadSheet,
            EntityRegistrantName : $a.EntityRegistrantName,
            CIK : $a.CIK,
            FiscalYear : $a.FiscalYear,
            FiscalPeriod : $a.FiscalPeriod,
            AcceptanceDateTime : $a.AcceptanceDatetime,
            FormType : $a.FormType,
            NetworkLabel : $c.NetworkLabel,
            Category : $c.Category,
            SubCategory : $c.SubCategory,
            Table : flatten($c.Table),
            Disclosure : $c.Disclosure,
            ReportElements : $c.ReportElements,
            Tables : $c.Tables,
            Axis : $c.Axis,
            Members : $c.Members,
            LineItems : $c.LineItems,
            Concepts : $c.Concepts,
            Abstracts : $c.Abstracts
        },
    { serialize-null-as : "" })
};

(: Query parameters :)
declare  %rest:case-insensitive                 variable $token              as string? external;
declare  %rest:env                              variable $request-uri        as string  external;
declare  %rest:case-insensitive                 variable $format             as string? external;
declare  %rest:case-insensitive %rest:distinct  variable $cik                as string* external;
declare  %rest:case-insensitive %rest:distinct  variable $edinetcode   as string* external;
declare  %rest:case-insensitive %rest:distinct  variable $tag                as string* external;
declare  %rest:case-insensitive %rest:distinct  variable $ticker             as string* external;
declare  %rest:case-insensitive %rest:distinct  variable $sic                as string* external;
declare  %rest:case-insensitive %rest:distinct  variable $fiscalYear         as string* external := "LATEST";
declare  %rest:case-insensitive %rest:distinct  variable $fiscalPeriod       as string* external := "FY";
declare  %rest:case-insensitive %rest:distinct  variable $filingKind         as string* external := ();
declare  %rest:case-insensitive %rest:distinct  variable $eid                as string* external;
declare  %rest:case-insensitive %rest:distinct  variable $aid                as string* external;
declare  %rest:case-insensitive %rest:distinct  variable $networkIdentifier  as string* external;
declare  %rest:case-insensitive %rest:distinct  variable $role               as string* external;
declare  %rest:case-insensitive %rest:distinct  variable $cid                as string* external;
declare  %rest:case-insensitive %rest:distinct  variable $reportElement      as string* external;
declare  %rest:case-insensitive %rest:distinct  variable $concept            as string* external;
declare  %rest:case-insensitive %rest:distinct  variable $disclosure         as string* external;
declare  %rest:case-insensitive %rest:distinct  variable $label              as string* external;
declare  %rest:case-insensitive                 variable $profile-name       as string  external := $config:profile-name;

session:audit-call($token);

(: Post-processing :)
let $format as string? := api:preprocess-format($format, $request-uri)
let $fiscalYear as integer* := api:preprocess-fiscal-years($fiscalYear)
let $fiscalPeriod as string* := api:preprocess-fiscal-periods($fiscalPeriod)
let $tag as string* := api:preprocess-tags($tag)
let $reportElement := ($reportElement, $concept)
let $networkIdentifier := distinct-values(($networkIdentifier, $role))

let $cik as string* :=
    switch($profile-name)
    case "sec" return $cik
    case "japan" return $edinetcode
    default return ()

(: Entity resolution :)
let $entities := multiplexer:entities(
  $profile-name,
  $eid,
  $cik,
  $tag,
  $ticker,
  $sic, ())

let $archives as object* := multiplexer:filings(
  $profile-name,
  $entities,
  $fiscalPeriod,
  $fiscalYear,
  $filingKind,
  $aid)

let $entities as object*  := entities:entities($archives.Entity)
let $components as object* :=
    multiplexer:components(
      $profile-name,
      $archives,
      $cid,
      $reportElement,
      $disclosure,
      $networkIdentifier,
      $label[$profile-name ne "sec"],
      $label[$profile-name eq "sec"]
    )

let $res as object* :=
    switch($profile-name)
    case "sec" return
        for $r in $components
        let $disclosure := sec-networks:disclosures($r)
        where $disclosure ne "DefaultComponent"
        order by $r.Label
        group by $archive := $r.Archive
        let $archive := $archives[archives:aid($$) eq $archive]
        let $e := $entities[entities:eid($$) eq $archive.Entity]
        return
            {
               AccessionNumber : archives:aid($archive),
               EntityRegistrantName : $e.Profiles.SEC.CompanyName,
               CIK : entities:eid($e),
               FiscalYear :$archive.Profiles.SEC.Fiscal.DocumentFiscalYearFocus,
               FiscalPeriod :$archive.Profiles.SEC.Fiscal.DocumentFiscalPeriodFocus,
               AcceptanceDatetime : sec-filings:acceptance-dateTimes($archive),
               FormType : $archive.Profiles.SEC.FormType,
               Components : [
                    for $component in sec-networks:summaries($r)
                    return copy $c := $component
                    modify insert json {
                        FactTable: backend:url("facttable-for-component", {
                            token: $token,
                            aid: archives:aid($archive),
                            format: $format,
                            role: $component.NetworkIdentifier,
                            profile-name: $profile-name
                            }),
                        SpreadSheet: "http://rendering.secxbrl.info/#?url=" || encode-for-uri(
                            backend:url("spreadsheet-for-component", {
                            token: $token,
                            aid: archives:aid($archive),
                            format: $format,
                            role: $component.NetworkIdentifier,
                            profile-name: $profile-name
                            })
                        )
                    } into $c
                    return $c
               ]
           }
    default return
        for $r in $components
        return {|
          {
            Archive: $r.Archive,
            Label: $r.Label,
            Role: $r.Role,
            FactTable: backend:url("facttable-for-component", {
                            token: $token,
                            aid: $r.Archive,
                            format: $format,
                            role: $r.Role,
                            profile-name: $profile-name
                            }),
            SpreadSheet: "http://rendering.secxbrl.info/#?url=" || encode-for-uri(
                        backend:url("spreadsheet-for-component", {
                            token: $token,
                            aid: $r.Archive,
                            format: $format,
                            role: $r.Role,
                            profile-name: $profile-name,
                            eliminate: "true"
                        })),
            ReportElements: backend:url("report-elements", {
                            token: $token,
                            aid: $r.Archive,
                            format: $format,
                            role: $r.Role,
                            profile-name: $profile-name
                        }),
            NumRules: size($r.Rules),
            NumNetworks: components:num-networks($r),
            NumReportElements: components:num-report-elements($r),
            NumHypercubes: components:num-hypercubes($r),
            NumDimensions: components:num-dimensions($r),
            NumMembers: components:num-members($r),
            NumLineItems: components:num-line-items($r),
            NumAbstracts: components:num-abstracts($r),
            NumConcepts: components:num-concepts($r),
            Hypercubes: [ keys($r.Hypercubes) ],
            ValidationErrors: [ components:validation-errors($r) ]
          },
          { Disclosure: $r.Profiles.FSA.Disclosure}[$profile-name eq "japan"]
        |}
let $result := switch($profile-name)
               case "sec"
               return { Archives: [ $res ] }
               default return { Components : [ $res ] }
let $comment :=
 {
    NumComponents : count($components),
    TotalNumComponents: session:num-components(),
    TotalNumArchives: session:num-archives()
}
let $serializers := {
    to-xml : switch($profile-name)
        case "sec"
        return function($res as object) as node() {
        <Archives>{
                  for $r in flatten($res.Archives)
                  return
                      <Archive id="{$r.AccessionNumber}">
                         <EntityRegistrantName>{$r.EntityRegistrantName}</EntityRegistrantName>
                         <CIK>{$r.CIK}</CIK>
                         <FiscalYear>{$r.FiscalYear}</FiscalYear>
                         <FiscalPeriod>{$r.FiscalPeriod}</FiscalPeriod>
                         <AcceptanceDatetime>{$r.AcceptanceDatetime}</AcceptanceDatetime>
                         <FormType>{$r.FormType}</FormType>
                         <Components>{
                             sec-networks:summaries-to-xml(flatten($r.Components))
                         }</Components>
                     </Archive>
             }</Archives>
        }
        default return function($res as object) as node() {
        <Components>{
          api:json-to-xml($res.Components[], "Component")
        }</Components>
    },
    to-csv : function($res as object) as string {
        switch($profile-name)
        case "sec" return string-join(local:to-csv($res.Archives[]), "")
        default return api:json-to-csv($res.Components[])
    }
}

let $results := api:serialize($result, $comment, $serializers, $format, "components")
return api:check-and-return-results($token, $results, $format)
