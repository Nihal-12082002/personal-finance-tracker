<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;
    protected $fillable = ['user_id','category_id','type','amount','date','description'];
    protected $casts = ['date'=>'date','amount'=>'decimal:2'];
}
