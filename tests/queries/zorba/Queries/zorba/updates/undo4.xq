import module namespace m = 'xqueryzorba.org/test/xqddf/ic' at '../xqddf/ic.xqlib';

import module namespace ddl = "http://zorba.io/modules/store/static/collections/ddl";

import module namespace dml = "http://zorba.io/modules/store/static/collections/dml";

import module namespace ic_ddl = "http://zorba.io/modules/store/static/integrity-constraints/ddl";


ddl:create($m:empc);

ic_ddl:activate(xs:QName("m:ic_simple"));

variable $test:=<root><a/>b</root>;

try
{
(
delete node $test/*[1]
,

replace node $test/*[1] with "aa"
,

dml:insert($m:empc,
<emp>
<salary>600</salary>
</emp>
)
);
}
catch * {}
$test
