<?php
    $address = $_POST['arguments'][0]
    header('Content-Type: application/json');
    exec("python pingscript.py $address>&2");
?>
