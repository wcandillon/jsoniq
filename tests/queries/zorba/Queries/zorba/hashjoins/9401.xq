<karteikasten>{
  for $anzahl in (1 to 2)
  return
 <gruppe anzahl="{$anzahl}">{
   for $a in doc("books.xml")//book
   where $anzahl=count($a/author)
   return $a}</gruppe>
}</karteikasten>