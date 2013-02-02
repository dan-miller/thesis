<?php
	class DbUtil{
		public static $lu = "miller";
		public static $lp = "eightamisearly";
		public static $host = "stardock.cs.virginia.edu";
		public static $schema = "millerthesis";
		
		public static function loginConnection() {
			$db = new mysqli(DbUtil::$host, DbUtil::$lu, DbUtil::$lp, DbUtil::$schema);
			if($db->connect_errno) {
				echo "fail";
				$db->close();
				exit();
			}
			return $db;
		}
	}
?>

