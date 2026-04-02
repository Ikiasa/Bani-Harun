<?php

namespace App\Observers;

use App\Models\FamilyMember;
use Illuminate\Support\Facades\Cache;

class FamilyMemberObserver
{
    private function clearCaches()
    {
        Cache::forget('api.dashboard.stats');
        Cache::forget('api.dashboard.members');
        Cache::forget('api.dashboard.tree');
        Cache::forget('api.buku-keluarga.index');
    }

    public function created(FamilyMember $model) { $this->clearCaches(); }
    public function updated(FamilyMember $model) { $this->clearCaches(); }
    public function deleted(FamilyMember $model) { $this->clearCaches(); }
    public function restored(FamilyMember $model) { $this->clearCaches(); }
    public function forceDeleted(FamilyMember $model) { $this->clearCaches(); }
}
