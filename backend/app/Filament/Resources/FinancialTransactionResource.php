<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FinancialTransactionResource\Pages;
use App\Models\FinancialTransaction;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class FinancialTransactionResource extends Resource
{
    protected static ?string $model = FinancialTransaction::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-banknotes';
    
    protected static ?string $navigationLabel = 'Keuangan';

    public static function form(\Filament\Schemas\Schema $form): \Filament\Schemas\Schema
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('amount')->label('Jumlah')->numeric()->required(),
                Forms\Components\TextInput::make('type')->label('Tipe (Masuk/Keluar)')->required(),
                Forms\Components\TextInput::make('description')->label('Keterangan'),
                Forms\Components\DatePicker::make('date')->label('Tanggal')->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('date')->label('Tanggal')->date(),
                Tables\Columns\TextColumn::make('amount')->label('Jumlah')->money('IDR'),
                Tables\Columns\TextColumn::make('type')->label('Tipe'),
                Tables\Columns\TextColumn::make('description')->label('Keterangan'),
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
            'index' => Pages\ListFinancialTransactions::route('/'),
            'create' => Pages\CreateFinancialTransaction::route('/create'),
            'edit' => Pages\EditFinancialTransaction::route('/{record}/edit'),
        ];
    }
}
