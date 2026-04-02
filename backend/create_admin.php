<?php

$user = \App\Models\User::where('email', 'admin@example.com')->first() ?: new \App\Models\User;
$user->name = 'Admin';
$user->email = 'admin@example.com';
$user->password = \Illuminate\Support\Facades\Hash::make('password');
$user->email_verified_at = now();
$user->save();

echo "User created: " . $user->email . "\n";
