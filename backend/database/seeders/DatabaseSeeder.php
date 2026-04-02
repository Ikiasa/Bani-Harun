<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Family Members
        $harun = \App\Models\FamilyMember::create(['name' => 'Harun Al-Rashid', 'role' => 'Patriarch', 'generation' => 1, 'status' => 'Active', 'last_active' => '2024-03-25']);
        $aminah = \App\Models\FamilyMember::create(['name' => 'Siti Aminah', 'role' => 'Matriarch', 'generation' => 1, 'status' => 'Active', 'last_active' => '2024-03-24']);
        
        $ahmad = \App\Models\FamilyMember::create(['name' => 'Ahmad Harun', 'role' => 'Branch Head', 'generation' => 2, 'status' => 'Active', 'last_active' => '2024-03-26', 'parent_id' => $harun->id]);
        $fathima = \App\Models\FamilyMember::create(['name' => 'Fathima Harun', 'role' => 'Secretary', 'generation' => 2, 'status' => 'Active', 'last_active' => '2024-03-27', 'parent_id' => $harun->id]);
        
        \App\Models\FamilyMember::create(['name' => 'Yusuf Ahmad', 'role' => 'Member', 'generation' => 3, 'status' => 'Active', 'last_active' => '2024-03-28', 'parent_id' => $ahmad->id]);
        \App\Models\FamilyMember::create(['name' => 'Zainab Ahmad', 'role' => 'Member', 'generation' => 3, 'status' => 'Inactive', 'last_active' => '2023-12-15', 'parent_id' => $ahmad->id]);

        // Events
        \App\Models\FamilyEvent::create(['title' => 'Annual Family Gathering', 'date' => '2024-04-15', 'type' => 'Gathering', 'location' => 'Surabaya', 'attendees' => 120]);
        \App\Models\FamilyEvent::create(['title' => 'Monthly Coordination Meeting', 'date' => '2024-04-05', 'type' => 'Meeting', 'location' => 'Zoom', 'attendees' => 15]);
        \App\Models\FamilyEvent::create(['title' => 'Heritage Day Ceremony', 'date' => '2024-05-20', 'type' => 'Ceremony', 'location' => 'Bangkalan', 'attendees' => 200]);

        // Financials (Seed more transactions)
        \App\Models\FinancialTransaction::create(['amount' => 250000000, 'type' => 'Initial Fund', 'description' => 'Kas Warisan Utama', 'date' => '2024-01-01']);
        \App\Models\FinancialTransaction::create(['amount' => 15000000, 'type' => 'Contribution', 'description' => 'Kontribusi Keluarga Besar - Maret', 'date' => '2024-03-01']);
        \App\Models\FinancialTransaction::create(['amount' => -2500000, 'type' => 'Expense', 'description' => 'Renovasi Makam Leluhur', 'date' => '2024-03-10']);
        \App\Models\FinancialTransaction::create(['amount' => -1500000, 'type' => 'Expense', 'description' => 'Konsumsi Pertemuan Bulanan', 'date' => '2024-03-15']);
        \App\Models\FinancialTransaction::create(['amount' => 5000000, 'type' => 'Contribution', 'description' => 'Zakat & Sedekah Anggota', 'date' => '2024-03-20']);

        // Opportunities
        \App\Models\Opportunity::create(['title' => 'Kemitraan Pertanian Organik', 'description' => 'Membuka peluang investasi bagi anggota keluarga untuk proyek sawah organik di Bangkalan.', 'status' => 'Open', 'category' => 'Pertanian']);
        \App\Models\Opportunity::create(['title' => 'Beasiswa Pendidikan S2', 'description' => 'Tersedia bantuan biaya pendidikan bagi generasi buyut yang melanjutkan studi di bidang Teknologi.', 'status' => 'Open', 'category' => 'Pendidikan']);
        \App\Models\Opportunity::create(['title' => 'Ekspor Batik Madura', 'description' => 'Peluang reseller internasional untuk produk batik premium hasil karya anggota keluarga.', 'status' => 'Closed', 'category' => 'Perdagangan']);

        // Programs
        \App\Models\Program::create(['title' => 'Literasi Keuangan Syariah', 'date' => '2024-04-10', 'description' => 'Workshop pengelolaan harta warisan dan investasi syariah.', 'instructor' => 'Ahmad Harun']);
        \App\Models\Program::create(['title' => 'Cangkrukan Sejarah Bani Harun', 'date' => '2024-04-25', 'description' => 'Diskusi santai mengenai asal-usul dan filosofi keluarga.', 'instructor' => 'Harun Al-Rashid']);

        // Ideas
        \App\Models\Idea::create(['title' => 'Koperasi Simpan Pinjam Keluarga', 'description' => 'Membangun sistem pembiayaan mandiri tanpa bunga bagi anggota yang membutuhkan.', 'votes' => 45, 'author' => 'Yusuf Ahmad']);
        \App\Models\Idea::create(['title' => 'Wisata Religi Tahunan', 'description' => 'Mengadakan ziarah bersama ke makam wali songo setiap bulan Syawal.', 'votes' => 28, 'author' => 'Fathima Harun']);
    }
}
