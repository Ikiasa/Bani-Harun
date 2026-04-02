<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OpportunityResource\Pages;
use App\Models\Opportunity;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class OpportunityResource extends Resource
{
    protected static ?string $model = Opportunity::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-briefcase';
    
    protected static ?string $navigationLabel = 'Peluang';

    public static function form(\Filament\Schemas\Schema $form): \Filament\Schemas\Schema
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('title')->label('Nama Peluang')->required(),
                Forms\Components\Textarea::make('description')->label('Deskripsi'),
                Forms\Components\Select::make('category')->label('Kategori')->options([
                    'Job' => 'Pekerjaan',
                    'Business' => 'Bisnis',
                    'Investment' => 'Investasi',
                ])->required(),
                Forms\Components\Select::make('status')->label('Status')->options([
                    'Open' => 'Terbuka',
                    'Closed' => 'Ditutup',
                ])->default('Open'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')->label('Nama Peluang')->searchable(),
                Tables\Columns\TextColumn::make('category')->label('Kategori'),
                Tables\Columns\BadgeColumn::make('status')->label('Status')
                    ->colors([
                        'success' => 'Open',
                        'danger' => 'Closed',
                    ])
                    ->formatStateUsing(fn (string $state): string => $state === 'Open' ? 'Terbuka' : 'Ditutup'),
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
            'index' => Pages\ListOpportunities::route('/'),
            'create' => Pages\CreateOpportunity::route('/create'),
            'edit' => Pages\EditOpportunity::route('/{record}/edit'),
        ];
    }
}
