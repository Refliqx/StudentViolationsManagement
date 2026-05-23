async function test() {
  try {
    const payload = {
      id: '640ee79a-1881-48bb-ad53-6b0b60b92062',
      siswa_id: 'cc13301d-d94a-41c2-92f9-7d04a12b055d',
      jenis_pelanggaran: 'Minum minuman alkohol',
      tingkat: 'Berat',
      poin: 100,
      tanggal: '2026-05-29',
      status: 'Aktif',
      tindakan: 'Diberikan skorsing 3 hari',
      tanggal_tindak_lanjut: null,
      catatan: null,
      waktu: '10:00',
      lokasi: 'Sekolah',
      deskripsi: 'Deskripsi'
    };

    console.log("Sending PATCH request for the real ID to Next.js API...");
    const response = await fetch('http://localhost:3000/api/violations', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log("Status Code:", response.status);
    console.log("Response JSON:", result);
  } catch (err) {
    console.error("Fetch test failed with error:", err);
  }
}

test();
