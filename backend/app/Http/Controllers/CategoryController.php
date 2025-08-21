<?php
namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index() {
        return response()->json(Category::where('user_id', auth()->id())->get());
    }

    public function store(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,expense',
        ]);

        $category = Category::create([
            'user_id' => auth()->id(),
            'name'    => $request->name,
            'type'    => $request->type,
        ]);

        return response()->json($category, 201);
    }

    public function show($id) {
        $category = Category::where('user_id', auth()->id())->findOrFail($id);
        return response()->json($category);
    }

    public function update(Request $request, $id) {
        $category = Category::where('user_id', auth()->id())->findOrFail($id);

        $category->update($request->only('name', 'type'));

        return response()->json($category);
    }

    public function destroy($id) {
        $category = Category::where('user_id', auth()->id())->findOrFail($id);
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }
}

