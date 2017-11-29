<?php

namespace App\Utilities\Contracts;

interface ConfigParser
{
    public function getPages();
    public function getCommonPages();
    public function getPageByUrl($url);

    public function getData();
    public function getCommonData();
    public function getDataByUrls($urls);
    public function getDataByUrl($url);
    public function getDataByIds($ids);
    public function getDataById($id);
}