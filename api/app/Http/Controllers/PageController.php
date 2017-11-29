<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Contracts\Configuration;
use Illuminate\Http\Request;
use App\ConfigParser;
use Validator;

class PageController extends Controller implements Configuration
{
    private $config;

    // Use injection later
//    public function __construct(ConfigParser $parser)
    public function __construct()
    {
        // Use singleton for now
        $this->config = ConfigParser::Instance(\App\Config::PAGES);

//        $this->config = $parser;
    }

    public function getConnector(Connector $connector)
    {
        $connector.start($config);
    }


    private function validatePageJSON($page) {
        // TODO: extract configuration and apply ubiquitously
        /** @var \Illuminate\Contracts\Validation\Validator $validation */
        $validation = Validator::make(
            $page,
            [
                'views.*.id' => 'required|max:255',
                'views.*.type' => 'required|max:255'
            ]
        );

        if ($validation->fails()) {
            dd($validation->getMessageBag()->all());
        }
    }


    public function setupAllPages(Request $request) {
        $pages = $this->config->getPages();
        return $this->setupPage($pages);
    }
    public function setupCommonPages(Request $request) {
        $pages = $this->config->getCommonPages();
        return $this->setupPage($pages);
    }

    public function setupPageByUrls(Request $request) {

    }

    private function setupPage($page) {
        // TODO: Extract this to format class
        $formatted = $this->formatPage($page);

        return json_encode($formatted);
    }

    public function setupPageByUrl(Request $request) {
        $page = $this->config->getPageByUrl($request->path());

        $this->validatePageJSON($page);
        return $this->setupPage($page);
    }

    private function formatPage($page) {
        return $page = array(
            'pages' => $page
        );
    }

    // TODO; replace this function to configparser / thin controller
//    private function setupPage($request, $config) {
//        $views = array();
//
//        foreach($config['views'] as $view) {
//            array_push($views, $view->getData());
//        }
//
//        return array(
//            'url' => $request->path(),
//            'id' => $config['id'],
//            'options' => $views
//        );
//    }

}
