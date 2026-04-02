<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \App\Models\FamilyMember::observe(\App\Observers\FamilyMemberObserver::class);
        \App\Models\FamilyBiography::observe(\App\Observers\FamilyBiographyObserver::class);
        \App\Models\FamilyEvent::observe(\App\Observers\FamilyEventObserver::class);
        \App\Models\FinancialTransaction::observe(\App\Observers\FinancialTransactionObserver::class);
        
        \App\Models\Opportunity::observe(\App\Observers\EmpowermentObserver::class);
        \App\Models\Program::observe(\App\Observers\EmpowermentObserver::class);
        \App\Models\Idea::observe(\App\Observers\EmpowermentObserver::class);
    }
}
