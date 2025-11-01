// ===== CONFIGURATION & CONSTANTS =====
const CONFIG = {
    GRID_SIZE: 20,
    CANVAS_SIZE: 400,
    GAME_SPEED: 100,
    SUPERFOOD_SPAWN_COUNT: 5,
    SUPERFOOD_DURATION: 5000,
    MAX_LEADERBOARD_ENTRIES: 10
};

// ===== SKIN DEFINITIONS =====
const SKINS = [
    {
        id: 'classic',
        name: 'Classic Green',
        headColor: '#006400',
        bodyColor: '#008000',
        requirement: 0,
        unlocked: true,
        description: 'Skin default'
    },
    {
        id: 'ocean',
        name: 'Ocean Blue',
        headColor: '#0047AB',
        bodyColor: '#1E90FF',
        requirement: 10,
        unlocked: false,
        description: 'Skor 10+'
    },
    {
        id: 'sunset',
        name: 'Sunset Orange',
        headColor: '#FF4500',
        bodyColor: '#FF6347',
        requirement: 25,
        unlocked: false,
        description: 'Skor 25+'
    },
    {
        id: 'royal',
        name: 'Royal Purple',
        headColor: '#4B0082',
        bodyColor: '#8B00FF',
        requirement: 50,
        unlocked: false,
        description: 'Skor 50+'
    },
    {
        id: 'rainbow',
        name: 'Rainbow Elite',
        headColor: '#FF1493',
        bodyColor: 'rainbow', // Special handling
        requirement: 100,
        unlocked: false,
        description: 'Skor 100+'
    }
];

// ===== DOM ELEMENTS =====
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('currentScore');
const highScoreElement = document.getElementById('highScore');
const gameOverMessage = document.getElementById('gameOverMessage');
const resetButton = document.getElementById('resetButton');
const finalScoreElement = document.getElementById('finalScore');
const unlockMessageElement = document.getElementById('unlockMessage');
const skinContainer = document.getElementById('skinContainer');
const leaderboardContainer = document.getElementById('leaderboardContainer');
const emptyLeaderboard = document.getElementById('emptyLeaderboard');
const clearLeaderboardBtn = document.getElementById('clearLeaderboard');
const currentSkinNameElement = document.getElementById('currentSkinName');
const unlockedCountElement = document.getElementById('unlockedCount');

// ===== GAME STATE =====
let snake = [];
let food = {};
let velocity = {};
let score = 0;
let highScore = 0;
let isGameOver = false;
let gameLoop;
let currentSkinId = 'classic';

// Super Food State
let superFood = {};
let superFoodActive = false;
let superFoodTimer;
let normalFoodCounter = 0;

// ===== AUDIO CONTEXT FOR SOUND EFFECTS =====
let audioContext;
let isAudioInitialized = false;

function initAudio() {
    if (!isAudioInitialized) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        isAudioInitialized = true;
    }
}

function playBeepSound(frequency = 800, duration = 100) {
    initAudio();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
}

// ===== LOCAL STORAGE FUNCTIONS =====
function loadFromStorage() {
    // Load high score
    highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
    highScoreElement.textContent = highScore;
    
    // Load unlocked skins
    const unlockedSkins = JSON.parse(localStorage.getItem('unlockedSkins')) || ['classic'];
    SKINS.forEach(skin => {
        skin.unlocked = unlockedSkins.includes(skin.id);
    });
    
    // Load current skin
    currentSkinId = localStorage.getItem('currentSkin') || 'classic';
    
    // Load leaderboard
    return JSON.parse(localStorage.getItem('leaderboard')) || [];
}

function saveToStorage() {
    localStorage.setItem('snakeHighScore', highScore);
    
    const unlockedSkins = SKINS.filter(s => s.unlocked).map(s => s.id);
    localStorage.setItem('unlockedSkins', JSON.stringify(unlockedSkins));
    
    localStorage.setItem('currentSkin', currentSkinId);
}

