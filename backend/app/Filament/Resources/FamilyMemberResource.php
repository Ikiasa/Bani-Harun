<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FamilyMemberResource\Pages;
use App\Models\FamilyMember;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class FamilyMemberResource extends Resource
{
    protected static ?string $model = FamilyMember::class;

    protected static ?string $recordTitleAttribute = 'name';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-users';
    
    protected static ?string $navigationLabel = 'Anggota Keluarga';

    public static function form(\Filament\Schemas\Schema $form): \Filament\Schemas\Schema
    {
        return $form
            ->schema([
                Forms\Components\FileUpload::make('photo')
                    ->label('Foto Profil')
                    ->image()
                    ->avatar()
                    ->disk('public')
                    ->directory('family-photos')
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('name')->label('Nama')->required(),
                Forms\Components\Select::make('role')->label('Peran')->options([
                    'Pendiri / Sesepuh' => 'Pendiri / Sesepuh',
                    'Kepala Keluarga' => 'Kepala Keluarga',
                    'Anak' => 'Anak: Generasi pertama',
                    'Putu (Cucu)' => 'Putu (Cucu): Generasi kedua',
                    'Buyut (Cicit)' => 'Buyut (Cicit): Generasi ketiga',
                    'Canggah' => 'Canggah: Generasi keempat',
                    'Wareng' => 'Wareng: Generasi kelima',
                    'Udheg-udheg' => 'Udheg-udheg: Generasi keenam',
                    'Gantung Siwur' => 'Gantung Siwur: Generasi ketujuh',
                    'Gropak Senthe' => 'Gropak Senthe: Generasi kedelapan',
                    'Debog Bosok' => 'Debog Bosok: Generasi kesembilan',
                    'Galih Asem' => 'Galih Asem: Generasi kesepuluh',
                ]),
                Forms\Components\TextInput::make('generation')->label('Generasi')->numeric()->default(1),
                Forms\Components\Select::make('status')->label('Status')->options([
                    'Active' => 'Aktif',
                    'Inactive' => 'Nonaktif',
                ])->default('Active'),
                Forms\Components\DatePicker::make('last_active')->label('Terakhir Aktif'),
                Forms\Components\Select::make('parent_id')
                    ->relationship('parent', 'name')
                    ->label('Anggota Induk / Orang Tua'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('photo')
                    ->label('Foto')
                    ->circular(),
                Tables\Columns\TextColumn::make('name')->label('Nama')->searchable(),
                Tables\Columns\TextColumn::make('role')->label('Peran'),
                Tables\Columns\TextColumn::make('generation')->label('Generasi'),
                Tables\Columns\BadgeColumn::make('status')->label('Status')
                    ->colors([
                        'success' => 'Active',
                        'danger' => 'Inactive',
                    ])
                    ->formatStateUsing(fn (string $state): string => $state === 'Active' ? 'Aktif' : 'Nonaktif'),
                Tables\Columns\TextColumn::make('parent.name')->label('Orang Tua'),
            ])
            ->filters([
                //
            ])
            ->actions([
                \Filament\Actions\EditAction::make(),
                \Filament\Actions\DeleteAction::make(),
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
            'index' => Pages\ListFamilyMembers::route('/'),
            'create' => Pages\CreateFamilyMember::route('/create'),
            'edit' => Pages\EditFamilyMember::route('/{record}/edit'),
        ];
    }
}
