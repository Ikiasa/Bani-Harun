<?php

namespace App\Filament\Resources\FinancialTransactionResource\Pages;

use App\Filament\Resources\FinancialTransactionResource;
use Filament\Resources\Pages\EditRecord;

class EditFinancialTransaction extends EditRecord
{
    protected static string $resource = FinancialTransactionResource::class;
}
