<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Expense;
use App\Models\Income;

class ReportController extends Controller
{
    public function monthlyReport($year, $month)
    {
        // If you already use Sanctum/JWT auth
        $userId = auth()->id();

        // ⚡️ If no auth yet, uncomment this for testing
        // $userId = 1;

        // Get total expenses for the given month/year
        $totalExpenses = Expense::where('user_id', $userId)
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->sum('amount');

        // Get total incomes for the given month/year
        $totalIncome = Income::where('user_id', $userId)
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->sum('amount');

        // Response JSON
        return response()->json([
            'year' => $year,
            'month' => $month,
            'total_income' => $totalIncome,
            'total_expenses' => $totalExpenses,
            'balance' => $totalIncome - $totalExpenses
        ]);
    }
}