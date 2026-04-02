<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FamilyMember;
use Illuminate\Http\Request;

class BukuKeluargaController extends Controller
{
    public function index()
    {
        $members = \Illuminate\Support\Facades\Cache::rememberForever('api.buku-keluarga.index', function () {
            return FamilyMember::with('biography')
                ->orderBy('generation', 'asc')
                ->orderBy('id', 'asc')
                ->get();
        });
            
        return response()->json($members)
            ->header('Cache-Control', 'public, max-age=300');
    }

    public function update(Request $request, $id)
    {
        $member = FamilyMember::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'nullable|string',
            'role' => 'nullable|string',
            'generation' => 'nullable|integer',
            'birth_place' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'partner_name' => 'nullable|string',
            'head_of_family' => 'nullable|string',
            'bio' => 'nullable|string',
            'achievements' => 'nullable|array',
            'timeline' => 'nullable|array',
            'gallery' => 'nullable|array',
        ]);

        // Update core member data
        $member->update([
            'name' => $validated['name'] ?? $member->name,
            'role' => $validated['role'] ?? $member->role,
            'generation' => $validated['generation'] ?? $member->generation,
        ]);

        $biography = $member->biography;
        if (!$biography) {
            $biography = new \App\Models\FamilyBiography();
            $biography->family_member_id = $member->id;
        }

        $biography->fill($validated);
        $biography->save();

        return response()->json([
            'message' => 'Biografi berhasil diperbarui',
            'biography' => $biography
        ]);
    }

    public function destroy($id)
    {
        $member = FamilyMember::findOrFail($id);
        
        if ($member->biography) {
            $member->biography->delete();
        }
        
        $member->delete();

        return response()->json([
            'message' => 'Anggota keluarga berhasil dihapus'
        ]);
    }
}
