# 🐍 Snake Game - Rahmat Edition

Snake Game klasik dengan sentuhan modern, dilengkapi dengan sistem unlock skin, sound effects, dan leaderboard!

## ✨ Fitur Utama

### 🎮 Gameplay
- **Kontrol Intuitif**: Gunakan  WASD untuk menggerakkan ular
- **Makanan Biasa** (🍎): Memberikan +1 poin
- **Makanan Super** (🌟): Memberikan +2 poin, muncul setiap 5 makanan biasa dimakan, bertahan 5 detik
- **Sistem Skor**: Skor real-time dengan high score yang tersimpan

### 🎨 Sistem Unlock Skin (5 Pilihan)
1. **Classic Green** - Skin default (Terbuka dari awal)
2. **Ocean Blue** - Unlock dengan skor 10+
3. **Sunset Orange** - Unlock dengan skor 25+
4. **Royal Purple** - Unlock dengan skor 50+
5. **Rainbow Elite** - Unlock dengan skor 100+ (Skin spesial dengan efek rainbow!)

Setiap skin memiliki desain visual yang semakin menarik seiring tingkat kesulitan unlock-nya!

### 🔊 Sound Effects
- Sound effect "beep" saat ular memakan makanan
- Pitch berbeda untuk makanan biasa dan makanan super
- Menggunakan Web Audio API untuk kualitas suara terbaik

### 🏆 Leaderboard
- Menampilkan 10 skor tertinggi
- Informasi lengkap: Skor, Skin yang digunakan, Tanggal & Waktu
- Badge khusus untuk Top 3 (Gold, Silver, Bronze)
- Data tersimpan di localStorage

### 💾 Persistent Storage
- High score tersimpan otomatis
- Progress unlock skin tidak hilang saat refresh
- Leaderboard tersimpan secara permanen
- Pilihan skin terakhir diingat

## 🎯 Cara Bermain

1. Buka file `index.html` di browser
2. Pilih skin yang sudah terbuka (klik pada skin di panel kiri)
3. Gunakan WASD untuk menggerakkan ular
4. Makan apel merah (+1) dan apel emas (+2) untuk menambah skor
5. Hindari menabrak dinding dan tubuh sendiri
6. Capai skor tinggi untuk membuka skin baru!

## 📁 Struktur File

```
snake-game/
├── index.html      # Struktur HTML utama
├── style.css       # Styling dan animasi
├── script.js       # Logika game dan fitur
└── README.md       # Dokumentasi
```

## 🛠️ Teknologi yang Digunakan

- **HTML5 Canvas** - Rendering game
- **Tailwind CSS** - Styling modern dan responsive
- **Vanilla JavaScript** - Logika game
- **Web Audio API** - Sound effects
- **LocalStorage API** - Penyimpanan data

## 🎨 Desain & UI/UX

- **Tema Modern**: Gradient background dengan glassmorphism effect
- **Responsive Design**: Tampil sempurna di desktop dan mobile
- **Pixel Font**: Font retro "Press Start 2P" untuk nuansa klasik
- **Animasi Smooth**: Transisi dan hover effects yang halus
- **Visual Feedback**: Glow effects, shadows, dan animasi untuk pengalaman yang lebih immersive

## 🔧 Kustomisasi

### Mengubah Kecepatan Game
Edit `CONFIG.GAME_SPEED` di `script.js`:
```javascript
const CONFIG = {
    GAME_SPEED: 100, // Ubah nilai ini (semakin kecil = semakin cepat)
    // ...
};
```

### Menambah Skin Baru
Tambahkan objek baru di array `SKINS` di `script.js`:
```javascript
{
    id: 'custom',
    name: 'Custom Skin',
    headColor: '#HEXCODE',
    bodyColor: '#HEXCODE',
    requirement: 150,
    unlocked: false,
    description: 'Skor 150+'
}
```

### Mengubah Durasi Super Food
Edit `CONFIG.SUPERFOOD_DURATION` di `script.js`:
```javascript
const CONFIG = {
    SUPERFOOD_DURATION: 5000, // Dalam milidetik (5000 = 5 detik)
    // ...
};
```

## 📊 Kriteria Unlock Skin

| Skin | Skor Dibutuhkan | Warna |
|------|----------------|-------|
| Classic Green | 0 (Default) | Hijau |
| Ocean Blue | 10+ | Biru |
| Sunset Orange | 25+ | Oranye |
| Royal Purple | 50+ | Ungu |
| Rainbow Elite | 100+ | Rainbow 🌈 |

## 🎮 Tips & Trik

1. **Fokus pada Super Food**: Apel emas memberikan 2x poin!
2. **Rencanakan Gerakan**: Jangan terburu-buru, rencanakan rute Anda
3. **Gunakan Ruang**: Manfaatkan seluruh area canvas
4. **Unlock Skin Bertahap**: Mulai dari target kecil (10 poin) lalu tingkatkan
5. **Rainbow Elite**: Skin paling sulit dengan efek visual terbaik!

## 🐛 Troubleshooting

### Sound tidak terdengar?
- Pastikan browser Anda mendukung Web Audio API
- Klik di area game untuk mengaktifkan audio (browser policy)
- Periksa volume browser dan sistem

### Data hilang setelah refresh?
- Pastikan browser tidak dalam mode incognito/private
- Periksa pengaturan localStorage browser
- Jangan clear browser data/cache

### Game terlalu cepat/lambat?
- Ubah `CONFIG.GAME_SPEED` di script.js
- Nilai lebih kecil = lebih cepat
- Nilai lebih besar = lebih lambat

## 📝 Changelog

### Version 2.0 (Current)
- ✅ Struktur file terpisah (HTML, CSS, JS)
- ✅ Sistem unlock 5 skin dengan kriteria progresif
- ✅ Sound effects menggunakan Web Audio API
- ✅ Leaderboard dengan 10 skor tertinggi
- ✅ UI/UX modern dengan glassmorphism
- ✅ Rainbow skin dengan efek spesial
- ✅ Persistent storage untuk semua data

### Version 1.0
- Basic snake game
- Super food feature
- High score tracking

## 👨‍💻 Developer

Dibuat dengan ❤️ untuk penggemar game klasik dengan sentuhan modern!

## 📄 License

Free to use and modify for personal and educational purposes.

---

**Selamat Bermain! 🎮🐍**

