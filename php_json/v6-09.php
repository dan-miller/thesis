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

echo '{"name": "ENGR", "children": [';

$last_mnem = '';
$last_num = '';

$count = 0;

if ($stmt -> prepare("SELECT faculty.department, count(faculty.department) * 3 FROM section
JOIN faculty ON section.instructor = faculty.instructor
WHERE deptID = 'ENGR' AND (courseNum = '1620' or courseNum = '162') AND section.semester = '1098'
AND NOT (faculty.instructor = 'George Cahen') GROUP BY faculty.department") or die(mysqli_error($db))) {
  $stmt -> execute();
  $stmt -> bind_result($department, $total);
  while($stmt -> fetch()) {

    $count++;

    if($count == 1) {echo '{"name": "' . $department . '", "value": "' . $total . '"}';}
    else echo ', {"name": "' . $department . '", "value": "' . $total . '"}';

  }
}

echo "]}";
//echo json_encode($masterjson);

$stmt -> close();
$db -> close();
 ?>