<?php 
$json = '{"CS1110": {"1110": {"001" : 2}, "1112" : {"001" : 4} } }';
$arr = json_decode($json, true);

echo $arr["CS1110"]["1112"]["001"];
 ?>