<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    public function index(Request $request) {
        $q = Transaction::where('user_id', Auth::id());
        if ($request->filled('type')) $q->where('type', $request->type);
        if ($request->filled('category_id')) $q->where('category_id', $request->category_id);
        if ($request->filled('from')) $q->whereDate('date', '>=', $request->from);
        if ($request->filled('to')) $q->whereDate('date', '<=', $request->to);
        return $q->orderBy('date','desc')->paginate(20);
    }

    public function store(Request $request) {
        $data = $request->validate([
            'type'=>'required|in:income,expense',
            'amount'=>'required|numeric|min:0',
            'category_id'=>'nullable|exists:categories,id',
            'date'=>'required|date',
            'description'=>'nullable|string|max:255',
        ]);
        $data['user_id'] = Auth::id();
        return Transaction::create($data);
    }

    public function show(Transaction $transaction) {
        $this->authorizeTx($transaction);
        return $transaction;
    }

    public function update(Request $request, Transaction $transaction) {
        $this->authorizeTx($transaction);
        $data = $request->validate([
            'type'=>'required|in:income,expense',
            'amount'=>'required|numeric|min:0',
            'category_id'=>'nullable|exists:categories,id',
            'date'=>'required|date',
            'description'=>'nullable|string|max:255',
        ]);
        $transaction->update($data);
        return $transaction;
    }

    public function destroy(Transaction $transaction) {
        $this->authorizeTx($transaction);
        $transaction->delete();
        return response()->noContent();
    }

    private function authorizeTx(Transaction $t) {
        if ($t->user_id !== Auth::id()) abort(403);
    }
}
