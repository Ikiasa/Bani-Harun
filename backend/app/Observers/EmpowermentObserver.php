<?php

namespace App\Observers;

use Illuminate\Support\Facades\Cache;

class EmpowermentObserver
{
    private function clearCaches()
    {
        Cache::forget('api.dashboard.empowerment');
    }

    public function created($model) { $this->clearCaches(); }
    public function updated($model) { $this->clearCaches(); }
    public function deleted($model) { $this->clearCaches(); }
    public function restored($model) { $this->clearCaches(); }
    public function forceDeleted($model) { $this->clearCaches(); }
}
