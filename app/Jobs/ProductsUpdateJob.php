<?php namespace App\Jobs;

use App\Models\Product;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Osiset\ShopifyApp\Objects\Values\ShopDomain;
use stdClass;

class ProductsUpdateJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Shop's myshopify domain
     *
     * @var ShopDomain|string
     */
    public $shopDomain;

    /**
     * The webhook data
     *
     * @var object
     */
    public $data;

    /**
     * Create a new job instance.
     *
     * @param string   $shopDomain The shop's myshopify domain.
     * @param stdClass $data       The webhook data (JSON decoded).
     *
     * @return void
     */
    public function __construct($shopDomain, $data)
    {
        $this->shopDomain = $shopDomain;
        $this->data = $data;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $shop = User::where('name', $this->shopDomain)->firstOrFail();
        $productData = json_decode(json_encode($this->data), true);
        $productData = collect($productData)->toArray();
        $product = Product::where('shop_id', $shop->id)->where('product_id', $productData['id'])->firstOrFail();
        $product->update([
            'title' => $productData['title'],
            'description' => $productData['body_html'] ?? '',
            'price' => $productData['variants'][0]['price'],
            'compare_at_price' => $productData['variants'][0]['compare_at_price'],
            'images' => collect($productData['images'])->pluck('src')->toArray(),
        ]);
    }
}
