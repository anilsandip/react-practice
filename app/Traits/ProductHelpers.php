<?php

namespace App\Traits;

use App\Models\Product;
trait ProductHelpers
{
    public function createProduct($shop, $productData, $from = 'api')
    {
        $images = $productData['images'] ? collect($productData['images'])->pluck('src', 'id')->toArray() : [];
        foreach ($images as $key => $value) {
            $preparedImages[] = [
                'id' => $key,
                'src' => $value
            ];
        }
        $data = [
            'shop_id' => $shop->id,
            'product_id' => $productData['id'],
            'variant_id' => $productData['variants'][0]['id'] ?? null,
            'title' => $productData['title'],
            'description' => $productData['body_html'] ?? '',
            'price' => $productData['variants'][0]['price'] ?? 0,
            'compare_at_price' => $productData['variants'][0] ? $productData['variants'][0]['compare_at_price'] : 0,
            'images' => $preparedImages ?? [],
        ];

        if($from === 'api') {
            $data['author'] = $productData['authorName'] ?? '';
            $data['number_of_pages'] = $productData['numberOfPages'] ?? 0;
            $data['wholesale_price'] = $productData['wholesalePrice'] ?? 0;
        }

        Product::updateOrCreate([
            'shop_id' => $shop->id,
            'product_id' => $productData['id'],
        ],
            $data
        );
    }
}
