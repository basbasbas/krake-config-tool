<?php

namespace App;
use App\ConfigParser;

// Grab settings in config based on route (route does not denote context)
$config = ConfigParser::Instance();
$prefixes = $config->getFullPrefixes();

// TODO: Apply when using
/*$app->group(['middleware' => 'JsonApiMiddleware'], function () use ($pageUrls, $dataUrls, $prefixes, $app) {
});*/

// TODO: Use caching for this; redis?
//$pageUrls = $config->getPageUrls();
//$dataUrls  = $config->getDataUrls();
// Page requests
//foreach ($pageUrls as $url) {
//    $app->get($url, 'PageController@setupPageByUrl');
//}
// Data requests
//foreach ($dataUrls as $url) {
//    $app->get($url, 'DataController@setupDataByUrl');
//}

$app->get($prefixes[Config::PAGES], 'PageController@setupAllPages');
$app->get($prefixes[Config::DATA], 'DataController@setupAllData');
$app->get($prefixes[Config::MENU], 'MenuController@setupMenu');




$app->get('test', function () use ($prefixes) {
    return $prefixes[Config::DATA];
});



//$app->get('start', 'TransformationController@Transform');

