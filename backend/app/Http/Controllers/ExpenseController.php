<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index()
    {
        return Expense::with('category')
            ->where('user_id', auth()->id())
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'amount' => 'required|numeric',
            'date' => 'required|date',
            'description' => 'nullable|string'
        ]);

        $data['user_id'] = auth()->id();

        return Expense::create($data);
    }

    public function show($id)
    {
        return Expense::with('category')
            ->where('user_id', auth()->id())
            ->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $expense = Expense::where('user_id', auth()->id())->findOrFail($id);

        $data = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'amount' => 'sometimes|numeric',
            'date' => 'sometimes|date',
            'description' => 'nullable|string'
        ]);

        $expense->update($data);

        return $expense;
    }

    public function destroy($id)
    {
        $expense = Expense::where('user_id', auth()->id())->findOrFail($id);
        $expense->delete();

        return response()->json(['message' => 'Expense deleted']);
    }
}
