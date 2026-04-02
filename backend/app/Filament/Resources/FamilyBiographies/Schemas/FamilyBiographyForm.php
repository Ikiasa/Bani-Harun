<?php

namespace App\Filament\Resources\FamilyBiographies\Schemas;

use Filament\Schemas\Schema;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Fieldset;

class FamilyBiographyForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Identitas Anggota')
                    ->schema([
                        TextInput::make('name')
                            ->label('Nama Lengkap')
                            ->required(),
                        Select::make('role')
                            ->label('Peran')
                            ->options([
                                'Pendiri / Sesepuh' => 'Pendiri / Sesepuh (Gen 1)',
                                'Anak' => 'Anak (Gen 2)',
                                'Putu (Cucu)' => 'Putu (Cucu) (Gen 3)',
                                'Buyut (Cicit)' => 'Buyut (Cicit) (Gen 4)',
                                'Canggah' => 'Canggah (Gen 5)',
                                'Wareng' => 'Wareng (Gen 6)',
                                'Udheg-udheg' => 'Udheg-udheg (Gen 7)',
                                'Gantung Siwur' => 'Gantung Siwur (Gen 8)',
                                'Gropak Senthe' => 'Gropak Senthe (Gen 9)',
                                'Debog Bosok' => 'Debog Bosok (Gen 10)',
                            ]),
                        TextInput::make('generation')
                            ->label('Generasi')
                            ->numeric()
                            ->required()
                            ->default(1),
                        Select::make('status')
                            ->label('Status')
                            ->options([
                                'Active' => 'Hidup / Aktif',
                                'Inactive' => 'Wafat / Almarhum',
                            ])
                            ->required(),
                    ])
                    ->columns(3),
                Fieldset::make('Data Biografi')
                    ->relationship('biography')
                    ->schema([
                        TextInput::make('birth_place')
                            ->label('Tempat Lahir'),
                        DatePicker::make('birth_date')
                            ->label('Tanggal Lahir'),
                        TextInput::make('partner_name')
                            ->label('Nama Pasangan'),
                        TextInput::make('head_of_family')
                            ->label('Nama Kepala Keluarga'),
                        RichEditor::make('bio')
                            ->label('Biografi')
                            ->columnSpanFull(),
                        Repeater::make('achievements')
                            ->label('Jejak Karya')
                            ->schema([
                                TextInput::make('title')->label('Pencapaian / Karya')->required(),
                            ])
                            ->columnSpanFull(),
                        Repeater::make('timeline')
                            ->label('Garis Waktu (Timeline)')
                            ->schema([
                                TextInput::make('date')->label('Tahun / Waktu')->required(),
                                TextInput::make('event')->label('Peristiwa')->required(),
                            ])
                            ->columns(2)
                            ->columnSpanFull(),
                        FileUpload::make('gallery')
                            ->label('Galeri Foto')
                            ->image()
                            ->multiple()
                            ->directory('family-biographies')
                            ->columnSpanFull(),
                    ])
                    ->columnSpanFull(),
            ]);
    }
}
