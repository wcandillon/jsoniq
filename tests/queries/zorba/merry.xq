declare variable $inp := [ "Merry Christmas,", "and a happy new year!", "(2014)" ];
declare variable $m := " ¡,#$%⅋,)(*+'-˙/0ƖᄅƐㄣϛ9ㄥ86:;>=<¿@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Z]\[^‾,ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz}|{~";
declare variable $M := ( (1 to 31),  string-to-codepoints($m) );
[
                              for $s in reverse( members( $inp ) )
    return
      codepoints-to-string(
        reverse( for $c in string-to-codepoints($s) return $M[$c] )
      )
]
