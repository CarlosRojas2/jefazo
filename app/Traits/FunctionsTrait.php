<?php
namespace App\Traits;
trait functionsTrait{
    function decodeUtf8($string){
        return mb_convert_encoding($string, 'ISO-8859-1', 'UTF-8');
    }
}
