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
        $response = $shop->api()->rest('GET', '/admin/products.json');
        if(!$response['errors']) {
            $products = $response['body']['products'] ?? [];
            foreach ($products as $product) {
                Product::create([
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
}
