@extends('shopify-app::layouts.default')
@section('content')
    <div id="app">
    </div>

    @if(config('shopify-app.appbridge_enabled'))
        <script src="https://unpkg.com/@shopify/app-bridge"></script>
        <script>
            var AppBridge = window['app-bridge'];
            var actions = AppBridge.actions;
            var utils = window['app-bridge-utils'];
            var createApp = AppBridge.default;
            window.shopify_app_bridge = createApp({
                apiKey: "{{ \Osiset\ShopifyApp\Util::getShopifyConfig('api_key', $shopDomain ?? Auth::user()->name ) }}",
                shopOrigin: "{{ $shopDomain ?? Auth::user()->name }}",
                host: "{{ \Request::get('host') }}",
                forceRedirect: true,
            });
        </script>
    @endif
@endsection

@section('scripts')
    @parent
    <input type="hidden" id="apiKey" value="{{ config('shopify-app.api_key') }}">
    <input type="hidden" id="shopOrigin" value="{{\Auth::user()->name}}">
    <input type="hidden" id="planId" value="{{\Auth::user()->plan_id}}">
    <input type="hidden" id="shopify_host" value="{{ base64_encode("https://".\Auth::user()->name."/admin")  }}">
    <script src="{{asset('js/app.js')}}"></script>
@endsection
