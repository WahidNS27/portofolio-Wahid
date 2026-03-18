<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ExperienceController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\CertificateController;
use App\Models\Project;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes (No Auth Required)
|--------------------------------------------------------------------------
*/

// Portfolio Data
Route::get('/projects',    [ProjectController::class, 'index']);
Route::get('/projects/{project}', [ProjectController::class, 'show']);
Route::get('/skills',      [SkillController::class, 'index']);
Route::get('/experiences', [ExperienceController::class, 'index']);
Route::get('/certificates', [CertificateController::class, 'index']);
Route::get('/certificates/{certificate}', [CertificateController::class, 'show']);

// Contact Form
Route::post('/contact', [MessageController::class, 'store']);

// Auth
Route::post('/auth/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Protected Admin Routes (Sanctum Token Required)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);

    // Projects CRUD
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::match(['post', 'put'], '/projects/{project}', [ProjectController::class, 'update']); // POST/PUT for multipart edit
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);

    // Skills CRUD
    Route::post('/skills',          [SkillController::class, 'store']);
    Route::put('/skills/{skill}',   [SkillController::class, 'update']);
    Route::delete('/skills/{skill}',[SkillController::class, 'destroy']);

    // Experiences CRUD
    Route::post('/experiences',               [ExperienceController::class, 'store']);
    Route::put('/experiences/{experience}',   [ExperienceController::class, 'update']);
    Route::delete('/experiences/{experience}',[ExperienceController::class, 'destroy']);

    // Certificates CRUD
    Route::post('/certificates',               [CertificateController::class, 'store']);
    Route::post('/certificates/{certificate}', [CertificateController::class, 'update']);
    Route::delete('/certificates/{certificate}',[CertificateController::class, 'destroy']);

    // Messages (Admin Inbox)
    Route::get('/messages',              [MessageController::class, 'index']);
    Route::get('/messages/stats',        [MessageController::class, 'stats']);
    Route::get('/messages/{message}',    [MessageController::class, 'show']);
    Route::delete('/messages/{message}', [MessageController::class, 'destroy']);
});
