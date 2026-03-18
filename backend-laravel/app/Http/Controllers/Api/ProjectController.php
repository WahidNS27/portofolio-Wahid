<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    public function index()
    {
        return response()->json(
            Project::orderBy('order')->orderByDesc('created_at')->get()
        );
    }

    public function show(Project $project)
    {
        return response()->json($project);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'tech_stack'  => 'nullable|array',
            'github_url'  => 'nullable|url',
            'live_url'    => 'nullable|url',
            'is_featured' => 'boolean',
            'order'       => 'integer',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $data['image_url'] = $request->file('image')->store('projects', 'public');
        }

        unset($data['image']);
        $project = Project::create($data);

        return response()->json($project, 201);
    }

    public function update(Request $request, Project $project)
    {
        $data = $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'tech_stack'  => 'nullable|array',
            'github_url'  => 'nullable|url',
            'live_url'    => 'nullable|url',
            'is_featured' => 'boolean',
            'order'       => 'integer',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($project->image_url && Storage::disk('public')->exists($project->image_url)) {
                Storage::disk('public')->delete($project->image_url);
            }

            // Store new image
            $path = $request->file('image')->store('projects', 'public');
            $project->image_url = $path;
        }

        unset($data['image']);
        // Remove image_url from data if we handled it manually, to avoid overriding
        unset($data['image_url']);
        
        $project->fill($data);
        $project->save();

        return response()->json($project->fresh());
    }

    public function destroy(Project $project)
    {
        if ($project->image_url) {
            Storage::disk('public')->delete($project->image_url);
        }
        $project->delete();

        return response()->json(['message' => 'Proyek berhasil dihapus.']);
    }
}
