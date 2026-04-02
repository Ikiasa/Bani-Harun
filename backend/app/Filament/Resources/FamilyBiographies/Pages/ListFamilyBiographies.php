<?php

namespace App\Filament\Resources\FamilyBiographies\Pages;

use App\Filament\Resources\FamilyBiographies\FamilyBiographyResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListFamilyBiographies extends ListRecords
{
    protected static string $resource = FamilyBiographyResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
