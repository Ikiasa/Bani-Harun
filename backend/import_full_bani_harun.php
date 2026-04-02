<?php

use App\Models\FamilyMember;
use App\Models\FamilyBiography;
use Illuminate\Support\Facades\DB;

DB::transaction(function() {
    // 0. Clear existing data for a clean slate
    \App\Models\FamilyBiography::query()->delete();
    \App\Models\FamilyMember::query()->delete();

    // 1. Create Root (Gen 1)
    $root = FamilyMember::create([
        'name' => 'Mbah Harun – Mbah Sutinah',
        'role' => 'Kakek & Nenek Buyut (Eyang)',
        'generation' => 1,
        'status' => 'Inactive',
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

    // ==========================================
    // 3. Mbah Supiyah Detailed Branch
    // ==========================================
    $supiyah = $gen2['Mbah Supiyah'];
    $supiyah->update(['name' => 'Kurdi – Mbah Supiyah']);

    // Gen 3
    $muhadi_s = FamilyMember::create(['name' => 'Muhadi – Fatonah', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $supiyah->id, 'status' => 'Active']);
    $nastain_s = FamilyMember::create(['name' => 'Nastain – Zaenah', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $supiyah->id, 'status' => 'Active']);
    $sumardi_s = FamilyMember::create(['name' => 'Sumardi – Sri Nur Arwati', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $supiyah->id, 'status' => 'Active']);
    $umi_s = FamilyMember::create(['name' => 'Umi Saadah – Samsul Hadi', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $supiyah->id, 'status' => 'Active']);

    // Gen 4 & 5 (Muhadi)
    $ari_s = FamilyMember::create(['name' => 'Ari Sulistiono – Siti Maidah', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $muhadi_s->id, 'status' => 'Active']);
    foreach (['Adrian Hendri Prasetyo', 'Maulida Ayu Nur Hidayah', 'Aqilla Putri Ramadhani'] as $n) FamilyMember::create(['name' => $n, 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $ari_s->id]);
    
    // Gen 4 & 5 (Nastain)
    $kurniawan_s = FamilyMember::create(['name' => 'Mukhammad Kurniawan – Asrie Nadya', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $nastain_s->id, 'status' => 'Active']);
    foreach (['Mika Kalyani Nailuhusna', 'Makki Ken Ahmad'] as $n) FamilyMember::create(['name' => $n, 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $kurniawan_s->id]);
    $idi_s = FamilyMember::create(['name' => 'Mukhammad Idi Kurnianto – Moya Saroh', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $nastain_s->id]);
    foreach (['Muhammad Abdi Atharizz', 'Muhammad Hanan Alkarim'] as $n) FamilyMember::create(['name' => $n, 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $idi_s->id]);
    $kurniar_s = FamilyMember::create(['name' => 'Mukhammad Kurniarrokhman – Rulliana Purbasari', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $nastain_s->id]);
    foreach (['Muhammad Misyari Rasyid', 'Rania Ghani Mahira'] as $n) FamilyMember::create(['name' => $n, 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $kurniar_s->id]);
    $catur_s = FamilyMember::create(['name' => 'Catur Kurnianingsih – Aly Nizamuddin', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $nastain_s->id]);
    FamilyMember::create(['name' => 'Raekana Aileen Heba', 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $catur_s->id]);

    // Gen 4 & 5 (Sumardi)
    $ika_s = FamilyMember::create(['name' => 'Ika Rahmawati – Reza Nursatria J.P', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $sumardi_s->id]);
    foreach (['Greenia Aurora Rahmawita', 'Rayandita Kanaya Dewi', 'Fahriyan Shunan Adimulia Nursatria'] as $n) FamilyMember::create(['name' => $n, 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $ika_s->id]);
    $kurnia_s = FamilyMember::create(['name' => 'Kurniawati – Tubagus Prayogo', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $sumardi_s->id]);
    foreach (['Danish Arya Prayogo', 'Kiara Almahyra Shanum'] as $n) FamilyMember::create(['name' => $n, 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $kurnia_s->id]);
    $agung_s = FamilyMember::create(['name' => 'Muhammad Agung Wahyudi – Rina Septiana', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $sumardi_s->id]);
    FamilyMember::create(['name' => 'Jennaira Almeera Maheswari', 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $agung_s->id]);

    // Gen 4 & 5 (Umi Saadah)
    $noval_s = FamilyMember::create(['name' => 'Noval Erwin Attabiq – Yuhanita Kusuma Dewi', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $umi_s->id]);
    foreach (['Navalia Bening Anggraini', 'Kei Zio Fathlani'] as $n) FamilyMember::create(['name' => $n, 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $noval_s->id]);
    FamilyMember::create(['name' => 'Gigih Adi Kurniawan – Savira Setiyana Mallomo', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $umi_s->id]);

    // ==========================================
    // 4. Mbah Muslim Detailed Branch
    // ==========================================
    $muslim = $gen2['Mbah Muslim'];
    $muslim->update(['name' => 'Muslim – Khaireena']);

    // Gen 3 Muslim
    $fadlur_m = FamilyMember::create(['name' => 'Fadlur Rohman – Isyaroh', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $muslim->id]);
    $listiyani_m = FamilyMember::create(['name' => 'Listiyaningsih – Muhammad Ulin Nuha', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $muslim->id]);
    foreach (['Salma Ayu Syakira', 'Embun Osha Latisya'] as $n) FamilyMember::create(['name' => $n, 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $listiyani_m->id]);

    $muttaqiyah_m = FamilyMember::create(['name' => 'Al Muttaqiyah – Abdul Latif', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $muslim->id]);
    $arif_m = FamilyMember::create(['name' => 'Arif Amrollah – Zuhrotun Nisak', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $muttaqiyah_m->id]);
    foreach (['Rohadatul Aisyillah', 'Rizqillah Salsabila', 'Rafardhan Athallah'] as $n) FamilyMember::create(['name' => $n, 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $arif_m->id]);
    $safiruddin_m = FamilyMember::create(['name' => 'Safiruddin – Tri Mulyani', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $muttaqiyah_m->id]);
    FamilyMember::create(['name' => 'Afra Aufa Syarief', 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $safiruddin_m->id]);
    $sofiatul_m = FamilyMember::create(['name' => 'Sofiatul Amalia – Taufan Jayusman', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $muttaqiyah_m->id]);
    foreach (['Rihadatul Aisya', 'Muhammad Nasrullah', 'Akhyat Syakir', 'Naila Faizah'] as $n) FamilyMember::create(['name' => $n, 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $sofiatul_m->id]);

    $nikmah_m = FamilyMember::create(['name' => 'Nikmah – Sukadi', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $muslim->id]);
    FamilyMember::create(['name' => '(Almh.) Arofatul Listiyani', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $nikmah_m->id, 'status' => 'Inactive']);
    $ridho_m = FamilyMember::create(['name' => 'Akhmad Ridho – Ratna Dwi Yulianti', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $nikmah_m->id]);
    foreach (['(Almh.) Maryam', 'Muhammad Athaf Wisanggeni', 'Alex Fahmi'] as $n) FamilyMember::create(['name' => $n, 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $ridho_m->id]);

    $kholis_m = FamilyMember::create(['name' => 'Nur Kholis – Sri Purwanti', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $muslim->id]);
    $alfiana_m = FamilyMember::create(['name' => 'Siti Alfiana – Moh Rafsanjani', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $kholis_m->id]);
    foreach (['Moh Syaka Ibadillah Rafsanjani', 'Husyain Rizki Ukhrowi'] as $n) FamilyMember::create(['name' => $n, 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $alfiana_m->id]);

    $choiriyah_m = FamilyMember::create(['name' => 'Choiriyah – Sutain', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $muslim->id]);
    $bayu_m = FamilyMember::create(['name' => 'Bayu Nor Achsan – Muthi’atus Sholihah', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $choiriyah_m->id]);
    foreach (['Ribcha Amalia Putri', 'Muhammad Fairel Athalla'] as $n) FamilyMember::create(['name' => $n, 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $choiriyah_m->id]); // Wait, Bayu, Ribcha, Fairel are sisters? user says 1, 2, 3 under Choiriyah. Fix.
    // User says: 6. Choiriyah - Sutain: 1. Bayu, 2. Ribcha, 3. Fairel. So they are all children of Choiriyah.

    $khasanah_m = FamilyMember::create(['name' => 'Nur Khasanah – Ahmad Mukholis', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $muslim->id]);
    foreach (['Irja ZalfanaA', 'Syifa Husnia', 'Muhammad Ainul Izzi'] as $n) FamilyMember::create(['name' => $n, 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $khasanah_m->id]);

    $ndikron_m = FamilyMember::create(['name' => 'Muhammad Ndikron – Yuli Kristiyanti', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $muslim->id]);
    foreach (['Jeystin Azuri', 'Muhammad Malik Danial Qisthi'] as $n) FamilyMember::create(['name' => $n, 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $ndikron_m->id]);

    FamilyMember::create(['name' => 'M. Aly Maskur', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $muslim->id]);

    // ==========================================
    // 5. Mbah Muarip Detailed Branch
    // ==========================================
    $muarip = $gen2['Mbah Muarip'];
    $muarip->update(['name' => 'Muarip – Nasokah']);

    $khozin_mu = FamilyMember::create(['name' => 'Nur Khozin – Royanah', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $muarip->id]);
    foreach (['Bhekti Ian Nuryana', 'Mei Aida Nuryana'] as $n) FamilyMember::create(['name' => $n, 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $khozin_mu->id]);

    $solichatun_mu = FamilyMember::create(['name' => 'Solichatun – Hasan Saputra', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $muarip->id]);
    $nanang_mu = FamilyMember::create(['name' => 'Jap Nanang Ananta – Nikmatul Khasanah', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $solichatun_mu->id]);
    foreach (['Azqiara Naeema Ninanta', 'Albarra Nizam Ananta'] as $n) FamilyMember::create(['name' => $n, 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $nanang_mu->id]);
    FamilyMember::create(['name' => 'Jap Ira Ananta', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $solichatun_mu->id]);

    $ani_mu = FamilyMember::create(['name' => 'Ani Ariyanti – Iwan Setiawan', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $muarip->id]);
    foreach (['Agnes Emiliana Ekasetiaputri', 'Amelinda Dwisetiaputri'] as $n) FamilyMember::create(['name' => $n, 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $ani_mu->id]);

    $purwanto_mu = FamilyMember::create(['name' => 'Purwanto – Siti Khamidah', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $muarip->id]);
    foreach (['Athaya Syarifuddin', 'Amala Ghania Safira'] as $n) FamilyMember::create(['name' => $n, 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $purwanto_mu->id]);

    $lina_mu = FamilyMember::create(['name' => 'Lina Wahyuningsih – Bangkit Surya Putra Pradana', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $muarip->id]);
    foreach (['Letazea Arkadewi Hadinata', 'Taqio Harun Alfarizqi'] as $n) FamilyMember::create(['name' => $n, 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $lina_mu->id]);

    // ==========================================
    // 6. Mbah Fatimah Detailed Branch
    // ==========================================
    $fatimah = $gen2['Mbah Fatimah'];
    $fatimah->update(['name' => '(Alm.) Djais – Fatimah']);

    $sirat_f = FamilyMember::create(['name' => 'Muhammad Sirat – Faisatul', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $fatimah->id]);
    $rizky_f = FamilyMember::create(['name' => 'Rizky Kusuma Wardani – Yusfar Vais Alfianto', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $sirat_f->id]);
    FamilyMember::create(['name' => 'Devanka Abisatya Alfarizqi', 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $rizky_f->id]);
    FamilyMember::create(['name' => '(Alm.) M. Riza Amrosidi', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $sirat_f->id, 'status' => 'Inactive']);
    FamilyMember::create(['name' => 'Luluk Hanifa Luthfiana', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $sirat_f->id]);

    $sriatun_f = FamilyMember::create(['name' => 'Sriatun – Amanun Ciptadi', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $fatimah->id]);
    $amanda_f = FamilyMember::create(['name' => 'Amanda Maghfirah – Estu Hana Kurniawan', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $sriatun_f->id]);
    FamilyMember::create(['name' => 'Esil Malik Arrasyd', 'role' => 'Cicit', 'generation' => 5, 'parent_id' => $amanda_f->id]);
    FamilyMember::create(['name' => 'Kevin Amanullah', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $sriatun_f->id]);

    $tutik_f = FamilyMember::create(['name' => 'Tutik Endang M – Bintoro', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $fatimah->id]);
    foreach (['Ulung Mundiantoro', 'Muhamad Bintang Baihaki'] as $n) FamilyMember::create(['name' => $n, 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $tutik_f->id]);

    // ==========================================
    // 7. Mbah Yusuf Detailed Branch
    // ==========================================
    $yusuf = $gen2['Mbah Yusuf'];
    $yusuf->update(['name' => 'Yusuf – Yulaikah']);

    $syaefudin_y = FamilyMember::create(['name' => 'Ahmat Syaefudin – Siti Naimah', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $yusuf->id]);
    foreach (['Tazkia Maulida Nafisa', 'Syifa Atika Salsabila'] as $n) FamilyMember::create(['name' => $n, 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $syaefudin_y->id]);
    
    $huda_y = FamilyMember::create(['name' => 'Nur Huda – Siti Sumiah', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $yusuf->id]);
    FamilyMember::create(['name' => 'Airin Nur Azizah', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $huda_y->id]);

    // ==========================================
    // 8. Mbah Marfuah Detailed Branch
    // ==========================================
    $marfuah = $gen2['Mbah Marfuah'];
    $marfuah->update(['name' => 'Kadar Usman – Marfuah']);

    $fatkan_ma = FamilyMember::create(['name' => 'Fatkan – Nuryati', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $marfuah->id]);
    foreach (['Muhammad Iqbal Rizkiawan', 'Ayra Khansa Maajiyah'] as $n) FamilyMember::create(['name' => $n, 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $fatkan_ma->id]);

    $mujab_ma = FamilyMember::create(['name' => 'Saiful Mujab – Nike Hapsari', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $marfuah->id]);
    FamilyMember::create(['name' => 'Riska', 'role' => 'Cucu', 'generation' => 4, 'parent_id' => $mujab_ma->id]);

    // ==========================================
    // 9. Mbah Ismail Detailed Branch
    // ==========================================
    $ismail = $gen2['Mbah Ismail'];
    $ismail->update(['name' => 'Ismail – Siti Rikanah']);

    $munir_i = FamilyMember::create(['name' => 'Munir – Dayah', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $ismail->id]);
    FamilyMember::create(['name' => 'Ismi Mariya Ulfa', 'role' => 'Orang Tua', 'generation' => 3, 'parent_id' => $ismail->id]);

    echo "Full reconstruction completed successfully. Total members added: " . FamilyMember::count() . "\n";
});
