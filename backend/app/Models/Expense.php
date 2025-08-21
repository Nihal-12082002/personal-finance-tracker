<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'budget_id',
        'category_id',
        'title',
        'amount',
        'date',
        'description',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function budget()
    {
        return $this->belongsTo(Budget::class);
    }

     public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
