<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;

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
            'icon_url'          => 'nullable|string',
            'proficiency_level' => 'integer|min:0|max:100',
            'category'          => 'string|max:100',
            'order'             => 'integer',
        ]);

        $skill = Skill::create($data);
        return response()->json($skill, 201);
    }

    public function update(Request $request, Skill $skill)
    {
        $data = $request->validate([
            'name'              => 'sometimes|required|string|max:255',
            'icon_url'          => 'nullable|string',
            'proficiency_level' => 'integer|min:0|max:100',
            'category'          => 'string|max:100',
            'order'             => 'integer',
        ]);

        $skill->update($data);
        return response()->json($skill);
    }

    public function destroy(Skill $skill)
    {
        $skill->delete();
        return response()->json(['message' => 'Skill berhasil dihapus.']);
    }
}
