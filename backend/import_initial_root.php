<?php

use App\Models\FamilyMember;
use App\Models\FamilyBiography;
use Illuminate\Support\Facades\DB;

DB::transaction(function() {
    // 1. Create Root (Gen 1)
    $root = FamilyMember::create([
        'name' => 'Mbah Harun – Mbah Sutinah',
        'role' => 'Kakek & Nenek Buyut (Eyang)',
        'generation' => 1,
        'status' => 'Inactive',
    ]);

    FamilyBiography::create([
        'family_member_id' => $root->id,
        'bio_text' => 'Mbah Harun dan Mbah Sutinah adalah leluhur utama dari keluarga besar Bani Harun.',
        'status' => 'Almarhum',
        'nama_kepala_keluarga' => 'Mbah Harun'
    ]);

    // 2. Create Children (Gen 2)
    $gen2Names = [
        'Mbah Supiyah', 'Mbah Muslim', 'Mbah Muarip', 'Mbah Fatimah', 
        'Mbah Yusuf', 'Mbah Marfuah', 'Mbah Ismail'
    ];
    $gen2 = [];
    foreach ($gen2Names as $name) {
        $gen2[$name] = FamilyMember::create([
            'name' => $name,
            'role' => 'Kakek & Nenek (Eyang)',
            'generation' => 2,
            'parent_id' => $root->id,
            'status' => 'Inactive',
        ]);
    }

    // 3. Mbah Supiyah Detailed Branch (Gen 3)
    $supiyah = $gen2['Mbah Supiyah'];
    // Update Supiyah name to show spouse if needed, but user just said "Mbah Supiyah" first.
    // However, the detailed list says "Kurdi - Supiyah". I'll update the record.
    $supiyah->update(['name' => 'Kurdi – Mbah Supiyah']);

    // Gen 3: Anak-anak Supiyah
    $muhadi = FamilyMember::create([
        'name' => 'Muhadi – Fatonah',
        'role' => 'Orang Tua (Anak)',
        'generation' => 3,
        'parent_id' => $supiyah->id,
        'status' => 'Active',
    ]);

    $nastain = FamilyMember::create([
        'name' => 'Nastain – Zaenah',
        'role' => 'Orang Tua (Anak)',
        'generation' => 3,
        'parent_id' => $supiyah->id,
        'status' => 'Active',
    ]);

    $sumardi = FamilyMember::create([
        'name' => 'Sumardi – Sri Nur Arwati',
        'role' => 'Orang Tua (Anak)',
        'generation' => 3,
        'parent_id' => $supiyah->id,
        'status' => 'Active',
    ]);

    $umi = FamilyMember::create([
        'name' => 'Umi Saadah – Samsul Hadi',
        'role' => 'Orang Tua (Anak)',
        'generation' => 3,
        'parent_id' => $supiyah->id,
        'status' => 'Active',
    ]);

    // --- Muhadi Branch (Gen 4 & 5) ---
    $ari = FamilyMember::create([
        'name' => 'Ari Sulistiono – Siti Maidah',
        'role' => 'Cucu',
        'generation' => 4,
        'parent_id' => $muhadi->id,
        'status' => 'Active',
    ]);
    foreach (['Adrian Hendri Prasetyo', 'Maulida Ayu Nur Hidayah', 'Aqilla Putri Ramadhani'] as $name) {
        FamilyMember::create([
            'name' => $name, 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $ari->id, 'status' => 'Active'
        ]);
    }

    // --- Nastain Branch (Gen 4 & 5) ---
    $kurniawan = FamilyMember::create([
        'name' => 'Mukhammad Kurniawan – Asrie Nadya',
        'role' => 'Cucu', 'generation' => 4, 'parent_id' => $nastain->id, 'status' => 'Active'
    ]);
    foreach (['Mika Kalyani Nailuhusna', 'Makki Ken Ahmad'] as $name) {
        FamilyMember::create([
            'name' => $name, 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $kurniawan->id, 'status' => 'Active'
        ]);
    }

    $idi = FamilyMember::create([
        'name' => 'Mukhammad Idi Kurnianto – Moya Saroh',
        'role' => 'Cucu', 'generation' => 4, 'parent_id' => $nastain->id, 'status' => 'Active'
    ]);
    foreach (['Muhammad Abdi Atharizz', 'Muhammad Hanan Alkarim'] as $name) {
        FamilyMember::create([
            'name' => $name, 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $idi->id, 'status' => 'Active'
        ]);
    }

    $kurniar = FamilyMember::create([
        'name' => 'Mukhammad Kurniarrokhman – Rulliana Purbasari',
        'role' => 'Cucu', 'generation' => 4, 'parent_id' => $nastain->id, 'status' => 'Active'
    ]);
    foreach (['Muhammad Misyari Rasyid', 'Rania Ghani Mahira'] as $name) {
        FamilyMember::create([
            'name' => $name, 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $kurniar->id, 'status' => 'Active'
        ]);
    }

    $catur = FamilyMember::create([
        'name' => 'Catur Kurnianingsih – Aly Nizamuddin',
        'role' => 'Cucu', 'generation' => 4, 'parent_id' => $nastain->id, 'status' => 'Active'
    ]);
    FamilyMember::create(['name' => 'Raekana Aileen Heba', 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $catur->id, 'status' => 'Active']);

    // --- Sumardi Branch (Gen 4 & 5) ---
    $ika = FamilyMember::create([
        'name' => 'Ika Rahmawati – Reza Nursatria J.P',
        'role' => 'Cucu', 'generation' => 4, 'parent_id' => $sumardi->id, 'status' => 'Active'
    ]);
    foreach (['Greenia Aurora Rahmawita', 'Rayandita Kanaya Dewi', 'Fahriyan Shunan Adimulia Nursatria'] as $name) {
        FamilyMember::create([
            'name' => $name, 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $ika->id, 'status' => 'Active'
        ]);
    }

    $kur_s = FamilyMember::create([
        'name' => 'Kurniawati – Tubagus Prayogo',
        'role' => 'Cucu', 'generation' => 4, 'parent_id' => $sumardi->id, 'status' => 'Active'
    ]);
    foreach (['Danish Arya Prayogo', 'Kiara Almahyra Shanum'] as $name) {
        FamilyMember::create([
            'name' => $name, 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $kur_s->id, 'status' => 'Active'
        ]);
    }

    $agung = FamilyMember::create([
        'name' => 'Muhammad Agung Wahyudi – Rina Septiana',
        'role' => 'Cucu', 'generation' => 4, 'parent_id' => $sumardi->id, 'status' => 'Active'
    ]);
    FamilyMember::create(['name' => 'Jennaira Almeera Maheswari', 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $agung->id, 'status' => 'Active']);

    // --- Umi Saadah Branch (Gen 4 & 5) ---
    $noval = FamilyMember::create([
        'name' => 'Noval Erwin Attabiq – Yuhanita Kusuma Dewi',
        'role' => 'Cucu', 'generation' => 4, 'parent_id' => $umi->id, 'status' => 'Active'
    ]);
    foreach (['Navalia Bening Anggraini', 'Kei Zio Fathlani'] as $name) {
        FamilyMember::create([
            'name' => $name, 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $noval->id, 'status' => 'Active'
        ]);
    }

    $gigih = FamilyMember::create([
        'name' => 'Gigih Adi Kurniawan – Savira Setiyana Mallomo',
        'role' => 'Cucu', 'generation' => 4, 'parent_id' => $umi->id, 'status' => 'Active'
    ]);

    echo "Import completed successfully. Total members added: " . FamilyMember::count() . "\n";
});
