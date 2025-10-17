<?php

use App\Http\Controllers\ProducerController;
use App\Http\Controllers\ProductionUnitController;
use App\Http\Controllers\PropertyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('producers', ProducerController::class);
Route::apiResource('properties', PropertyController::class);
Route::apiResource('production-units', ProductionUnitController::class);