function saveLeaderboard(leaderboard) {
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

// ===== SKIN FUNCTIONS =====
function getCurrentSkin() {
    return SKINS.find(s => s.id === currentSkinId) || SKINS[0];
}

function checkAndUnlockSkins(score) {
    let newlyUnlocked = [];
    
    SKINS.forEach(skin => {
        if (!skin.unlocked && score >= skin.requirement) {
            skin.unlocked = true;
            newlyUnlocked.push(skin.name);
        }
    });
    
    if (newlyUnlocked.length > 0) {
        saveToStorage();
        return newlyUnlocked;
    }
    
    return null;
}

function selectSkin(skinId) {
    const skin = SKINS.find(s => s.id === skinId);
    if (skin && skin.unlocked) {
        currentSkinId = skinId;
        currentSkinNameElement.textContent = `Skin: ${skin.name}`;
        saveToStorage();
        renderSkinSelection();
    }
}

function renderSkinSelection() {
    skinContainer.innerHTML = '';
    
    SKINS.forEach(skin => {
        const skinDiv = document.createElement('div');
        skinDiv.className = `skin-option ${skin.unlocked ? '' : 'locked'} ${skin.id === currentSkinId ? 'selected' : ''}`;
        
        if (skin.unlocked) {
            skinDiv.onclick = () => selectSkin(skin.id);
        }
        
        const colorBox = document.createElement('div');
        colorBox.className = 'skin-color-box';
        if (skin.bodyColor === 'rainbow') {
            colorBox.style.background = 'linear-gradient(135deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)';
        } else {
            colorBox.style.backgroundColor = skin.bodyColor;
        }
        
        const preview = document.createElement('div');
        preview.className = 'skin-preview';
        preview.appendChild(colorBox);
        
        const info = document.createElement('div');
        info.className = 'skin-info';
        info.innerHTML = `
            <div class="skin-name">${skin.name}</div>
            <div class="skin-requirement">${skin.description}</div>
        `;
        preview.appendChild(info);
        
        const status = document.createElement('div');
        status.className = `skin-status ${skin.unlocked ? 'unlocked' : 'locked'}`;
        status.textContent = skin.unlocked ? '✓' : '🔒';
        
        skinDiv.appendChild(preview);
        skinDiv.appendChild(status);
        skinContainer.appendChild(skinDiv);
    });
    
    // Update unlocked count
    const unlockedCount = SKINS.filter(s => s.unlocked).length;
    unlockedCountElement.textContent = `${unlockedCount}/${SKINS.length}`;
}

// ===== LEADERBOARD FUNCTIONS =====
function addToLeaderboard(score, skinName) {
    let leaderboard = loadFromStorage();
    
    const entry = {
        score: score,
        skin: skinName,
        date: new Date().toISOString(),
        timestamp: Date.now()
    };
    
    leaderboard.push(entry);
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, CONFIG.MAX_LEADERBOARD_ENTRIES);
    
    saveLeaderboard(leaderboard);
    renderLeaderboard();
}

