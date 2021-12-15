{{--@extends('shopify-app::layouts.default')--}}

{{--@section('content')--}}
{{--    <!-- You are: (shop domain name) -->--}}
{{--    <p>You are: {{ $shopDomain ?? Auth::user()->name }}</p>--}}
{{--    <div id="app">--}}
{{--    </div>--}}
{{--@endsection--}}

{{--@section('scripts')--}}
{{--    @parent--}}
{{--    <script>--}}
{{--         actions.TitleBar.create(app, { title: 'Welcome' });--}}
{{--    </script>--}}
{{--    <script src="{{mix('js/app.js')}}" async></script>--}}
{{--@endsection--}}

<!DOCTYPE html>
<html>
<head>
    <meta name="csrf-token" content="{{csrf_token()}}">
    <title>Test React</title>
</head>
<body>
<div class="mainDivision">
    <div id="app"></div>
</div>
<script src="{{ mix('js/app.js')}}"></script>
</body>
</html>
