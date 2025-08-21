<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('budget_id')->nullable();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('title')->default('Untitled Expense')->change();

            $table->decimal('amount', 10, 2);
            $table->date('date');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('budget_id')->references('id')->on('budgets')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
