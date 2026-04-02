<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['amount', 'type', 'description', 'date'])]
class FinancialTransaction extends Model
{
    //
}
