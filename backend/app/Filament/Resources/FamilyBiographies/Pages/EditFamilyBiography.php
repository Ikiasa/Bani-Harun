<?php

namespace App\Filament\Resources\FamilyBiographies\Pages;

use App\Filament\Resources\FamilyBiographies\FamilyBiographyResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditFamilyBiography extends EditRecord
{
    protected static string $resource = FamilyBiographyResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
