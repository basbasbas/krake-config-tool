<?php
use App\Http\Controllers\DataController;

class DataControllerTest extends TestCase
{
    public function testPage () {
        $page = factory(App\Page::class)->make();

        // TODO; apply test functions
    }

    public function testJSONSingleDataIdFound()
    {
        $id = 'articles2';
        $url = 'api/data';
        $response = $this->json('get', '/' . $url . $id);

        $response
            ->assertStatus(200)
            ->seeJsonStructure([
                'data' => [$url . $id]
            ]);
    }
    public function testJSONDataStructure()
    {
        $response = $this->json('get', '/api/data');

        $response
            ->assertStatus(200)
            ->seeJsonStructure([
                    'data' => [
                        '*' => [
                            'data' => [
                                'query',
                                'id',
                                '*' => [
                                    'article_ID', 'author', 'title', 'content'
                                ]
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
