<?php 

require_once('dbconnect.php');

$db = DbUtil::loginConnection();
$stmt = $db -> stmt_init();

echo "{";

$last_mnem = '';
$last_num = '';
$last_sect = '';
$last_ts = '';
$last_taken = '';

$count = 0;

// if ($stmt -> prepare("SELECT * FROM bubble_data") or die(mysqli_error($db))) {
// 	$stmt -> execute();
// 	$stmt -> bind_result($mnemonic, $num, $sect, $total, $taken, $ts);
// 	while ($stmt -> fetch()) {
// 		$count ++;

// 		if($count == 1){
// 			$last_mnem = $mnemonic;
// 			$last_num = $num;
// 			$last_sect = $sect;
// 			$last_ts = $ts;
// 			$last_taken = $taken;
// 		} else {
// 			if(($mnemonic == $last_mnem) && ($num == $last_num) && ($sect == $last_sect)) {
// 				echo '"' . $mnemonic . '-' . $num . '-' . $sect . '-' . $ts . '": "' . (intval($taken) - intval($last_taken)) . '",';
// 				$last_taken = $taken;
// 			} else {
// 				$last_mnem = $mnemonic;
// 				$last_num = $num;
// 				$last_sect = $sect;
// 				$last_ts = $ts;
// 				$last_taken = $taken;
// 			}
// 		}
// 	}

if ($stmt -> prepare("SELECT mnemonic, num, sum(seats_taken), ts FROM bubble_data GROUP BY mnemonic, num, ts") or die(mysqli_error($db))) {
	$stmt -> execute();
	$stmt -> bind_result($mnemonic, $num, $taken, $ts);
	while ($stmt -> fetch()) {
		$count ++;

		if($count == 1){
			$last_mnem = $mnemonic;
			$last_num = $num;
			$last_ts = $ts;
			$last_taken = $taken;
		} else {
			if(($mnemonic == $last_mnem) && ($num == $last_num)) {
				echo '"' . $mnemonic . '-' . $num . '-' . $ts . '": "' . (intval($taken) - intval($last_taken)) . '",';
				$last_taken = $taken;
			} else {
				$last_mnem = $mnemonic;
				$last_num = $num;
				$last_ts = $ts;
				$last_taken = $taken;
			}
		}
	}

echo "}";
}

 ?>