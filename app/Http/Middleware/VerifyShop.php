<?php

namespace App\Http\Middleware;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Osiset\ShopifyApp\Contracts\Objects\Values\ShopDomain as ShopDomainValue;
use Osiset\ShopifyApp\Http\Middleware\VerifyShopify;
use Osiset\ShopifyApp\Util;

class VerifyShop extends VerifyShopify
{

    /**
     * Note: Overwritten this method to avoid getDomain on null error at authenticate page.
     *
     * Redirect to install route.
     *
     * @param ShopDomainValue $shopDomain The shop domain.
     *
     * @return RedirectResponse
     */
    protected function installRedirect(ShopDomainValue $shopDomain): RedirectResponse
    {
        return Redirect::route(
            $shopDomain->toNative() ? Util::getShopifyConfig('route_names.authenticate') : 'install', // Tricked this one.
            ['shop' => $shopDomain->toNative()]);
    }
}
