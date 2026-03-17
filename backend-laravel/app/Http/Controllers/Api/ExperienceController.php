<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    public function index()
    {
        return response()->json(Experience::orderByDesc('start_date')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'role'        => 'required|string|max:255',
            'company'     => 'required|string|max:255',
            'start_date'  => 'required|date',
            'end_date'    => 'nullable|date|after:start_date',
            'description' => 'required|string',
            'type'        => 'in:work,education',
            'icon_url'    => 'nullable|string',
            'order'       => 'integer',
        ]);

        $experience = Experience::create($data);
        return response()->json($experience, 201);
    }

    public function update(Request $request, Experience $experience)
    {
        $data = $request->validate([
            'role'        => 'sometimes|required|string|max:255',
            'company'     => 'sometimes|required|string|max:255',
            'start_date'  => 'sometimes|required|date',
            'end_date'    => 'nullable|date',
            'description' => 'sometimes|required|string',
            'type'        => 'in:work,education',
            'icon_url'    => 'nullable|string',
            'order'       => 'integer',
        ]);

        $experience->update($data);
        return response()->json($experience);
    }

    public function destroy(Experience $experience)
    {
        $experience->delete();
        return response()->json(['message' => 'Pengalaman berhasil dihapus.']);
    }
}
