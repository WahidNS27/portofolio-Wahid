<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
            'title'          => 'required|string|max:255',
            'issuer'         => 'required|string|max:255',
            'issue_date'     => 'required|date',
            'credential_url' => 'nullable|url|max:500',
            // Image is required when creating a new certificate
            'image'          => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $file      = $request->file('image');
            $extension = $file->getClientOriginalExtension();
            $filename  = Str::uuid() . '.' . $extension;
            $validated['image_url'] = $file->storeAs('certificates', $filename, 'public');
        }

        $certificate = Certificate::create($validated);

        return response()->json($certificate->fresh(), 201);
    }

    public function update(Request $request, Certificate $certificate)
    {
        $validated = $request->validate([
            'title'          => 'sometimes|required|string|max:255',
            'issuer'         => 'sometimes|required|string|max:255',
            'issue_date'     => 'sometimes|required|date',
            'credential_url' => 'nullable|url|max:500',
            // Image is optional on update; only validated if provided
            'image'          => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image from storage if it exists
            if ($certificate->image_url && Storage::disk('public')->exists($certificate->image_url)) {
                Storage::disk('public')->delete($certificate->image_url);
            }

            $file      = $request->file('image');
            $extension = $file->getClientOriginalExtension();
            $filename  = Str::uuid() . '.' . $extension;
            $validated['image_url'] = $file->storeAs('certificates', $filename, 'public');
        }

        $certificate->update($validated);

        // Refresh the model so the response contains the updated data (including accessor)
        return response()->json($certificate->fresh());
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
