<?php

namespace App\Filament\Resources\FamilyBiographies\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;

class FamilyBiographiesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Anggota Keluarga')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('generation')
                    ->label('Generasi')
                    ->sortable(),
                TextColumn::make('role')
                    ->label('Peran'),
                TextColumn::make('biography.birth_place')
                    ->label('Tempat Lahir')
                    ->searchable(),
                TextColumn::make('biography.birth_date')
                    ->label('Tanggal Lahir')
                    ->date()
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->headerActions([
                \Filament\Actions\Action::make('export_pdf_all')
                    ->label('Ekspor Seluruh Buku (PDF)')
                    ->icon('heroicon-o-document-arrow-down')
                    ->color('warning')
                    ->action(function () {
                        $members = \App\Models\FamilyMember::with('biography')->get();
                        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.family-book', ['members' => $members]);
                        return response()->streamDownload(function () use ($pdf) {
                            echo $pdf->stream();
                        }, 'Buku_Keluarga_Bani_Harun_Lengkap.pdf');
                    }),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    \Filament\Actions\BulkAction::make('export_pdf_selected')
                        ->label('Ekspor Terpilih (PDF)')
                        ->icon('heroicon-o-document-arrow-down')
                        ->action(function (\Illuminate\Database\Eloquent\Collection $records) {
                            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.family-book', ['members' => $records]);
                            return response()->streamDownload(function () use ($pdf) {
                                echo $pdf->stream();
                            }, 'Buku_Keluarga_Terpilih.pdf');
                        }),
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
