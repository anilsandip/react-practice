<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductsController extends Controller
{
    public function index(Request $request) {
        $search = $request->get('search');
        $products = new Product();
        if($search) {
            $products = $products->where(function ($query) use($search) {
                $query->where('title', 'LIKE', "%$search%")
                      /*->orWhere('description', 'LIKE', "%$search%")*/
                      ->orWhere('price', 'LIKE', "%$search%");
            });
        }
        return $products->paginate(10);
    }

    public function delete(Request $request) {
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
            $product->delete();
            return response(['message' => 'Product deleted successfully'], 200);
        }
        catch (\Exception $e) {
            return response(['message' => $e->getMessage()], 500);
        }
    }
}
