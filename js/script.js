// Membaca atau membuat database lokal browser
let dana = JSON.parse(localStorage.getItem('budgetPro')) || {
    utama: 0, dapur: 0, sekolah: 0, tabungan: 0, keinginan: 0, main: 0
};

let teksPesanWA = ""; // Menyimpan draf pesan teks secara global

// Fungsi render angka saldo ke halaman web
function updateTampilan() {
    document.getElementById('saldo-utama').innerText = "Rp " + dana.utama.toLocaleString('id-ID');
    document.getElementById('saldo-dapur').innerText = "Rp " + dana.dapur.toLocaleString('id-ID');
    document.getElementById('saldo-sekolah').innerText = "Rp " + dana.sekolah.toLocaleString('id-ID');
    document.getElementById('saldo-tabungan').innerText = "Rp " + dana.tabungan.toLocaleString('id-ID');
    document.getElementById('saldo-keinginan').innerText = "Rp " + dana.keinginan.toLocaleString('id-ID');
    document.getElementById('saldo-main').innerText = "Rp " + dana.main.toLocaleString('id-ID');
    
    localStorage.setItem('budgetPro', JSON.stringify(dana));
}

// Fungsi menghitung pembagian persen saat gajian cair
function prosesGajian() {
    const gaji = parseInt(document.getElementById('gajiBulanan').value);
    if (isNaN(gaji) || gaji <= 0) {
        alert("Masukkan nominal gaji yang valid!");
        return;
    }

    // Kalkulasi pembagian dana otomatis
    const alokasi = {
        dapur: gaji * 0.40,
        sekolah: gaji * 0.20,
        tabungan: gaji * 0.15,
        keinginan: gaji * 0.10,
        main: gaji * 0.15
    };

    dana.utama += gaji; // Gaji masuk ke penampungan utama

    // Menghasilkan text HTML pengingat di layar browser
    let htmlAdvise = `
        <p>Gaji masuk <b>Rp ${gaji.toLocaleString('id-ID')}</b>. Jangan melenceng, pisahkan segera untuk:</p>
        <ul>
            <li>🍳 Dapur & RT (40%): <b>Rp ${alokasi.dapur.toLocaleString('id-ID')}</b></li>
            <li>🎓 Sekolah Anak (20%): <b>Rp ${alokasi.sekolah.toLocaleString('id-ID')}</b></li>
            <li>💰 Tabungan / Darurat (15%): <b>Rp ${alokasi.tabungan.toLocaleString('id-ID')}</b></li>
            <li>💄 Penampilan Istri (10%): <b>Rp ${alokasi.keinginan.toLocaleString('id-ID')}</b> <small>(Tas/Baju Baru)</small></li>
            <li>🎮 Hiburan & Main (15%): <b>Rp ${alokasi.main.toLocaleString('id-ID')}</b></li>
        </ul>
    `;

    // Menyusun draf teks dengan format khusus Bold (*) WhatsApp
    teksPesanWA = `⚠️ *PENGINGAT GAJIAN & PRIORITAS AMBLOP DIGITAL* ⚠️\n\n` +
                  `Anda telah menerima gaji sebesar *Rp ${gaji.toLocaleString('id-ID')}*.\n` +
                  `Agar tujuan penggunaan tidak melenceng, berikut pos alokasi wajib Anda:\n\n` +
                  `1. 🍳 *Kebutuhan Dapur & RT (40%)* : Rp ${alokasi.dapur.toLocaleString('id-ID')}\n` +
                  `2. 🎓 *Sekolah Anak (20%)* : Rp ${alokasi.sekolah.toLocaleString('id-ID')}\n` +
                  `3. 💰 *Tabungan & Emergency (15%)* : Rp ${alokasi.tabungan.toLocaleString('id-ID')}\n` +
                  `4. 💄 *Penampilan/Lipstik/Tas Istri (10%)* : Rp ${alokasi.keinginan.toLocaleString('id-ID')}\n` +
                  `5. 🎮 *Hiburan & Main (15%)* : Rp ${alokasi.main.toLocaleString('id-ID')}\n\n` +
                  `_Yuk konsisten! Selesaikan pengisian amplop virtual Anda sekarang._`;

    // Tampilkan elemen kotak saran di halaman web
    const adviseBox = document.getElementById('adviseBox');
    const btnKirimWA = document.getElementById('btnKirimWA');
    
    if (adviseBox && btnKirimWA) {
        document.getElementById('isiAdvise').innerHTML = htmlAdvise;
        adviseBox.style.display = "block";
        btnKirimWA.style.display = "block";
    }
    
    updateTampilan();
}

// Fungsi membuka aplikasi WhatsApp dengan API resmi yang benar
function kirimWhatsApp() {
    const noWA = document.getElementById('nomorWA').value.trim();
    if (noWA === "6281213825210") {
        alert("Harap masukkan nomor WhatsApp tujuan terlebih dahulu!");
        return;
    }
    
    const urlWA = `https://wa.me/6281213825210?text=${encodeURIComponent(teksPesanWA)}`;
    window.open(urlWA, '_blank');
}

// Fungsi memproses mutasi uang (mengurangi atau mengisi amplop)
function prosesTransaksi() {
    const amplop = document.getElementById('pilihAmplop').value;
    const jenis = document.getElementById('jenisTransaksi').value;
    const jumlah = parseInt(document.getElementById('jumlahUang').value);

    if (isNaN(jumlah) || jumlah <= 0) {
        alert("Masukkan jumlah uang yang valid!");
        return;
    }

    if (jenis === 'kurang') {
        if (dana[amplop] === undefined) {
            alert("Kategori amplop tidak valid!");
            return;
        }
        if (dana[amplop] < jumlah) {
            alert("Saldo di amplop tersebut tidak mencukupi!");
            return;
        }
        dana[amplop] -= jumlah;
    } else {
        if (amplop !== 'utama') {
            if (dana.utama < jumlah) {
                alert("Uang di Kantong Utama tidak cukup untuk dibagi ke amplop ini!");
                return;
            }
            dana.utama -= jumlah;
        }
        if (dana[amplop] !== undefined) {
            dana[amplop] += jumlah;
        }
    }

    document.getElementById('jumlahUang').value = "";
    updateTampilan();
}

// Menjalankan fungsi pertama kali
updateTampilan();


// Fungsi untuk mereset seluruh data kembali ke angka 0
function resetSemuaData() {
    // Beri konfirmasi ke pengguna agar tidak sengaja terklik
    if (confirm("Apakah Anda yakin ingin menghapus semua saldo dan mulai dari awal?")) {
        // Setel ulang semua variabel objek menjadi 0
        dana = {
            utama: 0, dapur: 0, sekolah: 0, tabungan: 0, keinginan: 0, main: 0
        };
        
        // Sembunyikan kembali kotak saran/advise jika sedang terbuka
        document.getElementById('adviseBox').style.display = "none";
        
        // Perbarui angka di layar dan hapus memori lama
        updateTampilan();
        alert("Semua saldo berhasil di-reset menjadi Rp 0!");
    }
}
