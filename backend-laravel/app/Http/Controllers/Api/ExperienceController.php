<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
            'icon_image'  => 'nullable|image|max:2048',
            'icon_url'    => 'nullable|string',
            'order'       => 'integer',
        ]);

        if ($request->hasFile('icon_image')) {
            $data['icon_url'] = $request->file('icon_image')->store('experiences', 'public');
        }
        unset($data['icon_image']);

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
            'icon_image'  => 'nullable|image|max:2048',
            'icon_url'    => 'nullable|string',
            'order'       => 'integer',
        ]);

        if ($request->hasFile('icon_image')) {
            // Strict cleanup: Hapus ikon lama jika ada
            if ($experience->icon_url && Storage::disk('public')->exists($experience->icon_url)) {
                Storage::disk('public')->delete($experience->icon_url);
            }
            $data['icon_url'] = $request->file('icon_image')->store('experiences', 'public');
        }
        unset($data['icon_image']);

        $experience->update($data);
        return response()->json($experience);
    }

    public function destroy(Experience $experience)
    {
        // Fitur strict cleanup: Hapus file fisik jika `icon_url` merujuk ke file lokal
        if ($experience->icon_url && Storage::disk('public')->exists($experience->icon_url)) {
            Storage::disk('public')->delete($experience->icon_url);
        }

        $experience->delete(); // Hard delete
        return response()->json(['message' => 'Pengalaman berhasil dihapus permanen.']);
    }
}
