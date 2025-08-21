<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder {
    public function run(): void {
        $defaults = [
            ['name'=>'Salary','type'=>'income'],
            ['name'=>'Freelance','type'=>'income'],
            ['name'=>'Food','type'=>'expense'],
            ['name'=>'Travel','type'=>'expense'],
            ['name'=>'Bills','type'=>'expense'],
            ['name'=>'Shopping','type'=>'expense'],
        ];
        foreach ($defaults as $c) {
            DB::table('categories')->insert([
                'user_id'=>null,'name'=>$c['name'],'type'=>$c['type'],
                'created_at'=>now(),'updated_at'=>now(),
            ]);
        }
    }
}

