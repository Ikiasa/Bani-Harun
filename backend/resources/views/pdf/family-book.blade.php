<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Buku Keluarga Bani Harun</title>
    <style>
        @page {
            margin: 2cm;
        }
        body {
            font-family: serif;
            color: #433d31;
            background-color: #fcf9f2;
            line-height: 1.5;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #b4975a;
            padding-bottom: 10px;
        }
        .header h1 {
            color: #b4975a;
            margin: 0;
            font-size: 28px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .member-section {
            page-break-after: always;
        }
        .member-section:last-child {
            page-break-after: auto;
        }
        .member-name {
            color: #7c2d12;
            font-size: 22px;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .member-meta {
            color: #9a3412;
            margin-bottom: 20px;
            font-style: italic;
        }
        .photo-container {
            float: right;
            width: 150px;
            margin-left: 20px;
            margin-bottom: 15px;
            border: 5px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .photo-container img {
            width: 100%;
            display: block;
        }
        .bio-content {
            margin-bottom: 25px;
            text-align: justify;
        }
        .info-grid {
            border-top: 1px solid #e5e7eb;
            margin-top: 20px;
            padding-top: 15px;
        }
        .info-label {
            font-weight: bold;
            color: #7c2d12;
            margin-bottom: 5px;
        }
        .timeline {
            margin-top: 20px;
        }
        .timeline-item {
            margin-bottom: 10px;
            padding-left: 15px;
            border-left: 2px solid #b4975a;
        }
        .timeline-date {
            font-weight: bold;
            color: #b4975a;
        }
        .achievements {
            margin-top: 20px;
        }
        .achievement-item {
            margin-bottom: 5px;
        }
        .footer {
            position: fixed;
            bottom: -1cm;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 10px;
            color: #a1a1aa;
        }
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            width: 300px;
            height: 300px;
            margin-left: -150px;
            margin-top: -150px;
            opacity: 0.05;
            z-index: -1000;
        }
    </style>
</head>
<body>
    @foreach($members as $member)
        <div class="member-section">
            <div class="header">
                <h1>Buku Keluarga</h1>
                <p>Keluarga Besar Haji Harun</p>
            </div>

            @php
                $biography = $member->biography;
                $photo = $member->photo ? public_path('storage/' . $member->photo) : null;
            @endphp

            @if($photo && file_exists($photo))
                <div class="photo-container">
                    <img src="{{ $photo }}">
                </div>
            @endif

            <div class="member-name">{{ $member->name }}</div>
            <div class="member-meta">
                {{ $member->role }} | Generasi {{ $member->generation }} | Status: {{ $member->status == 'Active' ? 'Hidup' : 'Almarhum' }}
            </div>

            <div class="bio-content">
                <div class="info-label">Biografi & Kisah Hidup</div>
                {!! $biography->bio ?? 'Belum ada biografi yang ditulis.' !!}
            </div>

            <div class="info-grid">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td width="50%" valign="top">
                            <div class="info-label">Data Kelahiran</div>
                            <p>
                                Tempat: {{ $biography->birth_place ?? '-' }}<br>
                                Tanggal: {{ isset($biography->birth_date) ? \Carbon\Carbon::parse($biography->birth_date)->format('d F Y') : '-' }}
                            </p>
                            
                            <div class="info-label">Hubungan Keluarga</div>
                            <p>
                                Pasangan: {{ $biography->partner_name ?? '-' }}<br>
                                Kepala Keluarga: {{ $biography->head_of_family ?? '-' }}
                            </p>
                        </td>
                        <td width="50%" valign="top">
                            <div class="achievements">
                                <div class="info-label">Jejak Karya & Pencapaian</div>
                                @if(isset($biography->achievements) && is_array($biography->achievements))
                                    @foreach($biography->achievements as $item)
                                        <div class="achievement-item">• {{ $item['title'] }}</div>
                                    @endforeach
                                @else
                                    <p>-</p>
                                @endif
                            </div>
                        </td>
                    </tr>
                </table>
            </div>

            @if(isset($biography->timeline) && is_array($biography->timeline))
                <div class="timeline">
                    <div class="info-label">Garis Waktu (Timeline) Peristiwa</div>
                    @foreach($biography->timeline as $event)
                        <div class="timeline-item">
                            <span class="timeline-date">{{ $event['date'] ?? '-' }}</span>: {{ $event['event'] ?? '-' }}
                        </div>
                    @endforeach
                </div>
            @endif
        </div>
    @endforeach

    <div class="footer">
        Diterbitkan secara otomatis oleh Platform Silsilah Bani Harun &bull; {{ date('Y') }}
    </div>
</body>
</html>
