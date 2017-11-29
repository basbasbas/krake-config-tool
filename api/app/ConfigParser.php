<?php

namespace App;

class ConfigParser
{
    private $config;

    private $pages;
    private $data;
    private $menu;
    private $common_data;
    private $common_pages;
    private $prefixes;
    private $types;
    private $commons;

    private function __construct($type)
    {
        $configObj = new Config();
        $this->config = $configObj->getConfig();

        $this->types = [
            Config::PAGES => &$this->pages,
            Config::DATA => &$this->data,
            Config::MENU => &$this->menu
        ];
        $this->commons = [
            Config::PAGES => &$this->common_pages,
            Config::DATA => &$this->common_data,
        ];

        $this->prefixes = $this->config['prefixes'];
        $this->common_data = $this->config['common_data'];
        $this->common_pages = $this->config['common_pages'];

        if ($type != null) {
            $this->format_config_data($type);
        }

//        $this->types[Config::PAGES] = $responseObj;
    }

//    private function get_data($url) {
//
//        $userAgent = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13';
//
//        $ch = curl_init();
//        curl_setopt($ch, CURLOPT_USERAGENT, $userAgent);
//        curl_setopt($ch, CURLOPT_URL, $url);
//        curl_setopt($ch, CURLOPT_FAILONERROR, true);
//        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
//        curl_setopt($ch, CURLOPT_AUTOREFERER, true);
//        curl_setopt($ch, CURLOPT_RETURNTRANSFER,true);
//        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
//        $html = curl_exec($ch);
//        if (!$html) {
//            echo "<br />cURL error number:" .curl_errno($ch);
//            echo "<br />cURL error:" . curl_error($ch);
//            exit;
//        }
//        else{
//            return $html;
//        }
//    }

    // TODO; Inconsistent function naming conventions
    private function format_config_data($type) {

        // TODO; better naming, this also sets type data
        // TODO; apply domain in url, receive domain through theme URL
        // TODO; extract these to connector classes
        // TODO; make async

        // TODO; load these with a cronjob?

        $this->urls = [
            Config::PAGES => 'http://localhost/wordpress/site1/index.php/wp-json/test-plugin/website-page-config',
            config::DATA => 'http://localhost/wordpress/site1/index.php/wp-json/test-plugin/website-data-config',
            Config::MENU => 'http://localhost/wordpress/site1/index.php/wp-json/test-plugin/website-menu-config'
        ];

        $config = json_decode(file_get_contents($this->urls[$type]), true);
//        $pageConfig = json_decode(file_get_contents('../public/pages.json'), true);
//        $dataConfig = json_decode(file_get_contents('../public/data.json'), true);
//        $menuConfig = json_decode(file_get_contents('../public/menu.json'), true);


//        $pageConfig = json_decode($this->get_data('http://localhost/wordpress/site1/wp-json/test-plugin/website-page-config'), true);
//        $dataConfig = json_decode($this->get_data('http://localhost/wordpress/site1/wp-json/test-plugin/website-data-config'), true);
//        $menuConfig = json_decode($this->get_data('http://localhost/wordpress/site1/wp-json/test-plugin/website-menu-config'), true);


//        if ($type == Config::PAGES) {
//            $this->types[$type] = $this->setUrlPrefixes($pageConfig, $type);
//            return;
//        }
//        if ($type == Config::DATA) {
//            $this->types[$type] = $this->setUrlPrefixes($dataConfig, $type);
//            return;
//        }

//        $typeToConfig = [
//            Config::PAGES => $pageConfig,
//            Config::DATA => $dataConfig,
//            Config::MENU => $menuConfig,
//        ];

//        foreach ($this->types as $type => $v) {
//            $this->types[$type] = $this->setUrlPrefixes($typeToConfig[$type], $type);
//        }
        $this->types[$type] = $this->setUrlPrefixes($config, $type);

        return;
//        echo print_r($response);
//        echo '---------------------------';
//        echo print_r($this->pages);

//        $this->types[$type] = $this->setUrlPrefixes($this->config[$type], $type);
    }

    // Singleton
    private function __clone() {}
    private function __wakeup() {}
    public static function Instance($type = null) {
        static $inst = null;
        // TODO: re-check use of singleton
//        if ($inst === null) {
            $inst = new ConfigParser($type);
//        }

        return $inst;
    }

    // Add client url as seperate prop
    // Replace client url with server url
    private function setUrlPrefixes($array, $type) {
        if ($type == Config::MENU) return $array;

        foreach ($array as $key => $value) {
            $newKey = $this->getFullPrefixes()[$type] . '/' . $key;

            $array[$key]['id'] = $key;
            $array[$newKey] = $array[$key];
            unset($array[$key]);
        }

        return $array;
    }

    public function getFullPrefixes() {
        return array(
            Config::DATA => $this->prefixes[Config::NAME] . '/' . $this->prefixes[Config::DATA],
            Config::PAGES => $this->prefixes[Config::NAME] . '/' . $this->prefixes[Config::PAGES],
            Config::MENU => $this->prefixes[Config::NAME] . '/' . $this->prefixes[Config::MENU]
        );
    }

    // Verbose functions
    public function getMenu()           { return $this->menu; }
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
