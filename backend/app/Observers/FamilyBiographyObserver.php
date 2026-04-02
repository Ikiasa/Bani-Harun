<?php

namespace App\Observers;

use App\Models\FamilyBiography;
use Illuminate\Support\Facades\Cache;

class FamilyBiographyObserver
{
    private function clearCaches()
    {
        Cache::forget('api.buku-keluarga.index');
    }

    public function created(FamilyBiography $model) { $this->clearCaches(); }
    public function updated(FamilyBiography $model) { $this->clearCaches(); }
    public function deleted(FamilyBiography $model) { $this->clearCaches(); }
    public function restored(FamilyBiography $model) { $this->clearCaches(); }
    public function forceDeleted(FamilyBiography $model) { $this->clearCaches(); }
}
