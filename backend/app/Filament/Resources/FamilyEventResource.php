<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FamilyEventResource\Pages;
use App\Models\FamilyEvent;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class FamilyEventResource extends Resource
{
    protected static ?string $model = FamilyEvent::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-calendar';
    
    protected static ?string $navigationLabel = 'Acara Keluarga';

    public static function form(\Filament\Schemas\Schema $form): \Filament\Schemas\Schema
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('title')->label('Nama Acara')->required(),
                Forms\Components\DatePicker::make('date')->label('Tanggal')->required(),
                Forms\Components\Select::make('type')->label('Jenis Acara')->options([
                    'Gathering' => 'Pertemuan',
                    'Meeting' => 'Rapat',
                    'Ceremony' => 'Upacara',
                ])->required(),
                Forms\Components\TextInput::make('location')->label('Lokasi'),
                Forms\Components\TextInput::make('attendees')->label('Jumlah Peserta')->numeric()->default(0),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')->label('Nama Acara')->searchable(),
                Tables\Columns\TextColumn::make('date')->label('Tanggal')->date(),
                Tables\Columns\TextColumn::make('type')->label('Jenis Acara'),
                Tables\Columns\TextColumn::make('location')->label('Lokasi'),
                Tables\Columns\TextColumn::make('attendees')->label('Jumlah Peserta'),
            ])
            ->filters([])
            ->actions([
                \Filament\Actions\EditAction::make(),
            ])
            ->bulkActions([
                \Filament\Actions\BulkActionGroup::make([
                    \Filament\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListFamilyEvents::route('/'),
            'create' => Pages\CreateFamilyEvent::route('/create'),
            'edit' => Pages\EditFamilyEvent::route('/{record}/edit'),
        ];
    }
}
