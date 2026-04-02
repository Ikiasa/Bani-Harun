<?php

namespace App\Filament\Widgets;

use App\Models\FamilyMember;
use App\Models\FamilyEvent;
use App\Models\FinancialTransaction;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;
    protected function getStats(): array
    {
        $totalMembers = FamilyMember::count();
        $upcomingEvents = FamilyEvent::where('date', '>=', now())->count();
        $totalFunds = FinancialTransaction::sum('amount');
        
        return [
            Stat::make('Total Anggota', $totalMembers)
                ->description('Anggota keluarga terdaftar')
                ->descriptionIcon('heroicon-m-user-group')
                ->color('success'),
            Stat::make('Acara Mendatang', $upcomingEvents)
                ->description('Kegiatan dalam waktu dekat')
                ->descriptionIcon('heroicon-m-calendar')
                ->color('warning'),
            Stat::make('Total Kas Keluarga', 'IDR ' . number_format($totalFunds, 0, ',', '.'))
                ->description('Saldo akumulasi saat ini')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('primary'),
        ];
    }
}
