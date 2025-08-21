<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\IncomeController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/reports/{year}/{month}', [ReportController::class, 'monthlyReport']);
    Route::post('/logout', [AuthController::class, 'logout']);
    

    // Budgets
    Route::apiResource('budgets', BudgetController::class);

    // Categories
    Route::apiResource('categories', CategoryController::class);

    // Expenses
    Route::apiResource('expenses', ExpenseController::class);

    //Income
    Route::apiResource('incomes', IncomeController::class);

    // Reports
    Route::prefix('reports')->group(function () {
        Route::get('/monthly/{month}/{year}', [ReportController::class, 'monthlyReport']);
        Route::get('/trends', [ReportController::class, 'monthlyTrends']);
        Route::get('/category-wise/{month}/{year}', [ReportController::class, 'categoryWise']);
       
        
    });

    // Alerts
    Route::get('/alerts/overspending', [ReportController::class, 'overspendingAlert']);
});
