<?php

namespace Database\Seeders;

use App\Models\Experience;
use App\Models\Project;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin User
        User::firstOrCreate(
            ['email' => 'admin@portofolio.com'],
            [
                'name'     => 'Admin Portfolio',
                'password' => Hash::make('password'),
            ]
        );

        // Sample Projects
        Project::create([
            'title'       => 'Smart Trash Sorting System',
            'description' => 'Sistem pemilahan sampah cerdas berbasis IoT menggunakan ESP32 dan sensor MPU6050. Mampu mengklasifikasikan limbah organik, non-organik, dan logam secara otomatis dengan akurasi tinggi. Sistem terhubung ke dashboard monitoring realtime via WiFi.',
            'tech_stack'  => ['ESP32', 'MPU6050', 'Arduino IDE', 'MQTT', 'Node.js', 'React.js', 'MySQL'],
            'github_url'  => 'https://github.com',
            'live_url'    => null,
            'is_featured' => true,
            'order'       => 1,
        ]);

        Project::create([
            'title'       => 'Portfolio & CMS System',
            'description' => 'Website portfolio profesional dengan Admin Panel berbasis Laravel REST API + React.js. Dilengkapi fitur manajemen konten (CRUD) untuk proyek, skill, pengalaman, dan pesan masuk dari pengunjung.',
            'tech_stack'  => ['Laravel', 'Sanctum', 'React.js', 'Vite', 'Tailwind CSS', 'Framer Motion', 'MySQL'],
            'github_url'  => 'https://github.com',
            'live_url'    => 'https://example.com',
            'is_featured' => true,
            'order'       => 2,
        ]);

        Project::create([
            'title'       => 'Library Management System',
            'description' => 'Aplikasi manajemen perpustakaan digital dengan fitur peminjaman, pengembalian, katalog buku, dan laporan bulanan. Dibangun dengan PHP Native dan Bootstrap.',
            'tech_stack'  => ['PHP', 'MySQL', 'Bootstrap', 'jQuery'],
            'github_url'  => 'https://github.com',
            'live_url'    => null,
            'is_featured' => false,
            'order'       => 3,
        ]);

        // Skills
        $skills = [
            ['name' => 'React.js',     'proficiency_level' => 88, 'category' => 'Frontend',  'icon_url' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'],
            ['name' => 'Tailwind CSS', 'proficiency_level' => 90, 'category' => 'Frontend',  'icon_url' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg'],
            ['name' => 'JavaScript',   'proficiency_level' => 85, 'category' => 'Frontend',  'icon_url' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'],
            ['name' => 'TypeScript',   'proficiency_level' => 75, 'category' => 'Frontend',  'icon_url' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg'],
            ['name' => 'Laravel',      'proficiency_level' => 90, 'category' => 'Backend',   'icon_url' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg'],
            ['name' => 'PHP',          'proficiency_level' => 88, 'category' => 'Backend',   'icon_url' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-plain.svg'],
            ['name' => 'Node.js',      'proficiency_level' => 78, 'category' => 'Backend',   'icon_url' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'],
            ['name' => 'MySQL',        'proficiency_level' => 85, 'category' => 'Database',  'icon_url' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg'],
            ['name' => 'Git',          'proficiency_level' => 85, 'category' => 'DevOps',    'icon_url' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg'],
            ['name' => 'Arduino',      'proficiency_level' => 82, 'category' => 'Hardware',  'icon_url' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg'],
            ['name' => 'ESP32',        'proficiency_level' => 80, 'category' => 'Hardware',  'icon_url' => null],
            ['name' => 'Linux',        'proficiency_level' => 72, 'category' => 'DevOps',    'icon_url' => 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg'],
        ];

        foreach ($skills as $i => $skill) {
            Skill::create(array_merge($skill, ['order' => $i + 1]));
        }

        // Experiences
        Experience::create([
            'role'        => 'Full-Stack Developer Intern',
            'company'     => 'PT. Teknologi Bersama Indonesia',
            'start_date'  => '2025-06-01',
            'end_date'    => '2025-12-31',
            'description' => 'Mengembangkan aplikasi web internal perusahaan menggunakan Laravel dan React.js. Berkontribusi pada pembuatan REST API, desain database, dan implementasi UI dengan Tailwind CSS.',
            'type'        => 'work',
            'order'       => 1,
        ]);

        Experience::create([
            'role'        => 'IoT Project Coordinator',
            'company'     => 'Lab Teknik Informatika',
            'start_date'  => '2024-09-01',
            'end_date'    => '2025-05-31',
            'description' => 'Memimpin tim riset dan pengembangan sistem Smart Trash Sorting berbasis ESP32. Bertanggung jawab atas integrasi hardware-software dan dokumentasi teknis.',
            'type'        => 'work',
            'order'       => 2,
        ]);

        Experience::create([
            'role'        => 'S1 Teknik Informatika',
            'company'     => 'Universitas Teknologi Indonesia',
            'start_date'  => '2022-09-01',
            'end_date'    => null,
            'description' => 'Menempuh studi S1 Teknik Informatika dengan fokus pada pengembangan perangkat lunak, sistem tertanam (embedded system), dan kecerdasan buatan.',
            'type'        => 'education',
            'order'       => 3,
        ]);

        Experience::create([
            'role'        => 'SMK Rekayasa Perangkat Lunak',
            'company'     => 'SMKN 1 Teknologi',
            'start_date'  => '2019-07-01',
            'end_date'    => '2022-06-30',
            'description' => 'Jurusan Rekayasa Perangkat Lunak. Mempelajari dasar-dasar pemrograman, web development, dan database. Lulus dengan predikat sangat memuaskan.',
            'type'        => 'education',
            'order'       => 4,
        ]);
    }
}
