<?php
include 'index.php';
$url = isset($_POST["url"]) ? $_POST["url"] : null;
echo upload($url);
// echo upload("https"); 
    function upload($url) {
        
        set_time_limit(0);
        $fp = fopen ('./a.xml', 'w+');
        $ch = curl_init($url);// or any url you can pass which gives you the xml file
        curl_setopt($ch, CURLOPT_TIMEOUT, 2000);
        curl_setopt($ch, CURLOPT_FILE, $fp);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_exec($ch);
        curl_close($ch);
        fclose($fp);
    }