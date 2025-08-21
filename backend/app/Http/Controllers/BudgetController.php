<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    // ✅ Get all budgets
    public function index()
    {
        return response()->json(Budget::all(), 200);
    }

    // ✅ Store a new budget
    public function store(Request $request)
    {
        $userId = $request->user()->id;

        $validated = $request->validate([
            'title' => 'required|string',
            'amount' => 'required|numeric',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            
        ]);

         $budget = Budget::create([
        'title' => $validated['title'],
        'amount' => $validated['amount'],
        'start_date' => $validated['start_date'] ?? now()->startOfMonth(),
        'end_date' => $validated['end_date'] ?? now()->endOfMonth(),
        'user_id' => $userId,
    ]);

        return response()->json($budget, 201);
    }

    // ✅ Show a single budget
    public function show($id)
    {
        $budget = Budget::findOrFail($id);
        return response()->json($budget, 200);
    }

    // ✅ Update budget
    public function update(Request $request, $id)
    {
        $budget = Budget::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string',
            'amount' => 'sometimes|numeric',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date',
        ]);

        $budget->update($validated);

        return response()->json($budget, 200);
    }

    // ✅ Delete budget
    public function destroy($id)
    {
        $budget = Budget::findOrFail($id);
        $budget->delete();

        return response()->json(null, 204);
    }
}
