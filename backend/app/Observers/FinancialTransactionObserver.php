<?php

namespace App\Observers;

use App\Models\FinancialTransaction;
use Illuminate\Support\Facades\Cache;

class FinancialTransactionObserver
{
    private function clearCaches()
    {
        Cache::forget('api.dashboard.stats');
        Cache::forget('api.dashboard.financials');
    }

    public function created(FinancialTransaction $model) { $this->clearCaches(); }
    public function updated(FinancialTransaction $model) { $this->clearCaches(); }
    public function deleted(FinancialTransaction $model) { $this->clearCaches(); }
    public function restored(FinancialTransaction $model) { $this->clearCaches(); }
    public function forceDeleted(FinancialTransaction $model) { $this->clearCaches(); }
}
