<?php 
require_once('dbconnect.php');

$db = DbUtil::loginConnection();
$stmt = $db -> stmt_init();
$sectjson = array();
$mnemjson = array();
$json = array();
$masterjson = array();

$masterjson['name'] = 'flare';
$masterjson['children'] = array();

echo '{"name": "flare", "children": [';

$last_mnem = '';
$last_num = '';

$count = 0;

if ($stmt -> prepare("SELECT mnemonic, num, sect, seats_taken FROM offering_current WHERE mnemonic IN ( SELECT mnemonic from biggest ) AND ts = ( SELECT ts FROM offering_current ORDER BY ts DESC LIMIT 1 ) AND num < 4900 ORDER BY mnemonic, num, sect") or die(mysqli_error($db))) {
	$stmt -> execute();
	$stmt -> bind_result($mnemonic, $num, $sect, $seats_taken);
	while($stmt -> fetch()) {

		$count++;

		if($last_mnem == $mnemonic) {
			if ($last_num == $num) {
				echo ',{"name": "'. $mnemonic . "-" . $num . "-" . $sect .  '", "size": ' . $seats_taken . "}";
			} else {
				echo ']},{"name": "' . $num . '", "children": [';
				echo '{"name": "'. $mnemonic . "-" . $num . "-" . $sect .  '", "size": ' . $seats_taken . "}";

				$last_num = $num;

			} 
		} else {
			if ($count != 1) {
					echo "]}]},";
				}	
			echo '{"name": "' . $mnemonic . '", "children": [';
			echo '{"name": "' . $num . '", "children": [';
			echo '{"name": "'. $mnemonic . "-" . $num . "-" . $sect .  '", "size": ' . $seats_taken . "}";

			$last_num = $num;
			$last_mnem = $mnemonic;
		}

	}
}

echo "]}]}]}";
//echo json_encode($masterjson);

$stmt -> close();
$db -> close();
 ?>