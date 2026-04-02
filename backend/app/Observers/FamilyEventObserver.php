<?php

namespace App\Observers;

use App\Models\FamilyEvent;
use Illuminate\Support\Facades\Cache;

class FamilyEventObserver
{
    private function clearCaches()
    {
        Cache::forget('api.dashboard.stats');
        Cache::forget('api.dashboard.events');
    }

    public function created(FamilyEvent $model) { $this->clearCaches(); }
    public function updated(FamilyEvent $model) { $this->clearCaches(); }
    public function deleted(FamilyEvent $model) { $this->clearCaches(); }
    public function restored(FamilyEvent $model) { $this->clearCaches(); }
    public function forceDeleted(FamilyEvent $model) { $this->clearCaches(); }
}
