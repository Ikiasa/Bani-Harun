<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FamilyBiography extends Model
{
    protected $fillable = [
        'family_member_id',
        'birth_date',
        'birth_place',
        'partner_name',
        'head_of_family',
        'bio',
        'achievements',
        'timeline',
        'gallery'
    ];

    protected $casts = [
        'birth_date' => 'date',
        'achievements' => 'array',
        'timeline' => 'array',
        'gallery' => 'array'
    ];

    public function familyMember()
    {
        return $this->belongsTo(FamilyMember::class);
    }
}
