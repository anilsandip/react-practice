<?php

namespace App\Console\Commands;

use App\Models\Product;
use App\Models\User;
use Illuminate\Console\Command;

class SyncProducts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:products';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $shop = User::find(3);
        if(!$shop) {
            echo "Shop not found";
            return 0;
        }
        $params = ['limit' => 250];
        do {
            $response = null;
            try {
                $response = $shop->api()->rest('GET', '/admin/products.json', $params);
            }
            catch (\Exception $e) {
                sleep(1);
                try {
                    $response = $shop->api()->rest('GET', '/admin/products.json', $params);
                } catch (\Exception $e) {
                    report($e->getMessage());
                }
            }
            $next = $response['link']['next'] ?? null;
            $params['page_info'] = $next;

            if($response && !$response['errors']) {
                $products = $response['body']['products'] ?? [];
                foreach ($products as $product) {
                    Product::updateOrCreate([
                        'shop_id' => $shop->id,
                        'product_id' => $product['id'],
                    ],[
                        'shop_id' => $shop->id,
                        'product_id' => $product['id'],
                        'title' => $product['title'],
                        'description' => $product['body_html'] ?? '',
                        'price' => $product['variants'][0]['price'],
                        'compare_at_price' => $product['variants'][0]['compare_at_price'],
                        'images' => collect($product['images'])->pluck('src')->toArray(),
                    ]);
                }
            }
        }
        while($next);
    }
}
