<?php

use App\Models\FamilyMember;
use Illuminate\Support\Facades\DB;

DB::transaction(function () {
    // Disable foreign key checks for SQLite
    DB::statement('PRAGMA foreign_keys = OFF');
    FamilyMember::truncate();
    DB::statement('PRAGMA foreign_keys = ON');

    // Generation 1: Ancestors
    $ancestors = FamilyMember::create([
        'name' => 'Mbah Harun - Mbah Sutinah',
        'role' => 'Pendiri / Sesepuh',
        'generation' => 1,
        'status' => 'Active',
    ]);

    // Generation 2: Supiyah
    $supiyah = FamilyMember::create([
        'name' => 'Kurdi - Supiyah',
        'role' => 'Kepala Keluarga',
        'generation' => 2,
        'parent_id' => $ancestors->id,
        'status' => 'Active',
    ]);

    // Generation 3: Children
    $muhadi = FamilyMember::create(['name' => 'Muhadi - Fatonah', 'role' => 'Anak', 'generation' => 3, 'parent_id' => $supiyah->id]);
    $nastain = FamilyMember::create(['name' => 'Nastain - Zaenah', 'role' => 'Anak', 'generation' => 3, 'parent_id' => $supiyah->id]);
    $sumardi = FamilyMember::create(['name' => 'Sumardi - Sri Nur Arwati', 'role' => 'Anak', 'generation' => 3, 'parent_id' => $supiyah->id]);
    $umi = FamilyMember::create(['name' => 'Umi Saadah - Samsul Hadi', 'role' => 'Anak', 'generation' => 3, 'parent_id' => $supiyah->id]);

    // Generation 4: Putu (Grandchildren)
    // Muhadi's line
    $ari = FamilyMember::create(['name' => 'Ari Sulistiono - Siti Maidah', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $muhadi->id]);
    
    // Nastain's line
    $kurniawan = FamilyMember::create(['name' => 'Mukhammad Kurniawan - Asrie Nadya', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $nastain->id]);
    $idi = FamilyMember::create(['name' => 'Mukhammad Idi Kurnianto - Moya Saroh', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $nastain->id]);
    $kurniarrokhman = FamilyMember::create(['name' => 'Mukhammad Kurniarrokhman - Rulliana Purbasari', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $nastain->id]);
    $catur = FamilyMember::create(['name' => 'Catur Kurnianingsih - Aly Nizamuddin', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $nastain->id]);

    // Sumardi's line
    $ika = FamilyMember::create(['name' => 'Ika Rahmawati - Reza Nursatria J.P', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $sumardi->id]);
    $kurniawati = FamilyMember::create(['name' => 'Kurniawati - Tubagus Prayogo', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $sumardi->id]);
    $agung = FamilyMember::create(['name' => 'Muhammad Agung Wahyudi - Rina Septiana', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $sumardi->id]);

    // Umi Saadah's line
    $noval = FamilyMember::create(['name' => 'Noval Erwin Attabiq - Yuhanita Kusuma Dewi', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $umi->id]);
    $gigih = FamilyMember::create(['name' => 'Gigih Adi Kurniawan - Savira Setiyana Mallomo', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $umi->id]);

    // Generation 5: Buyut (Great-grandchildren)
    // Ari's children
    FamilyMember::create(['name' => 'Adrian Hendri Prasetyo', 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $ari->id]);
    FamilyMember::create(['name' => 'Maulida Ayu Nur Hidayah', 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $ari->id]);
    FamilyMember::create(['name' => 'Aqilla Putri Ramadhani', 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $ari->id]);

    // Kurniawan's children
    FamilyMember::create(['name' => 'Mika Kalyani Nailuhusna', 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $kurniawan->id]);
    FamilyMember::create(['name' => 'Makki Ken Ahmad', 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $kurniawan->id]);

    // Idi's children
    FamilyMember::create(['name' => 'Muhammad Abdi Atharizz', 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $idi->id]);
    FamilyMember::create(['name' => 'Muhammad Hanan Alkarim', 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $idi->id]);

    // Kurniarrokhman's children
    FamilyMember::create(['name' => 'Muhammad Misyari Rasyid', 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $kurniarrokhman->id]);
    FamilyMember::create(['name' => 'Rania Ghani Mahira', 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $kurniarrokhman->id]);

    // Catur's children
    FamilyMember::create(['name' => 'Raekana Aileen Heba', 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $catur->id]);

    // Ika's children
    FamilyMember::create(['name' => 'Greenia Aurora Rahmawita', 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $ika->id]);
    FamilyMember::create(['name' => 'Rayandita Kanaya Dewi', 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $ika->id]);
    FamilyMember::create(['name' => 'Fahriyan Shunan Adimulia Nursatria', 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $ika->id]);

    // Kurniawati's children
    FamilyMember::create(['name' => 'Danish Arya Prayogo', 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $kurniawati->id]);
    FamilyMember::create(['name' => 'Kiara Almahyra Shanum', 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $kurniawati->id]);

    // Agung's children
    FamilyMember::create(['name' => 'Jennaira Almeera Maheswari', 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $agung->id]);

    // Noval's children
    FamilyMember::create(['name' => 'Navalia Bening Anggraini', 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $noval->id]);
    FamilyMember::create(['name' => 'Kei Zio Fathlani', 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $noval->id]);

});
