<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Traits\ProductHelpers;
use Illuminate\Console\Command;

class SyncProducts extends Command
{
    use ProductHelpers;
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
                    $this->createProduct($shop, $product);
                }
            }
        }
        while($next);
    }
}
