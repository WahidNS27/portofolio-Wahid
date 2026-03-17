<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'issuer',
        'issue_date',
        'credential_url',
        'image_url',
    ];

    protected function casts(): array
    {
        return [
            'issue_date' => 'date',
        ];
    }
}
