<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CertificateController extends Controller
{
    public function index()
    {
        $certificates = Certificate::orderBy('issue_date', 'desc')->get();
        return response()->json($certificates);
    }

    public function show(Certificate $certificate)
    {
        return response()->json($certificate);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'issuer' => 'required|string|max:255',
            'issue_date' => 'required|date',
            'credential_url' => 'nullable|url|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image_url'] = $request->file('image')->store('certificates', 'public');
        }

        $certificate = Certificate::create($validated);
        return response()->json($certificate, 201);
    }

    public function update(Request $request, Certificate $certificate)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'issuer' => 'sometimes|required|string|max:255',
            'issue_date' => 'sometimes|required|date',
            'credential_url' => 'nullable|url|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($certificate->image_url && Storage::disk('public')->exists($certificate->image_url)) {
                Storage::disk('public')->delete($certificate->image_url);
            }
            $validated['image_url'] = $request->file('image')->store('certificates', 'public');
        }

        $certificate->update($validated);
        return response()->json($certificate);
    }

    public function destroy(Certificate $certificate)
    {
        if ($certificate->image_url && Storage::disk('public')->exists($certificate->image_url)) {
            Storage::disk('public')->delete($certificate->image_url);
        }
        $certificate->delete();
        return response()->json(['message' => 'Certificate deleted successfully']);
    }
}
