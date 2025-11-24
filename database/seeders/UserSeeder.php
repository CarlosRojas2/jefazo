<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
class UserSeeder extends Seeder{
    public function run(): void{
        // Opcional: crear más usuarios
        User::create([
            'name' => 'Usuario Demo',
            'email' => 'demo@example.com',
            'password' => Hash::make('1'),
            'email_verified_at' => now(),
        ]);
    }
}