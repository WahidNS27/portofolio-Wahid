<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SkillController extends Controller
{
    public function index()
    {
        return response()->json(Skill::orderBy('category')->orderBy('order')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'icon_image'  => 'nullable|image|max:2048',
            'icon_url'    => 'nullable|string|max:500',
            'category'    => 'required|string|max:100',
            'order'       => 'integer',
        ]);

        if ($request->hasFile('icon_image')) {
            $file      = $request->file('icon_image');
            $filename  = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $data['icon_url'] = $file->storeAs('skills', $filename, 'public');
        }
        unset($data['icon_image']);

        $skill = Skill::create($data);
        return response()->json($skill, 201);
    }

    public function update(Request $request, Skill $skill)
    {
        $data = $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'icon_image'  => 'nullable|image|max:2048',
            'icon_url'    => 'nullable|string|max:500',
            'category'    => 'sometimes|required|string|max:100',
            'order'       => 'integer',
        ]);

        if ($request->hasFile('icon_image')) {
            // Delete old icon file if stored locally
            if ($skill->icon_url && Storage::disk('public')->exists($skill->icon_url)) {
                Storage::disk('public')->delete($skill->icon_url);
            }
            $file      = $request->file('icon_image');
            $filename  = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $data['icon_url'] = $file->storeAs('skills', $filename, 'public');
        }
        unset($data['icon_image']);

        $skill->update($data);
        return response()->json($skill->fresh());
    }

    public function destroy(Skill $skill)
    {
        if ($skill->icon_url && Storage::disk('public')->exists($skill->icon_url)) {
            Storage::disk('public')->delete($skill->icon_url);
        }
        $skill->delete();
        return response()->json(['message' => 'Skill berhasil dihapus.']);
    }
}
