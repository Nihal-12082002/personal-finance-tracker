<?php

namespace App\Http\Controllers;

use App\Models\Income;
use Illuminate\Http\Request;

class IncomeController extends Controller
{
    public function index()
    {
        return Income::with('category')
            ->where('user_id', auth()->id())
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'amount' => 'required|numeric',
            'date' => 'required|date',
            'description' => 'nullable|string'
        ]);

        $data['user_id'] = auth()->id();

        return Income::create($data);
    }

    public function show($id)
    {
        return Income::with('category')
            ->where('user_id', auth()->id())
            ->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $income = Income::where('user_id', auth()->id())->findOrFail($id);

        $data = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'amount' => 'sometimes|numeric',
            'date' => 'sometimes|date',
            'description' => 'nullable|string'
        ]);

        $income->update($data);

        return $income;
    }

    public function destroy($id)
    {
        $income = Income::where('user_id', auth()->id())->findOrFail($id);
        $income->delete();

        return response()->json(['message' => 'Income deleted']);
    }
}

