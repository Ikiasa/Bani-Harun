import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ufsklevskppohulcxllt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdWJhYmFzZSIsInJlZiI6InVmc2tsZXZza3Bwb2h1bGN4bGx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNjk1OTIsImV4cCI6MjA1OTc0NTU5Mn0.qG62m1lT_Hh3y_v37_9x_1708'




if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase credentials.")
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seed() {
    console.log("Starting family tree seeding...")

    // 1. Clear existing data
    console.log("Cleaning up existing members...")
    await supabase.from('family_members').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    const ids = new Map()

    async function add(name, role, generation, status, parentName = null) {
        const parentId = parentName ? ids.get(parentName) : null
        const { data, error } = await supabase
            .from('family_members')
            .insert([{ name, role, generation, status, parent_id: parentId }])
            .select()

        if (error) {
            console.error(`Error adding ${name}:`, error.message)
            return null
        }

        const id = data[0].id
        ids.set(name, id)
        console.log(`Added: ${name} (ID: ${id})`)
        return id
    }

    // GENERATION 1
    await add('Mbah Harun', 'Patriarch', 1, 'Inactive')
    await add('Mbah Sutinah', 'Matriarch', 1, 'Inactive')

    // ==========================================
    // 1. MBAH SUPIYAH BRANCH
    // ==========================================
    await add('Kurdi – Mbah Supiyah', 'Member', 2, 'Inactive', 'Mbah Harun')

    // Gen 3
    await add('Muhadi – Fatonah', 'Member', 3, 'Active', 'Kurdi – Mbah Supiyah')
    await add('Ari Sulistiono – Siti Maidah', 'Member', 4, 'Active', 'Muhadi – Fatonah')
    await add('Adrian Hendri Prasetyo', 'Member', 5, 'Active', 'Ari Sulistiono – Siti Maidah')
    await add('Maulida Ayu Nur Hidayah', 'Member', 5, 'Active', 'Ari Sulistiono – Siti Maidah')
    await add('Aqilla Putri Ramadhani', 'Member', 5, 'Active', 'Ari Sulistiono – Siti Maidah')

    await add('Nastain – Zaenah', 'Member', 3, 'Active', 'Kurdi – Mbah Supiyah')
    await add('Mukhammad Kurniawan – Asrie Nadya', 'Member', 4, 'Active', 'Nastain – Zaenah')
    await add('Mika Kalyani Nailuhusna', 'Member', 5, 'Active', 'Mukhammad Kurniawan – Asrie Nadya')
    await add('Makki Ken Ahmad', 'Member', 5, 'Active', 'Mukhammad Kurniawan – Asrie Nadya')

    await add('Mukhammad Idi Kurnianto – Moya Saroh', 'Member', 4, 'Active', 'Nastain – Zaenah')
    await add('Muhammad Abdi Atharizz', 'Member', 5, 'Active', 'Mukhammad Idi Kurnianto – Moya Saroh')
    await add('Muhammad Hanan Alkarim', 'Member', 5, 'Active', 'Mukhammad Idi Kurnianto – Moya Saroh')

    await add('Mukhammad Kurniarrokhman – Rulliana Purbasari', 'Member', 4, 'Active', 'Nastain – Zaenah')
    await add('Muhammad Misyari Rasyid', 'Member', 5, 'Active', 'Mukhammad Kurniarrokhman – Rulliana Purbasari')
    await add('Rania Ghani Mahira', 'Member', 5, 'Active', 'Mukhammad Kurniarrokhman – Rulliana Purbasari')

    await add('Catur Kurnianingsih – Aly Nizamuddin', 'Member', 4, 'Active', 'Nastain – Zaenah')
    await add('Raekana Aileen Heba', 'Member', 5, 'Active', 'Catur Kurnianingsih – Aly Nizamuddin')

    await add('Sumardi – Sri Nur Arwati', 'Member', 3, 'Active', 'Kurdi – Mbah Supiyah')
    await add('Ika Rahmawati – Reza Nursatria J.P', 'Member', 4, 'Active', 'Sumardi – Sri Nur Arwati')
    await add('Greenia Aurora Rahmawita', 'Member', 5, 'Active', 'Ika Rahmawati – Reza Nursatria J.P')
    await add('Rayandita Kanaya Dewi', 'Member', 5, 'Active', 'Ika Rahmawati – Reza Nursatria J.P')
    await add('Fahriyan Shunan Adimulia Nursatria', 'Member', 5, 'Active', 'Ika Rahmawati – Reza Nursatria J.P')

    await add('Kurniawati – Tubagus Prayogo', 'Member', 4, 'Active', 'Sumardi – Sri Nur Arwati')
    await add('Danish Arya Prayogo', 'Member', 5, 'Active', 'Kurniawati – Tubagus Prayogo')
    await add('Kiara Almahyra Shanum', 'Member', 5, 'Active', 'Kurniawati – Tubagus Prayogo')

    await add('Muhammad Agung Wahyudi – Rina Septiana', 'Member', 4, 'Active', 'Sumardi – Sri Nur Arwati')
    await add('Jennaira Almeera Maheswari', 'Member', 5, 'Active', 'Muhammad Agung Wahyudi – Rina Septiana')

    await add('Umi Saadah – Samsul Hadi', 'Member', 3, 'Active', 'Kurdi – Mbah Supiyah')
    await add('Noval Erwin Attabiq – Yuhanita Kusuma Dewi', 'Member', 4, 'Active', 'Umi Saadah – Samsul Hadi')
    await add('Navalia Bening Anggraini', 'Member', 5, 'Active', 'Noval Erwin Attabiq – Yuhanita Kusuma Dewi')
    await add('Kei Zio Fathlani', 'Member', 5, 'Active', 'Noval Erwin Attabiq – Yuhanita Kusuma Dewi')
    await add('Gigih Adi Kurniawan – Savira Setiyana Mallomo', 'Member', 4, 'Active', 'Umi Saadah – Samsul Hadi')

    // ==========================================
    // 2. MBAH MUSLIM BRANCH
    // ==========================================
    await add('Muslim – Asfiyah', 'Member', 2, 'Inactive', 'Mbah Harun')

    await add('Fatikhin – Siti', 'Member', 3, 'Active', 'Muslim – Asfiyah')
    await add('Hilda Umayatul Laely – Aziz Arifin', 'Member', 4, 'Active', 'Fatikhin – Siti')
    await add('Khansa Nathania Alfarizki', 'Member', 5, 'Active', 'Hilda Umayatul Laely – Aziz Arifin')
    await add('M. Haebal Huda Handoyo', 'Member', 5, 'Active', 'Hilda Umayatul Laely – Aziz Arifin')

    await add('Rochmatul Ummah – Sunoto', 'Member', 3, 'Active', 'Muslim – Asfiyah')
    await add('(Alm.) Ahmad Sahal – Dian Nur Satyani', 'Member', 4, 'Inactive', 'Rochmatul Ummah – Sunoto')
    await add('Ahmad Ega Habibullah', 'Member', 5, 'Active', '(Alm.) Ahmad Sahal – Dian Nur Satyani')

    await add('Khairudin – Erna Hamdanah', 'Member', 4, 'Active', 'Rochmatul Ummah – Sunoto')
    await add('Adzkia Zhafira Khaireena', 'Member', 5, 'Active', 'Khairudin – Erna Hamdanah')
    await add('Adzkadini Khaireena', 'Member', 5, 'Active', 'Khairudin – Erna Hamdanah')

    await add('Fadlur Rohman – Isyaroh', 'Member', 4, 'Active', 'Rochmatul Ummah – Sunoto')
    await add('Listiyaningsih – Muhammad Ulin Nuha', 'Member', 4, 'Active', 'Rochmatul Ummah – Sunoto')
    await add('Salma Ayu Syakira', 'Member', 5, 'Active', 'Listiyaningsih – Muhammad Ulin Nuha')
    await add('Embun Osha Latisya', 'Member', 5, 'Active', 'Listiyaningsih – Muhammad Ulin Nuha')

    await add('Al Muttaqiyah – Abdul Latif', 'Member', 3, 'Active', 'Muslim – Asfiyah')
    await add('Arif Amrollah – Zuhrotun Nisak', 'Member', 4, 'Active', 'Al Muttaqiyah – Abdul Latif')
    await add('Rohadatul Aisyillah', 'Member', 5, 'Active', 'Arif Amrollah – Zuhrotun Nisak')
    await add('Rizqillah Salsabila', 'Member', 5, 'Active', 'Arif Amrollah – Zuhrotun Nisak')
    await add('Rafardhan Athallah', 'Member', 5, 'Active', 'Arif Amrollah – Zuhrotun Nisak')

    await add('Safiruddin – Tri Mulyani', 'Member', 4, 'Active', 'Al Muttaqiyah – Abdul Latif')
    await add('Afra Aufa Syarief', 'Member', 5, 'Active', 'Safiruddin – Tri Mulyani')

    await add('Sofiatul Amalia – Taufan Jayusman', 'Member', 4, 'Active', 'Al Muttaqiyah – Abdul Latif')
    await add('Rihadatul Aisya', 'Member', 5, 'Active', 'Sofiatul Amalia – Taufan Jayusman')
    await add('Muhammad Nasrullah', 'Member', 5, 'Active', 'Sofiatul Amalia – Taufan Jayusman')
    await add('Akhyat Syakir', 'Member', 5, 'Active', 'Sofiatul Amalia – Taufan Jayusman')
    await add('Naila Faizah', 'Member', 5, 'Active', 'Sofiatul Amalia – Taufan Jayusman')

    await add('Nikmah – Sukadi', 'Member', 3, 'Active', 'Muslim – Asfiyah')
    await add('(Almh.) Arofatul Listiyani', 'Member', 4, 'Inactive', 'Nikmah – Sukadi')
    await add('Akhmad Ridho – Ratna Dwi Yulianti', 'Member', 4, 'Active', 'Nikmah – Sukadi')
    await add('(Almh.) Maryam', 'Member', 5, 'Inactive', 'Akhmad Ridho – Ratna Dwi Yulianti')
    await add('Muhammad Athaf Wisanggeni', 'Member', 5, 'Active', 'Akhmad Ridho – Ratna Dwi Yulianti')
    await add('Alex Fahmi', 'Member', 5, 'Active', 'Akhmad Ridho – Ratna Dwi Yulianti')

    await add('Nur Kholis – Sri Purwanti', 'Member', 3, 'Active', 'Muslim – Asfiyah')
    await add('Siti Alfiana – Moh Rafsanjani', 'Member', 4, 'Active', 'Nur Kholis – Sri Purwanti')
    await add('Moh Syaka Ibadillah Rafsanjani', 'Member', 5, 'Active', 'Siti Alfiana – Moh Rafsanjani')
    await add('Husyain Rizki Ukhrowi', 'Member', 5, 'Active', 'Siti Alfiana – Moh Rafsanjani')

    await add('Choiriyah – Sutain', 'Member', 3, 'Active', 'Muslim – Asfiyah')
    await add('Bayu Nor Achsan – Muthi’atus Sholihah', 'Member', 4, 'Active', 'Choiriyah – Sutain')
    await add('Ribcha Amalia Putri', 'Member', 4, 'Active', 'Choiriyah – Sutain')
    await add('Muhammad Fairel Athalla', 'Member', 4, 'Active', 'Choiriyah – Sutain')

    await add('Nur Khasanah – Ahmad Mukholis', 'Member', 3, 'Active', 'Muslim – Asfiyah')
    await add('Irja ZalfanaA', 'Member', 4, 'Active', 'Nur Khasanah – Ahmad Mukholis')
    await add('Syifa Husnia', 'Member', 4, 'Active', 'Nur Khasanah – Ahmad Mukholis')
    await add('Muhammad Ainul Izzi', 'Member', 4, 'Active', 'Nur Khasanah – Ahmad Mukholis')

    await add('Muhammad Ndikron – Yuli Kristiyanti', 'Member', 3, 'Active', 'Muslim – Asfiyah')
    await add('Jeystin Azuri', 'Member', 4, 'Active', 'Muhammad Ndikron – Yuli Kristiyanti')
    await add('Muhammad Malik Danial Qisthi', 'Member', 4, 'Active', 'Muhammad Ndikron – Yuli Kristiyanti')

    await add('M. Aly Maskur', 'Member', 3, 'Active', 'Muslim – Asfiyah')

    // ==========================================
    // 3. MBAH MUARIP BRANCH
    // ==========================================
    await add('Muarip – Nasokah', 'Member', 2, 'Inactive', 'Mbah Harun')

    await add('Nur Khozin – Royanah', 'Member', 3, 'Active', 'Muarip – Nasokah')
    await add('Bhekti Ian Nuryana', 'Member', 4, 'Active', 'Nur Khozin – Royanah')
    await add('Mei Aida Nuryana', 'Member', 4, 'Active', 'Nur Khozin – Royanah')

    await add('Solichatun – Hasan Saputra', 'Member', 3, 'Active', 'Muarip – Nasokah')
    await add('Jap Nanang Ananta – Nikmatul Khasanah', 'Member', 4, 'Active', 'Solichatun – Hasan Saputra')
    await add('Azqiara Naeema Ninanta', 'Member', 5, 'Active', 'Jap Nanang Ananta – Nikmatul Khasanah')
    await add('Albarra Nizam Ananta', 'Member', 5, 'Active', 'Jap Nanang Ananta – Nikmatul Khasanah')
    await add('Jap Ira Ananta', 'Member', 4, 'Active', 'Solichatun – Hasan Saputra')

    await add('Ani Ariyanti – Iwan Setiawan', 'Member', 3, 'Active', 'Muarip – Nasokah')
    await add('Agnes Emiliana Ekasetiaputri', 'Member', 4, 'Active', 'Ani Ariyanti – Iwan Setiawan')
    await add('Amelinda Dwisetiaputri', 'Member', 4, 'Active', 'Ani Ariyanti – Iwan Setiawan')

    await add('Purwanto – Siti Khamidah', 'Member', 3, 'Active', 'Muarip – Nasokah')
    await add('Athaya Syarifuddin', 'Member', 4, 'Active', 'Purwanto – Siti Khamidah')
    await add('Amala Ghania Safira', 'Member', 4, 'Active', 'Purwanto – Siti Khamidah')

    await add('Lina Wahyuningsih – Bangkit Surya Putra Pradana', 'Member', 3, 'Active', 'Muarip – Nasokah')
    await add('Letazea Arkadewi Hadinata', 'Member', 4, 'Active', 'Lina Wahyuningsih – Bangkit Surya Putra Pradana')
    await add('Taqio Harun Alfarizqi', 'Member', 4, 'Active', 'Lina Wahyuningsih – Bangkit Surya Putra Pradana')

    // ==========================================
    // 4. MBAH FATIMAH BRANCH
    // ==========================================
    await add('(Alm.) Djais – Fatimah', 'Member', 2, 'Inactive', 'Mbah Harun')

    await add('Muhammad Sirat – Faisatul', 'Member', 3, 'Active', '(Alm.) Djais – Fatimah')
    await add('Rizky Kusuma Wardani – Yusfar Vais Alfianto', 'Member', 4, 'Active', 'Muhammad Sirat – Faisatul')
    await add('Devanka Abisatya Alfarizqi', 'Member', 5, 'Active', 'Rizky Kusuma Wardani – Yusfar Vais Alfianto')
    await add('(Alm.) M. Riza Amrosidi', 'Member', 4, 'Inactive', 'Muhammad Sirat – Faisatul')
    await add('Luluk Hanifa Luthfiana', 'Member', 4, 'Active', 'Muhammad Sirat – Faisatul')

    await add('Sriatun – Amanun Ciptadi', 'Member', 3, 'Active', '(Alm.) Djais – Fatimah')
    await add('Amanda Maghfirah – Estu Hana Kurniawan', 'Member', 4, 'Active', 'Sriatun – Amanun Ciptadi')
    await add('Esil Malik Arrasyd', 'Member', 5, 'Active', 'Amanda Maghfirah – Estu Hana Kurniawan')
    await add('Kevin Amanullah', 'Member', 4, 'Active', 'Sriatun – Amanun Ciptadi')

    await add('Tutik Endang M – Bintoro', 'Member', 3, 'Active', '(Alm.) Djais – Fatimah')
    await add('Ulung Mundiantoro', 'Member', 4, 'Active', 'Tutik Endang M – Bintoro')
    await add('Muhamad Bintang Baihaki', 'Member', 4, 'Active', 'Tutik Endang M – Bintoro')

    // ==========================================
    // 5. MBAH YUSUF BRANCH
    // ==========================================
    await add('Yusuf – Yulaikah', 'Member', 2, 'Inactive', 'Mbah Harun')

    await add('Ahmat Syaefudin – Siti Naimah', 'Member', 3, 'Active', 'Yusuf – Yulaikah')
    await add('Tazkia Maulida Nafisa', 'Member', 4, 'Active', 'Ahmat Syaefudin – Siti Naimah')
    await add('Syifa Atika Salsabila', 'Member', 4, 'Active', 'Ahmat Syaefudin – Siti Naimah')

    await add('Nur Huda – Siti Sumiah', 'Member', 3, 'Active', 'Yusuf – Yulaikah')
    await add('Airin Nur Azizah', 'Member', 4, 'Active', 'Nur Huda – Siti Sumiah')

    // ==========================================
    // 6. MBAH MARFUAH BRANCH
    // ==========================================
    await add('Kadar Usman – Marfuah', 'Member', 2, 'Inactive', 'Mbah Harun')

    await add('Fatkan – Nuryati', 'Member', 3, 'Active', 'Kadar Usman – Marfuah')
    await add('Muhammad Iqbal Rizkiawan', 'Member', 4, 'Active', 'Fatkan – Nuryati')
    await add('Ayra Khansa Maajiyah', 'Member', 4, 'Active', 'Fatkan – Nuryati')

    await add('Saiful Mujab – Nike Hapsari', 'Member', 3, 'Active', 'Kadar Usman – Marfuah')
    await add('Riska', 'Member', 4, 'Active', 'Saiful Mujab – Nike Hapsari')

    // ==========================================
    // 7. MBAH ISMAIL BRANCH
    // ==========================================
    await add('Mbah Ismail', 'Member', 2, 'Active', 'Mbah Harun')

    console.log("Seeding complete! 🌳")
}

seed().catch(err => {
    console.error("Seeding failed:", err)
    process.exit(1)
})
