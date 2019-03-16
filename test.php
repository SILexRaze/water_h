<?php
$host        = "host = 127.0.0.1";
$port        = "port = 5432";
$dbname      = "dbname = testdb";
$credentials = "user = postgres password=salut";

$db = pg_connect( "$host $port $dbname $credentials"  );
if (!$db)
	echo "Error : Unable to open database<br>";
else
	echo "Opened database successfully<br>";
$sql =<<<EOF
SELECT * from waterh;
EOF;
$ret = pg_query($db, $sql);
if (!$ret)
{
	echo pg_last_error($db);
	exit;
}
while($row = pg_fetch_row($ret))
{
   $mesure[] = $row[3] . ", " . $row[0];
   $temp[] = $row[3] . ", " . $row[1];
   $pres[] = $row[3] . ", " . $row[2];
/*	echo "Mesu=". $row[0] . "<br>";
	echo "Temp=". $row[1] . "<br>";
	echo "Pres=". $row[2] . "<br>";
	echo "Date=". $row[3] . "<br>----------<br>";*/
}
echo join($mesure, ", ") . "<br>";
echo join($temp, ", ") . "<br>";
echo join($pres, ", ") . "<br>";
echo join($date, ", ") . "<br>";
echo "Operation done successfully<br>";
pg_close($db);
?>
<html>
<body>
</body>
</html>
