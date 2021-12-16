<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/install', function (Request $request) {
    return view('install');
})->name('install');

Route::group(['middleware' => ['verify.shop']], function () {
    Route::get('/', function (Request $request) {
        return view('welcome');
    })->name('home');

    Route::get('{url?}', function () {
        return view('welcome');
    })->where('url', '.*');
});
