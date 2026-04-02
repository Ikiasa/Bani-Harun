<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

class FamilyMember extends Model
{
    protected $fillable = ['name', 'role', 'photo', 'generation', 'status', 'avatar', 'last_active', 'parent_id'];

    public function parent()
    {
        return $this->belongsTo(FamilyMember::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(FamilyMember::class, 'parent_id');
    }

    public function biography()
    {
        return $this->hasOne(FamilyBiography::class);
    }
}
