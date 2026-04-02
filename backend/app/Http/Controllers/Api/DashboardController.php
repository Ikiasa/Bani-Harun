<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\FamilyMember;
use App\Models\FamilyEvent;
use App\Models\FinancialTransaction;
use App\Models\Opportunity;
use App\Models\Program;
use App\Models\Idea;

class DashboardController extends Controller
{
    public function stats()
    {
        return \Illuminate\Support\Facades\Cache::rememberForever('api.dashboard.stats', function () {
            $totalMembers = FamilyMember::count();
            $upcomingEventsCount = FamilyEvent::where('date', '>=', now())->count();
            $totalBalance = FinancialTransaction::sum('amount');
            
            $lastMonthBalance = FinancialTransaction::where('date', '<', now()->startOfMonth())->sum('amount');
            $growth = $lastMonthBalance > 0 ? (($totalBalance - $lastMonthBalance) / $lastMonthBalance) * 100 : 0;

            return [
                'totalMembers' => $totalMembers,
                'upcomingEvents' => $upcomingEventsCount,
                'totalFunds' => (float)$totalBalance,
                'growth' => round($growth, 1),
                'monthlyContribution' => (float)FinancialTransaction::where('type', 'Contribution')->where('date', '>=', now()->startOfMonth())->sum('amount'),
                'recentExpenses' => (float)abs(FinancialTransaction::where('amount', '<', 0)->where('date', '>=', now()->startOfMonth())->sum('amount')),
            ];
        });
    }

    public function members()
    {
        return response()->json(\Illuminate\Support\Facades\Cache::rememberForever('api.dashboard.members', function () {
            return FamilyMember::all();
        }));
    }

    public function tree()
    {
        // Recursive tree builder
        $tree = \Illuminate\Support\Facades\Cache::rememberForever('api.dashboard.tree', function () {
            $members = FamilyMember::select('id', 'name', 'generation', 'parent_id', 'status', 'role')->get();
            return $this->buildTree($members);
        });
        return response()->json($tree);
    }

    private function buildTree($members, $parentId = null)
    {
        $branch = [];
        foreach ($members as $member) {
            if ($member->parent_id == $parentId) {
                $children = $this->buildTree($members, $member->id);
                if ($children) {
                    $member->children = $children;
                }
                $branch[] = $member;
            }
        }
        return $branch;
    }

    public function financials()
    {
        return response()->json(\Illuminate\Support\Facades\Cache::rememberForever('api.dashboard.financials', function () {
            return [
                'summary' => $this->stats(),
                'transactions' => FinancialTransaction::latest('date')->take(10)->get(),
            ];
        }));
    }

    public function empowerment()
    {
        return response()->json(\Illuminate\Support\Facades\Cache::rememberForever('api.dashboard.empowerment', function () {
            return [
                'opportunities' => Opportunity::all(),
                'programs' => Program::all(),
                'ideas' => Idea::all(),
            ];
        }));
    }

    public function events()
    {
        return response()->json(\Illuminate\Support\Facades\Cache::rememberForever('api.dashboard.events', function () {
            return FamilyEvent::latest('date')->get();
        }));
    }
}
