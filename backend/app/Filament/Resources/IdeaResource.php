<?php

namespace App\Filament\Resources;

use App\Filament\Resources\IdeaResource\Pages;
use App\Models\Idea;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class IdeaResource extends Resource
{
    protected static ?string $model = Idea::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-light-bulb';
    
    protected static ?string $navigationLabel = 'Ide & Inovasi';

    public static function form(\Filament\Schemas\Schema $form): \Filament\Schemas\Schema
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('title')->label('Judul Ide')->required(),
                Forms\Components\TextInput::make('author')->label('Pengusul'),
                Forms\Components\TextInput::make('votes')->label('Dukungan')->numeric()->default(0),
                Forms\Components\Textarea::make('description')->label('Deskripsi Ide'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')->label('Judul Ide')->searchable(),
                Tables\Columns\TextColumn::make('author')->label('Pengusul'),
                Tables\Columns\TextColumn::make('votes')->label('Dukungan'),
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
            'index' => Pages\ListIdeas::route('/'),
            'create' => Pages\CreateIdea::route('/create'),
            'edit' => Pages\EditIdea::route('/{record}/edit'),
        ];
    }
}
