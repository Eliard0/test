<?php

use App\Http\Controllers\HerdController;
use App\Http\Controllers\HerdExportController;
use App\Http\Controllers\ProducerController;
use App\Http\Controllers\ProductionUnitController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\PropertyExportController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('properties/export-excel', [PropertyExportController::class, 'export']);
Route::get('herds/export-pdf/{producerId}', [HerdExportController::class, 'exportPdf']);


Route::apiResource('producers', ProducerController::class);
Route::apiResource('properties', PropertyController::class);
Route::apiResource('production-units', ProductionUnitController::class);

Route::apiResource('herd', HerdController::class);

