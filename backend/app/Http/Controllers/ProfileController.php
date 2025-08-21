<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function update(Request $request) {
        $user = Auth::user();
        $data = $request->validate([
            'name'=>'sometimes|string|max:255',
            'email'=>'sometimes|email|unique:users,email,' . $user->id,
            'password'=>'sometimes|nullable|min:6|confirmed',
        ]);
        if (array_key_exists('password',$data)) {
            $data['password'] = Hash::make($data['password']);
        }
        $user->update($data);
        return $user;
    }
}

