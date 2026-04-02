<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\BukuKeluargaController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SettingsController;

// Public Endpoints
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/buku-keluarga', [BukuKeluargaController::class, 'index']);

// Protected Endpoints
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) { return $request->user(); });
    Route::put('/settings/profile', [SettingsController::class, 'updateProfile']);
    
    Route::prefix('dashboard')->group(function () {
        Route::get('/stats', [DashboardController::class, 'stats']);
        Route::get('/members', [DashboardController::class, 'members']);
        Route::get('/tree', [DashboardController::class, 'tree']);
        Route::get('/financials', [DashboardController::class, 'financials']);
        Route::get('/empowerment', [DashboardController::class, 'empowerment']);
        Route::get('/events', [DashboardController::class, 'events']);
    });

    Route::put('/buku-keluarga/{id}', [BukuKeluargaController::class, 'update']);
    Route::delete('/members/{id}', [BukuKeluargaController::class, 'destroy']);
});
