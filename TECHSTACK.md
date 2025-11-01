# 🛠️ Tech Stack - Snake Game Modern Edition

Dokumentasi lengkap tentang teknologi, bahasa pemrograman, library, dan tools yang digunakan dalam pengembangan Snake Game Modern Edition.

---

## 📋 Table of Contents
- [Bahasa Pemrograman](#bahasa-pemrograman)
- [Framework & Library](#framework--library)
- [Web APIs](#web-apis)
- [Tools & Development](#tools--development)
- [Arsitektur & Pattern](#arsitektur--pattern)
- [Browser Compatibility](#browser-compatibility)

---

## 💻 Bahasa Pemrograman

### 1. **HTML5**
- **Versi**: HTML5
- **Penggunaan**: 
  - Struktur halaman web
  - Canvas element untuk rendering game
  - Semantic markup untuk SEO
  - Audio element placeholder
- **File**: `index.html`

### 2. **CSS3**
- **Versi**: CSS3
- **Penggunaan**:
  - Styling dan layout
  - Animasi dan transisi
  - Responsive design
  - Custom scrollbar
  - Glassmorphism effects
- **File**: `style.css`

### 3. **JavaScript (ES6+)**
- **Versi**: ECMAScript 6 (ES2015) dan fitur modern
- **Penggunaan**:
  - Game logic dan mechanics
  - DOM manipulation
  - Event handling
  - LocalStorage management
  - Audio generation
- **File**: `script.js`
- **Fitur ES6+ yang Digunakan**:
  - `const` dan `let` declarations
  - Arrow functions
  - Template literals
  - Destructuring
  - Array methods (map, filter, forEach, some, find)
  - Object shorthand
  - Default parameters

---

## 🎨 Framework & Library

### 1. **Tailwind CSS**
- **Versi**: Latest (via CDN)
- **CDN**: `https://cdn.tailwindcss.com`
- **Penggunaan**:
  - Utility-first CSS framework
  - Responsive grid system
  - Color palette dan gradients
  - Spacing dan sizing utilities
  - Flexbox dan Grid layouts
- **Keuntungan**:
  - Rapid prototyping
  - Consistent design system
  - Responsive by default
  - No custom CSS needed untuk layout

### 2. **Google Fonts**
- **Font**: Press Start 2P
- **CDN**: Google Fonts API
- **Penggunaan**:
  - Pixel/retro style font
  - Memberikan nuansa game klasik
  - Web-safe dan optimized
- **Link**: `https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap`

---

## 🔌 Web APIs

### 1. **Canvas API**
- **Penggunaan**: Core rendering engine untuk game
- **Fitur yang Digunakan**:
  - `getContext('2d')` - 2D rendering context
  - `fillRect()` - Menggambar kotak (background, stem)
  - `arc()` - Menggambar lingkaran (kepala ular, makanan)
  - `beginPath()`, `moveTo()`, `lineTo()` - Menggambar path (badan ular)
  - `stroke()`, `fill()` - Rendering shapes
  - Gradient creation (`createLinearGradient()`)
  - Shadow effects (`shadowBlur`, `shadowColor`)
- **Konfigurasi**:
  - Canvas size: 400x400 pixels
  - Grid size: 20x20 tiles
  - Image rendering: pixelated/crisp-edges

### 2. **Web Audio API**
- **Penggunaan**: Generate sound effects secara real-time
- **Fitur yang Digunakan**:
  - `AudioContext` - Audio processing context
  - `OscillatorNode` - Generate waveforms
  - `GainNode` - Volume control
  - Waveform type: 'square' untuk retro beep sound
- **Sound Effects**:
  - Normal food: 800Hz, 100ms duration
  - Super food: 1000Hz, 150ms duration
- **Keuntungan**:
  - No external audio files needed
  - Lightweight dan instant
  - Customizable pitch dan duration
  - Browser-native support

### 3. **LocalStorage API**
- **Penggunaan**: Persistent data storage
- **Data yang Disimpan**:
  - `snakeHighScore` - Skor tertinggi (integer)
  - `unlockedSkins` - Array skin yang sudah terbuka (JSON)
  - `currentSkin` - Skin yang sedang digunakan (string)
  - `leaderboard` - Array 10 skor tertinggi (JSON)
- **Kapasitas**: ~5-10MB (lebih dari cukup untuk game data)
- **Persistence**: Data tetap ada setelah browser ditutup

### 4. **DOM API**
- **Penggunaan**: Manipulasi elemen HTML
- **Methods yang Digunakan**:
  - `getElementById()` - Get element references
  - `querySelector()`, `querySelectorAll()` - CSS selector queries
  - `createElement()` - Dynamic element creation
  - `classList` - Class manipulation (add, remove, toggle)
  - `addEventListener()` - Event handling
  - `innerHTML`, `textContent` - Content manipulation

### 5. **Timing APIs**
- **setInterval()**: Game loop (100ms interval)
- **setTimeout()**: Super food timer (5000ms)
- **clearInterval()**, **clearTimeout()**: Cleanup timers
- **Date API**: Timestamp untuk leaderboard

---

## 🏗️ Arsitektur & Pattern

### **Struktur File**
```
snake-game/
├── index.html          # View Layer
├── style.css           # Presentation Layer
├── script.js           # Logic Layer
├── README.md           # Documentation
└── TECHSTACK.md        # Technical Documentation
```

### **Design Patterns**

#### 1. **Module Pattern**
- Encapsulation menggunakan IIFE (Implicit)
- Global scope pollution prevention
- Organized code structure

#### 2. **Configuration Object Pattern**
```javascript
const CONFIG = {
    GRID_SIZE: 20,
    CANVAS_SIZE: 400,
    GAME_SPEED: 100,
    // ...
}
```
- Centralized configuration
- Easy to modify game parameters
- Maintainable constants

#### 3. **Data-Driven Design**
```javascript
const SKINS = [
    { id, name, headColor, bodyColor, requirement, ... },
    // ...
]
```
- Skin system driven by data array
- Easy to add/remove skins
- Scalable architecture

#### 4. **State Management**
- Game state variables (snake, food, velocity, score)
- Centralized state updates
- Predictable state flow

#### 5. **Event-Driven Programming**
- Keyboard events untuk kontrol
- Click events untuk UI interaction
- Timer events untuk game loop

### **Code Organization**

```javascript
// 1. Configuration & Constants
// 2. Skin Definitions
// 3. DOM Elements
// 4. Game State
// 5. Audio Functions
// 6. LocalStorage Functions
// 7. Skin Functions
// 8. Leaderboard Functions
// 9. Game Functions
// 10. Event Listeners
// 11. Initialization
```

---

## 🎮 Game Logic Architecture

### **Game Loop**
```
startGame() 
    ↓
setInterval(mainGameLoop, 100ms)
    ↓
Loop: clearCanvas() → moveSnake() → drawFood() → drawSuperFood() → drawSnake()
    ↓
Check collision → Update score → Check game over
```

### **Collision Detection**
- Wall collision: Boundary checking
- Self collision: Array iteration
- Food collision: Position comparison

### **Rendering Pipeline**
1. Clear canvas dengan gradient
2. Draw grid lines (optional)
3. Draw food items
4. Draw snake body (connected segments)
5. Draw snake head
6. Draw eyes (direction-aware)

---

## 🎨 Styling Techniques

### **CSS Techniques Used**

1. **Glassmorphism**
   - `backdrop-filter: blur()`
   - Semi-transparent backgrounds
   - Border dengan opacity

2. **Gradient Backgrounds**
   - Linear gradients
   - Multi-color gradients
   - Gradient text (background-clip)

3. **Animations**
   - `@keyframes` untuk custom animations
   - CSS transitions
   - Transform effects
   - Pulse, glow, slide-in animations

4. **Responsive Design**
   - Mobile-first approach
   - Breakpoints: 768px, 1024px
   - Flexible grid system
   - Scalable typography

5. **Custom Scrollbar**
   - Webkit scrollbar styling
   - Themed untuk match design
   - Smooth hover effects

---

## 🌐 Browser Compatibility

### **Minimum Requirements**
- Modern browsers dengan ES6 support
- Canvas API support
- Web Audio API support
- LocalStorage support

### **Tested & Compatible**
- ✅ Google Chrome 90+
- ✅ Mozilla Firefox 88+
- ✅ Microsoft Edge 90+
- ✅ Safari 14+
- ✅ Opera 76+

### **Not Supported**
- ❌ Internet Explorer (semua versi)
- ❌ Browsers tanpa ES6 support
- ❌ Browsers tanpa Canvas API

---

## 📦 Dependencies

### **External Dependencies**
1. **Tailwind CSS** (CDN)
   - No installation required
   - Always up-to-date
   - No build process needed

2. **Google Fonts** (CDN)
   - Press Start 2P font
   - Optimized delivery
   - Cached by browser

### **No Build Tools Required**
- ✅ No npm/yarn
- ✅ No webpack/vite
- ✅ No compilation step
- ✅ Pure vanilla JavaScript
- ✅ Ready to run - just open HTML!

---

## 🔧 Development Tools (Recommended)

### **Code Editor**
- Visual Studio Code
- Sublime Text
- Atom
- WebStorm

### **Browser DevTools**
- Chrome DevTools
- Firefox Developer Tools
- Console untuk debugging
- Network tab untuk CDN monitoring
- Application tab untuk LocalStorage inspection

### **Version Control**
- Git untuk source control
- GitHub untuk hosting

---

## 📊 Performance Considerations

### **Optimizations**
1. **Canvas Rendering**
   - Efficient drawing algorithms
   - Minimal redraws
   - Hardware acceleration

2. **Memory Management**
   - No memory leaks
   - Proper timer cleanup
   - Efficient data structures

3. **LocalStorage**
   - Minimal data storage
   - JSON serialization
   - Lazy loading

4. **Audio**
   - On-demand audio context
   - Short sound durations
   - Efficient oscillator cleanup

### **Performance Metrics**
- Game loop: 100ms (10 FPS)
- Canvas size: 400x400px
- Memory usage: < 10MB
- LocalStorage: < 1KB

---

## 🚀 Future Tech Enhancements (Potential)

### **Possible Upgrades**
1. **Progressive Web App (PWA)**
   - Service Worker
   - Offline capability
   - Install to home screen

2. **Backend Integration**
   - Online leaderboard
   - User authentication
   - Cloud save

3. **Advanced Graphics**
   - WebGL untuk 3D effects
   - Particle systems
   - Advanced animations

4. **Multiplayer**
   - WebSocket integration
   - Real-time multiplayer
   - Competitive mode

5. **Mobile Enhancements**
   - Touch controls
   - Gyroscope support
   - Haptic feedback

---

## 📝 Summary

### **Core Technologies**
- HTML5 Canvas untuk rendering
- Vanilla JavaScript untuk logic
- CSS3 untuk styling
- Web APIs untuk features

### **Key Strengths**
- ✅ Zero dependencies (except CDN)
- ✅ Pure vanilla JavaScript
- ✅ No build process
- ✅ Lightweight dan fast
- ✅ Modern dan maintainable
- ✅ Cross-browser compatible

### **Total Lines of Code**
- HTML: ~148 lines
- CSS: ~250 lines
- JavaScript: ~662 lines
- **Total: ~1,060 lines**

---

**Tech Stack Version**: 2.0  
**Last Updated**: 2025  
**Maintained by**: Rahmat Dial

---

*Dibuat dengan teknologi modern untuk pengalaman gaming yang optimal!* 🎮✨

