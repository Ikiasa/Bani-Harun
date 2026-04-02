<?php

namespace App\Filament\Resources\FamilyBiographies;

use App\Filament\Resources\FamilyBiographies\Pages\CreateFamilyBiography;
use App\Filament\Resources\FamilyBiographies\Pages\EditFamilyBiography;
use App\Filament\Resources\FamilyBiographies\Pages\ListFamilyBiographies;
use App\Filament\Resources\FamilyBiographies\Schemas\FamilyBiographyForm;
use App\Filament\Resources\FamilyBiographies\Tables\FamilyBiographiesTable;
use App\Models\FamilyMember;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Forms\Form;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class FamilyBiographyResource extends Resource
{
    protected static ?string $model = FamilyMember::class;

    protected static ?string $navigationLabel = 'Buku Keluarga';
    protected static ?string $modelLabel = 'Buku Keluarga';
    protected static ?string $pluralModelLabel = 'Buku Keluarga';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(\Filament\Schemas\Schema $schema): \Filament\Schemas\Schema
    {
        return FamilyBiographyForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return FamilyBiographiesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getPages(): array
    {
        return [
            'index' => ListFamilyBiographies::route('/'),
            'edit' => EditFamilyBiography::route('/{record}/edit'),
        ];
    }
}
