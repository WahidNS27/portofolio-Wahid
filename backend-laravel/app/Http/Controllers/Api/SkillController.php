<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SkillController extends Controller
{
    public function index()
    {
        return response()->json(Skill::orderBy('category')->orderBy('order')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'              => 'required|string|max:255',
            'icon_image'        => 'nullable|image|max:2048', // Tambahkan validasi file gambar
            'icon_url'          => 'nullable|string', // Tetap pertahankan untuk support string biasa/emoji
            'proficiency_level' => 'integer|min:0|max:100',
            'category'          => 'string|max:100',
            'order'             => 'integer',
        ]);

        if ($request->hasFile('icon_image')) {
            $data['icon_url'] = $request->file('icon_image')->store('skills', 'public');
        }
        unset($data['icon_image']);

        $skill = Skill::create($data);
        return response()->json($skill, 201);
    }

    public function update(Request $request, Skill $skill)
    {
        $data = $request->validate([
            'name'              => 'sometimes|required|string|max:255',
            'icon_image'        => 'nullable|image|max:2048',
            'icon_url'          => 'nullable|string',
            'proficiency_level' => 'integer|min:0|max:100',
            'category'          => 'string|max:100',
            'order'             => 'integer',
        ]);

        if ($request->hasFile('icon_image')) {
            // Strict cleanup: Hapus ikon lama jika ada
            if ($skill->icon_url && Storage::disk('public')->exists($skill->icon_url)) {
                Storage::disk('public')->delete($skill->icon_url);
            }
            $data['icon_url'] = $request->file('icon_image')->store('skills', 'public');
        }
        unset($data['icon_image']);

        $skill->update($data);
        return response()->json($skill);
    }

    public function destroy(Skill $skill)
    {
        // Fitur strict cleanup: Hapus file fisik jika `icon_url` merujuk ke file local
        if ($skill->icon_url && Storage::disk('public')->exists($skill->icon_url)) {
            Storage::disk('public')->delete($skill->icon_url);
        }
        
        $skill->delete(); // Hard delete
        return response()->json(['message' => 'Skill berhasil dihapus permanen.']);
    }
}
