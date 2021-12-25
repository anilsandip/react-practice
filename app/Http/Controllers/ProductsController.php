<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Traits\ProductHelpers;
use Illuminate\Http\Request;

class ProductsController extends Controller
{
    use ProductHelpers;

    public function index()
    {
        return Product::latest()->paginate(10);
    }

    public function show($productId) {
        return Product::findOrFail($productId);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
        ]);
        $shop = $request->user();
        $input = $request->all();

        $variants = [];
        if (isset($input['variant_id'])) {
            $variants['id'] = $input['variant_id'];
        }
        $variants['option1'] = $input['title'];
        $variants['price'] = $input['price'];
        $variants['compare_at_price'] = $input['compareAtPrice'];

        $preparedImages = [];

        $images = $input['images'] ?? [];
        foreach ($images as $image) {
            $preparedImages[]['id'] = $image;
        }

        $images = $request->file('imageFiles') ?? [];
        foreach ($images as $image) {
            $preparedImages[]['attachment'] = base64_encode(file_get_contents($image->path()));
        }

        $params = [];
        $params['title'] = $input['title'];
        $params['body_html'] = $input['description'];
        $params['variants'][] = $variants;
        $params['images'] = $preparedImages;

        $addProduct = [];
        $addProduct['product'] = $params;
        $productId = $input['product_id'] ?? null;
        $url = $productId ? '/admin/products/'.$productId.'.json' : '/admin/products.json';
        $method = $productId ? 'PUT' : 'POST';

        try {
            $response = $shop->api()->rest($method, $url, $addProduct);
        }
        catch(\Exception $e) {
            sleep(1);
            try {
                $response = $shop->api()->rest($method, $url, $addProduct);
            } catch (\Exception $e) {
                report($e->getMessage());
            }
        }

        if($response['errors'] ?? false) {
            return response(['message' => 'Shopify API failed'], 500);
        }

        $input['images'] = $response['body']['product']['images'] ?? [];
        $input['id'] = $response['body']['product']['id'] ?? null;
        $input['variants'] = $response['body']['product']['variants'] ?? null;
        $input['body_html'] = $input['description'];
        $this->createProduct($shop, $input);
        return response(['message' => $productId ? 'Product updated successfully' : 'Product created successfully'], 200);
    }

    public function delete(Request $request, $productId)
    {
        $shop = $request->user();
        $product = Product::findOrfail($productId);
        $url = '/admin/products/'. $product->product_id .'.json';
        try {
            $response = $shop->api()->rest('DELETE', $url);
        }
        catch (\Exception $e) {
            sleep(1);
            try {
                $response = $shop->api()->rest('DELETE', $url);
            } catch (\Exception $e) {
                report($e->getMessage());
            }
        }
        if($response['errors'] ?? false) {
            return response(['message' => 'Shopify API failed'], 500);
        }
        $product->delete();
        return response(['message' => 'Product deleted successfully'], 200);
    }
}
