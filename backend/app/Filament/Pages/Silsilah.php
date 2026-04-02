<?php

namespace App\Filament\Pages;

use App\Models\FamilyMember;
use Filament\Pages\Page;

class Silsilah extends Page
{
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-share';

    protected string $view = 'filament.pages.silsilah';
    
    protected static ?string $navigationLabel = 'Silsilah Keluarga';
    protected static ?string $title = 'Silsilah Keluarga';

    public $rootMembers;

    public function mount()
    {
        $this->rootMembers = FamilyMember::with('biography')->get();
    }
}
