<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProgramResource\Pages;
use App\Models\Program;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ProgramResource extends Resource
{
    protected static ?string $model = Program::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-academic-cap';
    
    protected static ?string $navigationLabel = 'Program Pelatihan';

    public static function form(\Filament\Schemas\Schema $form): \Filament\Schemas\Schema
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('title')->label('Nama Program')->required(),
                Forms\Components\DatePicker::make('date')->label('Tanggal Pelaksanaan')->required(),
                Forms\Components\TextInput::make('instructor')->label('Pemateri'),
                Forms\Components\Textarea::make('description')->label('Keterangan Program'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')->label('Nama Program')->searchable(),
                Tables\Columns\TextColumn::make('date')->label('Tanggal Pelaksanaan')->date(),
                Tables\Columns\TextColumn::make('instructor')->label('Pemateri'),
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
            'index' => Pages\ListPrograms::route('/'),
            'create' => Pages\CreateProgram::route('/create'),
            'edit' => Pages\EditProgram::route('/{record}/edit'),
        ];
    }
}
