<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Snake Game Klasik</title>
    <!-- Memuat Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Menggunakan font kustom yang terlihat retro/pixel */
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        body {
            font-family: 'Press+Start 2P', cursive;
            /* Mencegah blur pada canvas di beberapa browser */
            image-rendering: -moz-crisp-edges;
            image-rendering: -webkit-crisp-edges;
            image-rendering: pixelated;
            image-rendering: crisp-edges;
        }
    </style>
</head>
<body class="bg-pink-100 text-gray-900 flex items-center justify-center min-h-screen p-4">

    <!-- Kontainer Utama Game -->
    <div class="bg-white p-6 sm:p-8 rounded-xl shadow-2xl border-4 border-pink-300 max-w-lg w-full">
        
        <!-- Judul -->
        <h1 class="text-3xl sm:text-4xl font-bold text-center text-pink-500 mb-4 tracking-wide">SNAKE</h1>

        <!-- Papan Skor -->
        <div class="flex justify-between items-center mb-4 text-lg sm:text-xl text-pink-600">
            <div>Skor: <span id="currentScore" class="font-bold">0</span></div>
            <div>Tertinggi: <span id="highScore" class="font-bold">0</span></div>
        </div>

        <!-- Area Game -->
        <div class="relative">
            <!-- Canvas tempat game digambar -->
            <canvas id="gameCanvas" width="400" height="400" class="bg-pink-50 border-4 border-pink-400 rounded-md w-full h-auto"></canvas>
            
            <!-- Pesan Game Over (tersembunyi) -->
            <div id="gameOverMessage" class="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 hidden">
                <h2 class="text-4xl font-bold text-red-500">GAME OVER</h2>
                <button id="resetButton" class="mt-4 bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300">
                    Mulai Lagi
                </button>
            </div>
        </div>
        
        <!-- Instruksi -->
        <p class="text-center text-gray-600 text-xs sm:text-sm mt-4">
            Gunakan Tombol Panah atau WASD untuk bergerak.
        </p>
    </div>

    <script>
        // --- Setup Awal ---
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        const scoreElement = document.getElementById('currentScore');
        const highScoreElement = document.getElementById('highScore');
        const gameOverMessage = document.getElementById('gameOverMessage');
        const resetButton = document.getElementById('resetButton');

        // Ukuran grid (setiap kotak ular/makanan)
        // Kita akan menggunakan canvas 400x400, jadi 20x20 grid
        const gridSize = 20;
        const tileCount = canvas.width / gridSize; // 400 / 20 = 20 tiles

        // --- Variabel Status Game ---
        let snake = [];
        let food = {};
        let velocity = {};
        let score = 0;
        // Ambil skor tertinggi dari localStorage, atau 0 jika tidak ada
        let highScore = localStorage.getItem('snakeHighScore') || 0; 
        let isGameOver = false;
        let gameLoop;

        // --- Variabel Makanan Super ---
        let superFood = {};
        let superFoodActive = false;
        let superFoodTimer;
        let normalFoodCounter = 0;
        const SUPERFOOD_SPAWN_COUNT = 5; // Muncul setelah 5 makanan biasa
        const SUPERFOOD_DURATION = 5000; // Bertahan 5 detik

        highScoreElement.textContent = highScore;

        // --- Fungsi Utama Game ---

        function startGame() {
            // Reset semua variabel ke kondisi awal
            isGameOver = false;
            score = 0;
            scoreElement.textContent = score;
            // Posisi awal ular di tengah
            snake = [{ x: 10, y: 10 }]; 
            // Awalnya diam sampai tombol ditekan
            velocity = { x: 0, y: 0 }; 
            
            generateFood(); // Buat makanan pertama
            normalFoodCounter = 0; // Reset penghitung makanan super
            clearSuperFood(); // Hapus makanan super jika ada
            gameOverMessage.classList.add('hidden'); // Sembunyikan pesan game over

            // Hentikan loop lama jika ada (untuk reset)
            clearInterval(gameLoop);
            // Mulai game loop baru
            // Kecepatan game (1000ms / 10 = 10 frame per detik)
            // Ubah 100 menjadi lebih kecil untuk game lebih cepat (misal 80)
            gameLoop = setInterval(mainGameLoop, 100); 
        }

        // Fungsi yang berjalan berulang kali (setiap "frame")
        function mainGameLoop() {
            if (isGameOver) {
                // Tampilkan pesan game over
                gameOverMessage.classList.remove('hidden');
                
                // Cek dan simpan skor tertinggi baru
                if (score > highScore) {
                    highScore = score;
                    highScoreElement.textContent = highScore;
                    localStorage.setItem('snakeHighScore', highScore);
                }
                
                // Hentikan game loop
                clearInterval(gameLoop);
                return;
            }

            clearCanvas();
            moveSnake();
            drawFood();
            drawSuperFood(); // Gambar makanan super
            drawSnake();
        }

        // --- Fungsi Helper (Pembantu) ---

        function clearCanvas() {
            // Warnai seluruh canvas dengan warna latar belakang
            ctx.fillStyle = '#fdf2f8'; // Hex code untuk bg-pink-50
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        function drawSnake() {
            // Menggambar ular agar terlihat terhubung dan bulat
            
            // 1. Gambar badan
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = '#008000'; // Warna badan (hijau)
            ctx.lineWidth = gridSize - 4; // Ketebalan badan
            
            ctx.beginPath();
            ctx.moveTo(snake[0].x * gridSize + gridSize / 2, snake[0].y * gridSize + gridSize / 2);
            for (let i = 1; i < snake.length; i++) {
                ctx.lineTo(snake[i].x * gridSize + gridSize / 2, snake[i].y * gridSize + gridSize / 2);
            }
            ctx.stroke();

            // 2. Gambar kepala
            ctx.fillStyle = '#006400'; // Warna kepala (hijau tua)
            ctx.beginPath();
            ctx.arc(snake[0].x * gridSize + gridSize / 2, snake[0].y * gridSize + gridSize / 2, (gridSize - 4) / 2, 0, 2 * Math.PI);
            ctx.fill();

            // 3. Tambahkan mata (opsional)
            const head = snake[0];
            const eyeSize = 2;
            ctx.fillStyle = 'white';
            if (velocity.x === 1) { // Kanan
                ctx.fillRect(head.x * gridSize + gridSize / 2 + 2, head.y * gridSize + gridSize / 2 - 5, eyeSize, eyeSize);
                ctx.fillRect(head.x * gridSize + gridSize / 2 + 2, head.y * gridSize + gridSize / 2 + 3, eyeSize, eyeSize);
            } else if (velocity.x === -1) { // Kiri
                ctx.fillRect(head.x * gridSize + gridSize / 2 - 4, head.y * gridSize + gridSize / 2 - 5, eyeSize, eyeSize);
                ctx.fillRect(head.x * gridSize + gridSize / 2 - 4, head.y * gridSize + gridSize / 2 + 3, eyeSize, eyeSize);
            } else if (velocity.y === 1) { // Bawah
                ctx.fillRect(head.x * gridSize + gridSize / 2 - 5, head.y * gridSize + gridSize / 2 + 2, eyeSize, eyeSize);
                ctx.fillRect(head.x * gridSize + gridSize / 2 + 3, head.y * gridSize + gridSize / 2 + 2, eyeSize, eyeSize);
            } else if (velocity.y === -1) { // Atas
                ctx.fillRect(head.x * gridSize + gridSize / 2 - 5, head.y * gridSize + gridSize / 2 - 4, eyeSize, eyeSize);
                ctx.fillRect(head.x * gridSize + gridSize / 2 + 3, head.y * gridSize + gridSize / 2 - 4, eyeSize, eyeSize);
            }
        }

        function drawFood() {
            // Menggambar apel
            const x = food.x * gridSize + gridSize / 2;
            const y = food.y * gridSize + gridSize / 2;

            // Batang
            ctx.fillStyle = '#8B4513'; // Coklat
            ctx.fillRect(x - 1, y - gridSize / 2.5, 3, 5);

            // Apel
            ctx.fillStyle = '#EF4444'; // Merah
            ctx.beginPath();
            ctx.arc(x, y + 2, gridSize / 2.5, 0, 2 * Math.PI);
            ctx.fill();

            // Kilau
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(x - 3, y - 1, 2, 0, 2 * Math.PI);
            ctx.fill();
        }

        function drawSuperFood() {
            if (!superFoodActive) return;

            // Menggambar apel emas
            const x = superFood.x * gridSize + gridSize / 2;
            const y = superFood.y * gridSize + gridSize / 2;

            // Batang
            ctx.fillStyle = '#8B4513'; // Coklat
            ctx.fillRect(x - 1, y - gridSize / 2.5, 3, 5);

            // Apel Emas
            ctx.fillStyle = '#F59E0B'; // Emas/Kuning
            ctx.beginPath();
            ctx.arc(x, y + 2, gridSize / 2.5, 0, 2 * Math.PI);
            ctx.fill();

            // Kilau
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.beginPath();
            ctx.arc(x - 3, y - 1, 2, 0, 2 * Math.PI);
            ctx.fill();
        }

        function moveSnake() {
            // Buat kepala baru berdasarkan kecepatan saat ini
            const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

            // Cek Tabrakan Tembok (Game Over)
            if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
                isGameOver = true;
                return;
            }
            
            // Cek Tabrakan Diri Sendiri (Game Over)
            // Mulai dari i = 1 (melewatkan kepala)
            for (let i = 1; i < snake.length; i++) {
                if (head.x === snake[i].x && head.y === snake[i].y) {
                    isGameOver = true;
                    return;
                }
            }

            // Tambahkan kepala baru di depan array (ular "bergerak")
            snake.unshift(head);

            // Cek Makan Super Food
            if (superFoodActive && head.x === superFood.x && head.y === superFood.y) {
                score += 2; // Tambah 2 poin
                scoreElement.textContent = score;
                clearSuperFood();
                // Jangan pop ekor (ular bertambah panjang)
            }
            // Cek Makan Makanan Biasa
            else if (head.x === food.x && head.y === food.y) {
                score++; // Tambah 1 poin
                scoreElement.textContent = score;
                generateFood(); // Buat makanan baru
                
                normalFoodCounter++;
                if (!superFoodActive && normalFoodCounter >= SUPERFOOD_SPAWN_COUNT) {
                    generateSuperFood();
                }
                // Jangan pop ekor (ular bertambah panjang)
            } else {
                // Jika tidak makan, hapus ekor (agar ular tidak bertambah panjang)
                snake.pop(); 
            }
        }

        function generateFood() {
            let newFoodPosition;
            do {
                // Buat posisi acak di dalam grid
                newFoodPosition = {
                    x: Math.floor(Math.random() * tileCount),
                    y: Math.floor(Math.random() * tileCount)
                };
                // Ulangi jika makanan muncul di badan ular ATAU di makanan super
            } while (isSnakeOnPosition(newFoodPosition) || (superFoodActive && newFoodPosition.x === superFood.x && newFoodPosition.y === superFood.y)); 

            food = newFoodPosition;
        }

        // --- Fungsi Makanan Super ---

        function generateSuperFood() {
            normalFoodCounter = 0;
            clearTimeout(superFoodTimer); // Hapus timer lama jika ada

            let newPosition;
            do {
                newPosition = {
                    x: Math.floor(Math.random() * tileCount),
                    y: Math.floor(Math.random() * tileCount)
                };
            // Pastikan tidak muncul di ular ATAU di makanan biasa
            } while (isSnakeOnPosition(newPosition) || (newPosition.x === food.x && newPosition.y === food.y));

            superFood = newPosition;
            superFoodActive = true;

            // Atur timer untuk menghilangkan makanan super
            superFoodTimer = setTimeout(clearSuperFood, SUPERFOOD_DURATION);
        }

        function clearSuperFood() {
            superFood = {};
            superFoodActive = false;
            clearTimeout(superFoodTimer);
        }

        // Fungsi utilitas untuk mengecek apakah posisi (x,y) ada di badan ular
        function isSnakeOnPosition(position) {
            return snake.some(part => part.x === position.x && part.y === position.y);
        }

        // --- Event Listeners (Input) ---

        // Kontrol Ular
        function changeDirection(e) {
            // Kode tombol
            const KIRI = 37;
            const ATAS = 38;
            const KANAN = 39;
            const BAWAH = 40;
            const A = 65;
            const W = 87;
            const D = 68;
            const S = 83;

            // Cek arah saat ini untuk mencegah ular berbalik arah
            // (misal: dari kanan langsung ke kiri)
            const goingUp = velocity.y === -1;
            const goingDown = velocity.y === 1;
            const goingLeft = velocity.x === -1;
            const goingRight = velocity.x === 1;

            switch (e.keyCode) {
                case KIRI:
                case A:
                    if (!goingRight) velocity = { x: -1, y: 0 };
                    break;
                case ATAS:
                case W:
                    if (!goingDown) velocity = { x: 0, y: -1 };
                    break;
                case KANAN:
                case D:
                    if (!goingLeft) velocity = { x: 1, y: 0 };
                    break;
                case BAWAH:
                case S:
                    if (!goingUp) velocity = { x: 0, y: 1 };
                    break;
            }
        }

        // Tambahkan listener ke seluruh dokumen
        document.addEventListener('keydown', changeDirection);
        // Tambahkan listener ke tombol reset
        resetButton.addEventListener('click', startGame);

        // --- Mulai Permainan ---
        // Mulai permainan saat halaman dimuat
        startGame();
    </script>
</body>
</html>

