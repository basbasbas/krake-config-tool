<?php

namespace App\Utilities;

// TODO; apply this class
class JSONConfigParser implements \ConfigParser
{
    private $config;

    private $pages;
    private $data;
    private $common_data;
    private $common_pages;
    private $prefixes;
    private $types;
    private $commons;

    private function __construct()
    {
        $this->config = require_once('Config.php');

        $this->types = [
            Config::PAGES => &$this->pages,
            Config::DATA => &$this->data
        ];
        $this->commons = [
            Config::PAGES => &$this->common_pages,
            Config::DATA => &$this->common_data
        ];

        $this->prefixes = $this->config['prefixes'];
        $this->common_data = $this->config['common_data'];
        $this->common_pages = $this->config['common_pages'];

        foreach ($this->types as $k => $v) {
            $this->format_config_data($k);
        }

//        $this->types[Config::PAGES] = $responseObj;
    }

    // TODO; Inconsistent function naming conventions
    private function format_config_data($type) {

        // TODO; better naming, this also sets type data
        // TODO; apply domain in url, receive domain through theme URL
        $pageConfig = json_decode(file_get_contents('http://localhost/wordpress/site1/wp-json/test-plugin/website-page-config'), true);
        $dataConfig = json_decode(file_get_contents('http://localhost/wordpress/site1/wp-json/test-plugin/website-data-config'), true);

//        if ($type == Config::PAGES) {
//            $this->types[$type] = $this->setUrlPrefixes($pageConfig, $type);
//            return;
//        }
//        if ($type == Config::DATA) {
//            $this->types[$type] = $this->setUrlPrefixes($dataConfig, $type);
//            return;
//        }

        $typeToConfig = (object) [
            Config::PAGES => $pageConfig,
            Config::DATA => $dataConfig,
        ];

        $this->types[$type] = $this->setUrlPrefixes($typeToConfig[$type], $type);
        return;


//        echo print_r($response);
//        echo '---------------------------';
//        echo print_r($this->pages);

        $this->types[$type] = $this->setUrlPrefixes($this->config[$type], $type);
    }

    // Singleton, don't use for now
    private function __clone() {}
    private function __wakeup() {}
    public static function Instance() {
        static $inst = null;
        if ($inst === null) {
            $inst = new JSONConfigParser();
        }
        return $inst;
    }

    // Add client url as seperate prop
    // Replace client url with server url
    private function setUrlPrefixes($array, $type) {
        foreach ($array as $key => $value) {
            $newKey = $this->getFullPrefixes()[$type] . '/' . $key;

            $array[$key]['id'] = $key;
            $array[$newKey] = $array[$key];
            unset($array[$key]);
        }

        return $array;
    }

    // Verbose functions
    public function getPages()          { return $this->pages; }
    public function getPageByUrl($url)  { return $this->filterByUrl(Config::PAGES, [$url]); }
    public function getCommonPages()    { return $this->filterById(Config::PAGES); }
    public function getData()           { return $this->data; }
    public function getPageUrls()       { return array_keys($this->pages); }
    public function getDataUrls()       { return array_keys($this->data); }
    public function getDataByUrls($urls){ return $this->filterByUrl(Config::DATA, $urls); }
    public function getDataByUrl($url)  { return $this->filterByUrl(Config::DATA, [$url]); }
    public function getDataByIds($ids)  { return $this->filterById(Config::DATA, $ids); }
    public function getDataById($id)    { return $this->filterById(Config::DATA, [$id]); }
    public function getCommonData()     { return $this->filterById(Config::DATA); }
    public function getPrefixes()       { return $this->prefixes; }

    public function getFullPrefixes() {
        return array(
            Config::DATA => $this->prefixes[Config::NAME] . '/' . $this->prefixes[Config::DATA],
            Config::PAGES => $this->prefixes[Config::NAME] . '/' . $this->prefixes[Config::PAGES]
        );
    }



//    private function filter($type, $filter) {
//        $obj = [];
//        $values = $filter->value;
//
//        $isID = $filter->type == Config::ID;
//        $isURL = $filter->type == Config::URL;
//
//        if ($values == null)  {
//            if ($isID) {
//                $values = $this->commmons[$type];
//            }
//            else if ($isURL) {
//                return (object) null;
//            }
//        }
//
//        foreach($values as $value) {
//            foreach($this->types[$type] as $k => $v) {
//                if ($isID ? $v['id'] : $v == $id) {
//                    $obj[$k] = $v;
//                }
//            }
//        }
//
//        return $obj;
//    }

    private function filterById($type, $ids = null) {
        $obj = [];
        $ids = $ids == null ? $this->commons[$type] : $ids;

        // Compare ids, place matches in new object
        foreach($ids as $id) {
            foreach($this->types[$type] as $k => $v) {
                if ($v['id'] == $id) {
                    $obj[$k] = $v;
                }
            }
        }

        return $obj;
    }
    private function filterByUrl($type, $urls = null) {
        if($urls == null) return (object) null;
        $obj = [];

        foreach($urls as $url) {
            foreach($this->types[$type] as $k => $v) {
                if ($k == $url) {
                    $obj[$k] = $v;
                }
            }
        }

        return $obj;
    }

    // List tables and types

    // Link URLs to correct config

}
