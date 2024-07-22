<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>魔法の紙片</title>
    <link rel="stylesheet" href="css/tips.css">
</head>
<body>
        <?php
        echo "<table style='margin-top:100px;'>";
        $cnt = 0;
        $array = [20,18,41,6,32,5,22,31,19,52,14,29,40,28,27,11];
        for ($row = 0; $row < 5; $row++) {
            echo "<tr>";
            for ($col = 0; $col < 11; $col++) {
                $cnt++;
                $number = array_search($cnt,$array);
                if($number !==false){
                    echo "<td>{$number}</td>";
                }else{
                    echo "<td></td>";
                }
            }
            echo "</tr>";
        }
        echo "</table>";
        echo "<br>";
        echo "<table class='bit'>";
        for ($col = 1; $col <= 44; $col++) {
            if($col<4){
                $color = "white";
            }else if($col<11){
                $color = "#00fa9a";
            }else if($col<21){
                $color = "#87cefa";
            }else if($col<35){
                $color = "#f0e68c";
            }else if($col<38){
                $color = "#ffc0cb";
            }else if($col<40){
                $color = "#ffa500";
            }else if($col<45){
                $color = "#ee82ee";
            }
            echo "<td style='background-color: {$color};'></td>";
        }
        echo "</table>";
        echo "<br>";
        echo "<h1>レベルは99までです！</h1>";
        ?>
        <button onclick="closewindow()">CTFGAMEに戻る</button>
        <script>
        	function closewindow() {
            	window.close();
          	}
        </script>
</body>
</html>