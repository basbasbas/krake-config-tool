<?php
use App\Http\Controllers\PageController;

class PageControllerTest extends TestCase
{
    public function testPage () {
        $page = factory(App\Page::class)->make();

        // TODO; apply test functions
    }

    public function testJSONSinglePageFound()
    {
        $id = 'articles';
        $response = $this->json('get', '/api/pages/' . $id);

        $response
            ->assertStatus(200)
            ->seeJsonStructure([
                'pages' => [$id]
            ]);
    }
    public function testJSONPageStructure()
    {
        $response = $this->json('get', '/api/pages');

        $response
            ->assertStatus(200)
            ->seeJsonStructure([
                    'pages' => [
                        '*' => [
                            'views' => [
                                'id', 'type', 'template'
                            ]
                        ]
                    ]]
            );
    }


//    public function testHasItemInBox()
//    {
//        $box = new Box(['cat', 'toy', 'torch']);
//
//        $this->assertTrue($box->has('toy'));
//        $this->assertFalse($box->has('ball'));
//    }
}
