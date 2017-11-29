<?php
namespace App;

//define('PAGES', 'pages');
//define('DATA', 'data');


// TODO; RENAME DATA TO CONTENT!
class Config {
    const NAME = 'api';
    const PAGES = 'pages';
    const DATA = 'data';
    const MENU = 'menu';

    function __construct()
    {
    }

    public function getConfig() {
        return [

            'prefixes' => [
                Config::NAME => Config::NAME,
                Config::PAGES => Config::PAGES,
                Config::DATA => Config::DATA,
                Config::MENU => Config::MENU
            ],

            // Define common data by key in data config
            'common_data' => [
                'articles',
                'articles2'
            ],
            // Define common pages by key in data config
            'common_pages' => [
                'articles',
                'articles2',
                'articles3',
            ],

            // Page layout data
            Config::PAGES => [],

            // General data request, on new connection
            Config::DATA => [],

            // General data request, on new connection
            Config::MENU => [],

        ];
    }

}




