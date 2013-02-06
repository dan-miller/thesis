<?php 
require_once('dbconnect.php');

$ts_param = $_GET['ts_param'];

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

if ($stmt -> prepare("SELECT mnemonic, num, sect, total_seats, seats_taken FROM bubble_data WHERE ts = ?") or die(mysqli_error($db))) {
	$stmt -> bind_param("s", $ts_param);
	$stmt -> execute();
	$stmt -> bind_result($mnemonic, $num, $sect, $total_seats, $seats_taken);
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