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
        return Product::paginate(3);
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
        return $shop->api()->rest('POST', '/admin/products.json', $addProduct);

    }

    public function delete(Request $request)
    {
        $request->validate([
            'id' => 'required',
        ]);
        $shop = $request->user();
        $requestData = $request->all();
        $product = Product::findOrfail($requestData['id']);
        $url = '/admin/products/'. $product->product_id .'.json';
        try {
            $response = $shop->api()->rest('DELETE', $url);
            if($response['errors']) {
                return response(['message' => $response['body']], 500);
            }
            return response(['message' => 'Product deleted successfully'], 200);
        }
        catch (\Exception $e) {
            return response(['message' => $e->getMessage()], 500);
        }
    }
}
