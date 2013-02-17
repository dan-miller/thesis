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

$last_mnem = '';
$last_num = '';

$count = 0;
echo "{";

if ($stmt -> prepare("SELECT mnemonic, num, seats_taken, ts FROM seas_current_course_totals") or die(mysqli_error($db))) {
	$stmt -> execute();
	$stmt -> bind_result($mnemonic, $num, $seats_taken, $ts);
	while($stmt -> fetch()) {
		echo '"' . $mnemonic . "-" . $num . "-" . $ts . '": "' . $seats_taken . '",';
	}
}

echo "}";
//echo json_encode($masterjson);

$stmt -> close();
$db -> close();
 ?>