<?php

namespace App\Filament\Widgets;

use App\Models\FinancialTransaction;
use Filament\Widgets\ChartWidget;
use Flowframe\Trend\Trend;
use Flowframe\Trend\TrendValue;

class FinancialChart extends ChartWidget
{
    protected ?string $heading = 'Tren Keuangan Keluarga';
    
    protected static ?int $sort = 2;

    protected function getData(): array
    {
        // Simple data aggregation if Flowframe/Trend is not installed
        // For now, let's use a simple manual aggregation for the last 6 months
        $data = [];
        $labels = [];
        
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $labels[] = $date->format('M Y');
            $data[] = FinancialTransaction::whereYear('date', $date->year)
                ->whereMonth('date', $date->month)
                ->sum('amount');
        }

        return [
            'datasets' => [
                [
                    'label' => 'Arus Kas (Net)',
                    'data' => $data,
                    'backgroundColor' => '#4f46e5',
                    'borderColor' => '#4f46e5',
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
