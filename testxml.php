<?php
//     function upload($url) {
//         set_time_limit(0);
//         $fp = fopen ('./a.xml', 'w+');
//         $ch = curl_init($url);// or any url you can pass which gives you the xml file
//         curl_setopt($ch, CURLOPT_TIMEOUT, 2000);
//         curl_setopt($ch, CURLOPT_FILE, $fp);
//         curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
//         curl_exec($ch);
//         curl_close($ch);
//         fclose($fp);
//     }

    //0: string or numerical
    //1: null or other
    //2: null or date formate
    //3: EUR
    //4: Y or N
    //5: 3 multi
    //6: url
    //7: 1~4
    //8: two letter code
    //9: restrions

    $error_list = array();
    function check_three_multi($string) {
        $array = explode("x", $string);
        if(count($array) !== 3){
                return false;
        } else {
        foreach ($array as $value) {
            if (!is_numeric($value)) {
                return false;
            }
        }
        return true;
}
    }

    function is_url($url){
        if(filter_var($url, FILTER_VALIDATE_URL)){
          return false;
        }
        else{
            return true;
        }
    }

    $type = array(
        "id" => 0,
        "artnr" => 1,
        "title" => 1,
        "description" => 1,
        "casecount" => 0,
        "date" => 2,
        "currency" => 3,
        "weeknr" => 0,
        "bulletpoints" => 1,
        "modifydate" => 2,
        "type" => 1,
        "subartnr" => 1,
        "ean" => 0,
        "stock" => 4,
        "stockestimate" => 0,
        "remaining" => 4,
        "remaining_quantity" => 0,
        "b2b" => 0,
        "b2c" => 0,
        "vatnl" => 0,
        "vatde" => 0,
        "vatfr" => 0,
        "vatuk" => 0,
        "discount" => 4,
        "content" => 0,
        "length" => 0,
        "height" => 0,
        "weight" => 0,
        "mindiameter" => 0,
        "maxdiameter" => 0,
        "innerdiameter" => 0,
        "outerdiameter" => 0,
        "packing" => 5,
        "insertiondepth" => 0,
        "propid" => 0,
        "property" => 1,
        "valueid" => 1,
        "value" => 1,
        "unit" => 1,
        "magnitude" => 0,
        "popularity" => 7,
        "pic" => 6,
        "country" => 8,
        "bp" => 1,
        "battery" => 4,
        "germany" => 9,
        "platform" => 4,
        "hscode" => 0,
        "required" => 4,
        "included" => 4,
        "quantity" => 0,
        "baseprice" => 1,
        "material" => 1,
        "b2bsale" => 0,
        "internallength" => 0
    );

    $flag = true;
    function analyize($object) {
        global $error_list;
        foreach($object as $key => $child) {

                // echo $child.'</br>';

                if (count($child) == 0) {
                    global $type;
                    global $flag;
                    $value_of_child = strval($child);
                    
                    if(strval($key) == "category" || strval($key) == "categories" || strval($key) == "properties") {
                        return;
                    }
                    
                    switch ($type[$key]) {
                        case 0:
                                
                                if (!is_numeric($value_of_child)) {
                                       $flag = false;
                                       array_push($error_list, $key.", ");
                                }
                                break;
                        case 1:
                                
                                if (empty($value_of_child) == 1) {
                                        $flag = false;
                                       array_push($error_list, $key.", ");
                                }
                                break;
                        case 2:
                                if(!strtotime($value_of_child)){
                                        $flag = false;
                                        array_push($error_list, $key.", ");
                                }
                                break;
                        case 3:
                                if ($value_of_child !== "EUR") {
                                        $flag = false;
                                        array_push($error_list, $key.", ");
                                }
                                break;
                        case 4:
                                if (!in_array($value_of_child, array("Y", "N"))) {
                                        $flag = false;
                                        array_push($error_list, $key.", ");
                                }
                                break;
                        case 5:
                                if (check_three_multi($value_of_child) == false) {
                                        $flag = false;
                                        array_push($error_list, $key.", ");
                                }
                                break;
                        case 6:
                                if (is_url($value_of_child)) {
                                        $flag = false;
                                        array_push($error_list, $key.", ");
                                } 
                                break;
                        case 7:
                                if (!in_array($value_of_child, array("1", "2", "3", "4"))) {
                                        $flag = false;
                                        array_push($error_list, $key.", ");
                                }
                                break;
                        case 8:
                                if (!in_array($value_of_child, array("CN", "DE", "TW", "PL", "NL", "GB", "MY", "ES", "US", "PT", "AT", "LU", "PK", "IN"))) {
                                        $flag = false;
                                        array_push($error_list, $key.", ");
                                }
                                break;
                        case 9:
                                if ($value_of_child == "Y") {
                                        $flag = false;
                                        array_push($error_list ,$key.", ");
                                }
                                break;
                    }
                } else {
                    analyize($child);
                } 
        }
    }

    $xml=simplexml_load_file("a.xml") or die("Error: Cannot create object");

    $index = 0;

    foreach($xml->children() as $key => $products) {
        $index ++;
        analyize($products);
        if ($flag == false) {
                echo "Product". $index. " ". implode($error_list)."<br/>"."<br/>";
        }
    }
?>







