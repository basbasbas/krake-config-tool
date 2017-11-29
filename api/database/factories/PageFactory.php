<?php

$factory->define(App\Page::class, function (Faker\Generator $faker) {
    $id = str_random(10);
    $url = str_random(5);

    return [
        'id' => $id,
        'url' => $url . '/' . $id,
        'views' => function () {
            return factory(App\View::class, 3)->create();
        }
    ];
});