function renderLeaderboard() {
    const leaderboard = loadFromStorage();
    
    if (leaderboard.length === 0) {
        leaderboardContainer.classList.add('hidden');
        emptyLeaderboard.classList.remove('hidden');
        return;
    }
    
    leaderboardContainer.classList.remove('hidden');
    emptyLeaderboard.classList.add('hidden');
    leaderboardContainer.innerHTML = '';
    
    leaderboard.forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.className = `leaderboard-entry rank-${index + 1 <= 3 ? index + 1 : 'other'}`;
        
        const date = new Date(entry.date);
        const dateStr = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
        const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        
        const rankBadge = document.createElement('div');
        rankBadge.className = `rank-badge rank-${index + 1 <= 3 ? index + 1 : 'other'}`;
        rankBadge.textContent = index + 1;
        
        entryDiv.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="rank-badge rank-${index + 1 <= 3 ? index + 1 : 'other'}">${index + 1}</div>
                    <div>
                        <div class="text-white font-bold text-lg">${entry.score}</div>
                        <div class="text-gray-400 text-xs">${entry.skin}</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-gray-300 text-xs">${dateStr}</div>
                    <div class="text-gray-500 text-xs">${timeStr}</div>
                </div>
            </div>
        `;
        
        leaderboardContainer.appendChild(entryDiv);
    });
}

function clearLeaderboard() {
    if (confirm('Apakah Anda yakin ingin menghapus semua data leaderboard?')) {
        localStorage.removeItem('leaderboard');
        renderLeaderboard();
    }
}

// ===== GAME FUNCTIONS =====
function startGame() {
    isGameOver = false;
    score = 0;
    scoreElement.textContent = score;

    snake = [{ x: 10, y: 10 }];
    velocity = { x: 0, y: 0 };

    generateFood();
    normalFoodCounter = 0;
    clearSuperFood();
    gameOverMessage.classList.add('hidden');

    clearInterval(gameLoop);
    gameLoop = setInterval(mainGameLoop, CONFIG.GAME_SPEED);
}

function mainGameLoop() {
    if (isGameOver) {
        gameOverMessage.classList.remove('hidden');

        // Update high score
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            saveToStorage();
        }

        // Check for newly unlocked skins
        const newlyUnlocked = checkAndUnlockSkins(score);
        if (newlyUnlocked) {
            unlockMessageElement.textContent = `🎉 Skin baru terbuka: ${newlyUnlocked.join(', ')}!`;
            renderSkinSelection();
        } else {
            unlockMessageElement.textContent = '';
        }

        // Add to leaderboard
        const currentSkin = getCurrentSkin();
        addToLeaderboard(score, currentSkin.name);

        finalScoreElement.textContent = score;
        clearInterval(gameLoop);
        return;
    }

    clearCanvas();
    moveSnake();
    drawFood();
    drawSuperFood();
    drawSnake();
}

function clearCanvas() {
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1f2937');
    gradient.addColorStop(1, '#111827');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CONFIG.CANVAS_SIZE; i += CONFIG.GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CONFIG.CANVAS_SIZE);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(CONFIG.CANVAS_SIZE, i);
        ctx.stroke();
    }
}

function drawSnake() {
    const skin = getCurrentSkin();

    // Draw body with rainbow effect if needed
    if (skin.bodyColor === 'rainbow') {
        drawRainbowSnake();
        return;
    }

    // Draw connected body
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = skin.bodyColor;
    ctx.lineWidth = CONFIG.GRID_SIZE - 4;

    ctx.beginPath();
    ctx.moveTo(snake[0].x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2,
               snake[0].y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2);
    for (let i = 1; i < snake.length; i++) {
        ctx.lineTo(snake[i].x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2,
                   snake[i].y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2);
    }
    ctx.stroke();

    // Draw head
    ctx.fillStyle = skin.headColor;
    ctx.beginPath();
    ctx.arc(snake[0].x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2,
            snake[0].y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2,
            (CONFIG.GRID_SIZE - 4) / 2, 0, 2 * Math.PI);
    ctx.fill();

    // Draw eyes
    drawEyes();
}

function drawRainbowSnake() {
    const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];

    // Draw each segment with different color
    for (let i = 0; i < snake.length; i++) {
        const colorIndex = i % colors.length;
        ctx.fillStyle = colors[colorIndex];
        ctx.beginPath();
        ctx.arc(snake[i].x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2,
                snake[i].y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2,
                (CONFIG.GRID_SIZE - 4) / 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Draw head with glow
    ctx.fillStyle = '#FF1493';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#FF1493';
    ctx.beginPath();
    ctx.arc(snake[0].x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2,
            snake[0].y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2,
            (CONFIG.GRID_SIZE - 4) / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw eyes
    drawEyes();
}

function drawEyes() {
    const head = snake[0];
    const eyeSize = 2;
    ctx.fillStyle = 'white';

    if (velocity.x === 1) { // Right
        ctx.fillRect(head.x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2 + 2,
                     head.y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2 - 5, eyeSize, eyeSize);
        ctx.fillRect(head.x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2 + 2,
                     head.y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2 + 3, eyeSize, eyeSize);
    } else if (velocity.x === -1) { // Left
        ctx.fillRect(head.x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2 - 4,
                     head.y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2 - 5, eyeSize, eyeSize);
        ctx.fillRect(head.x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2 - 4,
                     head.y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2 + 3, eyeSize, eyeSize);
    } else if (velocity.y === 1) { // Down
        ctx.fillRect(head.x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2 - 5,
                     head.y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2 + 2, eyeSize, eyeSize);
        ctx.fillRect(head.x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2 + 3,
                     head.y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2 + 2, eyeSize, eyeSize);
    } else if (velocity.y === -1) { // Up
        ctx.fillRect(head.x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2 - 5,
                     head.y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2 - 4, eyeSize, eyeSize);
        ctx.fillRect(head.x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2 + 3,
                     head.y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2 - 4, eyeSize, eyeSize);
    }
}

function drawFood() {
    const x = food.x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2;
    const y = food.y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2;

    // Stem
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - 1, y - CONFIG.GRID_SIZE / 2.5, 3, 5);

    // Apple
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(x, y + 2, CONFIG.GRID_SIZE / 2.5, 0, 2 * Math.PI);
    ctx.fill();

    // Shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(x - 3, y - 1, 2, 0, 2 * Math.PI);
    ctx.fill();
}

function drawSuperFood() {
    if (!superFoodActive) return;

    const x = superFood.x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2;
    const y = superFood.y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2;

    // Glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#F59E0B';

    // Stem
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - 1, y - CONFIG.GRID_SIZE / 2.5, 3, 5);

    // Golden Apple
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(x, y + 2, CONFIG.GRID_SIZE / 2.5, 0, 2 * Math.PI);
    ctx.fill();

    // Shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(x - 3, y - 1, 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.shadowBlur = 0;
}

function moveSnake() {
    const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

    // Check wall collision
    if (head.x < 0 || head.x >= CONFIG.CANVAS_SIZE / CONFIG.GRID_SIZE ||
        head.y < 0 || head.y >= CONFIG.CANVAS_SIZE / CONFIG.GRID_SIZE) {
        isGameOver = true;
        return;
    }

    // Check self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            isGameOver = true;
            return;
        }
    }

    snake.unshift(head);

    // Check super food collision
    if (superFoodActive && head.x === superFood.x && head.y === superFood.y) {
        score += 2;
        scoreElement.textContent = score;
        playBeepSound(1000, 150); // Higher pitch for super food
        clearSuperFood();
    }
    // Check normal food collision
    else if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        playBeepSound(800, 100); // Normal pitch
        generateFood();

        normalFoodCounter++;
        if (!superFoodActive && normalFoodCounter >= CONFIG.SUPERFOOD_SPAWN_COUNT) {
            generateSuperFood();
        }
    } else {
        snake.pop();
    }
}

function generateFood() {
    let newFoodPosition;
    do {
        newFoodPosition = {
            x: Math.floor(Math.random() * (CONFIG.CANVAS_SIZE / CONFIG.GRID_SIZE)),
            y: Math.floor(Math.random() * (CONFIG.CANVAS_SIZE / CONFIG.GRID_SIZE))
        };
    } while (isSnakeOnPosition(newFoodPosition) ||
             (superFoodActive && newFoodPosition.x === superFood.x && newFoodPosition.y === superFood.y));

    food = newFoodPosition;
}

function generateSuperFood() {
    normalFoodCounter = 0;
    clearTimeout(superFoodTimer);

    let newPosition;
    do {
        newPosition = {
            x: Math.floor(Math.random() * (CONFIG.CANVAS_SIZE / CONFIG.GRID_SIZE)),
            y: Math.floor(Math.random() * (CONFIG.CANVAS_SIZE / CONFIG.GRID_SIZE))
        };
    } while (isSnakeOnPosition(newPosition) ||
             (newPosition.x === food.x && newPosition.y === food.y));

    superFood = newPosition;
    superFoodActive = true;

    superFoodTimer = setTimeout(clearSuperFood, CONFIG.SUPERFOOD_DURATION);
}

function clearSuperFood() {
    superFood = {};
    superFoodActive = false;
    clearTimeout(superFoodTimer);
}

function isSnakeOnPosition(position) {
    return snake.some(part => part.x === position.x && part.y === position.y);
}

// ===== EVENT LISTENERS =====
function changeDirection(e) {
    const KEY = {
        LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40,
        A: 65, W: 87, D: 68, S: 83
    };

    const goingUp = velocity.y === -1;
    const goingDown = velocity.y === 1;
    const goingLeft = velocity.x === -1;
    const goingRight = velocity.x === 1;

    switch (e.keyCode) {
        case KEY.LEFT:
        case KEY.A:
            if (!goingRight) velocity = { x: -1, y: 0 };
            break;
        case KEY.UP:
        case KEY.W:
            if (!goingDown) velocity = { x: 0, y: -1 };
            break;
        case KEY.RIGHT:
        case KEY.D:
            if (!goingLeft) velocity = { x: 1, y: 0 };
            break;
        case KEY.DOWN:
        case KEY.S:
            if (!goingUp) velocity = { x: 0, y: 1 };
            break;
    }
}

// ===== INITIALIZATION =====
function init() {
    loadFromStorage();
    renderSkinSelection();
    renderLeaderboard();

    const currentSkin = getCurrentSkin();
    currentSkinNameElement.textContent = `Skin: ${currentSkin.name}`;

    document.addEventListener('keydown', changeDirection);
    resetButton.addEventListener('click', startGame);
    clearLeaderboardBtn.addEventListener('click', clearLeaderboard);

    // Initialize audio on first user interaction
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });

    startGame();
}

// Start the game when page loads
init();

