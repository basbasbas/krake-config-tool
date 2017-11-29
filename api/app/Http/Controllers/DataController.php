<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Contracts\Configuration;
use Illuminate\Http\Request;
use App\ConfigParser;

class DataController extends Controller implements Configuration
{
    private $config;

    public function __construct()
    {
        $this->config = ConfigParser::Instance(\App\Config::DATA);
    }

    public function getConnector()
    {
        // TODO: Implement connector structure
    }

    private function queryData($data) {
        // Return empty json if no data
        if (!$data) return (object) null;
        $queriedData = $data;

        foreach($queriedData as $key => $value) {
            if (array_key_exists($key, $queriedData) && array_key_exists('query', $queriedData[$key])) {
                // TODO; query validation
                $queriedData[$key]['data'] = app('db')->select($data[$key]['query']);
            }
        }

        return $queriedData;
    }

    public function setupAllData(Request $request)
    {
        $data = $this->config->getData();

        return $this->setupData($data);
    }
    public function setupCommonData(Request $request)
    {
        $data = $this->config->getCommonData();

        return $this->setupData($data);
    }
    public function setupDataByUrl(Request $request)
    {
        $data = $this->config->getDataByUrl($request->path());

        return $this->setupData($data);
    }
    public function setupDataByUrls(Request $request)
    {
    }

    private function formatData($data) {
        return $data = array(
            'data' => $data
        );
    }

    private function setupData($data) {
        // TODO: Extract this to format class
        $obj = [];
        $formatted = [];

        $queriedData = $this->queryData($data);
        $formatted = $this->formatData($queriedData);
        $json = json_encode($formatted);

        return $json;
    }

}
