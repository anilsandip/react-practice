<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Psy\Util\Str;

class ProductsController extends Controller
{
    public function index(Request $request)
    {
        return Product::paginate(10);
    }

    public function show(Request $request, $productId) {
        return Product::findOrFail($productId);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
        ]);
        $shop = $request->user();
        $input = $request->all();
        $images = $request->file('images');

        $variants = [];
        $variants['option1'] = $input['title'];
        $variants['price'] = $input['price'];
        $variants['compare_at_price'] = $input['compareAtPrice'];

        $preparedImages = [];
        foreach ($images as $image) {
            $preparedImages[]['attachment'] = base64_encode(file_get_contents($image->path()));
        }

        $params = [];
        $params['title'] = $input['title'];
        $params['variants'][] = $variants;
        $params['images'] = $preparedImages;

        $addProduct = [];
        $addProduct['product'] = $params;

        try {
            $response = $shop->api()->rest('POST', '/admin/products.json', $addProduct);
        }
        catch(\Exception $e) {
            sleep(1);
            try {
                $response = $shop->api()->rest('POST', '/admin/products.json', $addProduct);
            } catch (\Exception $e) {
                report($e->getMessage());
            }
        }
        if($response['errors'] ?? false) {
            return response(['message' => $response['body'] ?? 'Shopify API failed'], 500);
        }

        $imageLinks = $response['body']['product']['images'] ?? [];
        $productId = $response['body']['product']['id'] ?? null;
        Product::create([
            'shop_id' => $shop->id,
            'product_id' => $productId,
            'title' => $input['title'],
            'description' => $input['description'] ?? '',
            'price' => $input['price'] ?? 0,
            'compare_at_price' => $input['compareAtPrice'] ?? 0,
            'images' => $imageLinks ? collect($imageLinks)->pluck('src')->toArray() : [],
            'author' => $input['authorName'] ?? '',
            'number_of_pages' => $input['numberOfPages'] ?? 0,
            'wholesale_price' => $input['wholesalePrice'] ?? 0,
        ]);
        return response(['message' => 'Product created successfully'], 201);
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
            return response(['message' => $response['body'] ?? 'Shopify API failed'], 500);
        }
        $product->delete();
        return response(['message' => 'Product deleted successfully'], 200);
    }
}
