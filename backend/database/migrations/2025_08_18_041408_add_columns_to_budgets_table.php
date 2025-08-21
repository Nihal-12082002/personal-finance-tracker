<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    Schema::table('budgets', function (Blueprint $table) {
        if (!Schema::hasColumn('budgets', 'title')) {
            $table->string('title')->after('user_id');
        }
        if (!Schema::hasColumn('budgets', 'amount')) {
            $table->decimal('amount', 10, 2)->after('title');
        }
        if (!Schema::hasColumn('budgets', 'start_date')) {
            $table->date('start_date')->after('amount');
        }
        if (!Schema::hasColumn('budgets', 'end_date')) {
            $table->date('end_date')->after('start_date');
        }
    });
}


    public function down(): void
    {
        Schema::table('budgets', function (Blueprint $table) {
            $table->dropColumn(['title', 'amount', 'start_date', 'end_date']);
        });
    }
};
