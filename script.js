// Kode brangkas yang benar (bisa diubah sesuai kebutuhan)
// KODE DEFAULT: 2005 (12 Febuary). Ubah kode ini sesuai keinginan.
const CORRECT_CODE = "2005";

// Variabel global
let currentCode = "";
let isUnlocked = false;
let musicPlaying = false;

// Elemen DOM
const safePage = document.getElementById("safe-page");
const birthdayPage = document.getElementById("birthday-page");
const codeDisplay = document.getElementById("code-display");
const messageDiv = document.getElementById("message");
const keypadButtons = document.querySelectorAll(".keypad-btn");
const clearButton = document.getElementById("clear-btn");
const enterButton = document.getElementById("enter-btn");
const backButton = document.getElementById("back-btn");
const musicButton = document.getElementById("music-btn");
const birthdayMusic = document.getElementById("birthday-music");
const successSound = document.getElementById("success-sound");
const clickSound = document.getElementById("click-sound");
const errorSound = document.getElementById("error-sound");
const safeDoor = document.querySelector(".safe-door");
const successCodeDisplay = document.getElementById("success-code");

// Inisialisasi
function init() {
    updateDisplay();
    
    // Tampilkan kode yang berhasil dibuka di footer
    successCodeDisplay.textContent = `Kode yang berhasil dibuka: ${CORRECT_CODE}`;
    
    // Event listener untuk tombol keypad angka
    keypadButtons.forEach(button => {
        if (button.dataset.number !== undefined) {
            button.addEventListener("click", () => {
                if (currentCode.length < 4 && !isUnlocked) {
                    playSound(clickSound);
                    currentCode += button.dataset.number;
                    updateDisplay();
                    
                    // Efek visual pada tombol yang ditekan
                    button.style.transform = "scale(0.95)";
                    setTimeout(() => {
                        button.style.transform = "";
                    }, 150);
                }
            });
        }
    });
    
    // Tombol clear
    clearButton.addEventListener("click", () => {
        playSound(clickSound);
        currentCode = "";
        updateDisplay();
        clearMessage();
    });
    
    // Tombol enter
    enterButton.addEventListener("click", checkCode);
    
    // Tombol kembali ke brangkas
    backButton.addEventListener("click", goBackToSafe);
    
    // Tombol musik (toggle play/pause)
    musicButton.addEventListener("click", toggleMusic);
    
    // Animasi untuk balon dan konfeti
    initAnimations();
    
    // Event listener untuk keyboard
    document.addEventListener("keydown", handleKeyPress);
}

// Update tampilan kode
function updateDisplay() {
    let displayValue = "";
    for (let i = 0; i < 4; i++) {
        if (i < currentCode.length) {
            displayValue += currentCode[i];
        } else {
            displayValue += "_";
        }
    }
    codeDisplay.textContent = displayValue;
}

// Tampilkan pesan
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = "message " + type;
}

// Hapus pesan
function clearMessage() {
    messageDiv.textContent = "";
    messageDiv.className = "message";
}

// Cek kode yang dimasukkan
function checkCode() {
    playSound(clickSound);
    
    if (currentCode.length !== 4) {
        showMessage("Masukkan 4 digit kode!", "error");
        playSound(errorSound);
        return;
    }
    
    if (currentCode === CORRECT_CODE) {
        // Kode benar
        isUnlocked = true;
        playSound(successSound);
        showMessage("Kode benar! Membuka brangkas...", "success");
        
        // Efek kembang api saat berhasil
        createFireworks(10);
        
        // Animasi membuka brangkas
        safeDoor.classList.add("open");
        
        // Tampilkan halaman ulang tahun setelah delay
        setTimeout(() => {
            safePage.classList.remove("active");
            birthdayPage.classList.add("active");
            
            // Mulai musik secara otomatis
            birthdayMusic.play().then(() => {
                musicPlaying = true;
                updateMusicButton();
            }).catch(e => {
                console.log("Autoplay diblokir:", e);
                musicPlaying = false;
                updateMusicButton();
            });
            
            // Tambahkan efek tambahan
            createConfettiBurst();
            createStarBurst();
            
        }, 2000);
        
    } else {
        // Kode salah
        playSound(errorSound);
        showMessage("Kode salah! Coba kombinasi lain.", "error");
        
        // Reset kode
        currentCode = "";
        updateDisplay();
        
        // Efek getar pada brangkas
        safeDoor.style.animation = "shake 0.5s";
        setTimeout(() => {
            safeDoor.style.animation = "";
        }, 500);
    }
}

// Kembali ke halaman brangkas
function goBackToSafe() {
    playSound(clickSound);
    
    // Reset semua state
    currentCode = "";
    isUnlocked = false;
    
    // Hentikan musik
    birthdayMusic.pause();
    birthdayMusic.currentTime = 0;
    musicPlaying = false;
    updateMusicButton();
    
    // Reset animasi brangkas
    safeDoor.classList.remove("open");
    
    // Kembali ke halaman brangkas
    birthdayPage.classList.remove("active");
    safePage.classList.add("active");
    
    // Update tampilan
    updateDisplay();
    clearMessage();
}

// Toggle musik
function toggleMusic() {
    playSound(clickSound);
    
    if (musicPlaying) {
        birthdayMusic.pause();
        musicPlaying = false;
    } else {
        birthdayMusic.play().catch(e => {
            console.log("Gagal memutar musik:", e);
        });
        musicPlaying = true;
    }
    
    updateMusicButton();
}

// Update teks tombol musik
function updateMusicButton() {
    const icon = musicButton.querySelector("i");
    if (musicPlaying) {
        icon.className = "fas fa-pause";
        musicButton.innerHTML = '<i class="fas fa-pause"></i> Jeda Musik';
    } else {
        icon.className = "fas fa-play";
        musicButton.innerHTML = '<i class="fas fa-play"></i> Putar Musik';
    }
}

// Inisialisasi animasi untuk halaman ulang tahun
function initAnimations() {
    // Tambahkan lebih banyak konfeti secara dinamis
    const confettiContainer = document.querySelector('#birthday-page');
    for (let i = 0; i < 25; i++) {
        createConfetti(1, confettiContainer);
    }
    
    // Efek kilau pada kue
    const cakeContainer = document.querySelector('.cake-container');
    if (cakeContainer) {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                createCakeSparkle(cakeContainer);
            }, i * 300);
        }
    }
}

// Buat konfeti
function createConfetti(count = 1, container = null) {
    if (!container) {
        container = document.querySelector('#birthday-page');
    }
    
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 5 + 's';
        confetti.style.animationDuration = (Math.random() * 5 + 8) + 's';
        
        // Warna acak
        const colors = ['#ff6b6b', '#48dbfb', '#1dd1a1', '#feca57', '#ff9ff3', '#5f27cd'];
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        container.appendChild(confetti);
        
        // Hapus konfeti setelah animasi selesai
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.remove();
            }
        }, 15000);
    }
}

// Buat ledakan konfeti
function createConfettiBurst() {
    const container = document.querySelector('#birthday-page');
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createConfetti(1, container);
        }, i * 50);
    }
}

// Buat ledakan bintang
function createStarBurst() {
    const container = document.querySelector('#birthday-page');
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.className = 'twinkle-star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(star);
            
            setTimeout(() => {
                if (star.parentNode) {
                    star.remove();
                }
            }, 3000);
        }, i * 100);
    }
}

// Buat kembang api
function createFireworks(count) {
    const container = document.querySelector('.fireworks-container');
    if (!container) return;
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = Math.random() * 100 + '%';
            firework.style.top = Math.random() * 100 + '%';
            
            // Warna acak
            const colors = ['#ffd166', '#ef476f', '#06d6a0', '#118ab2', '#ff9e6d'];
            firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            firework.style.boxShadow = `0 0 15px ${colors[Math.floor(Math.random() * colors.length)]}`;
            
            container.appendChild(firework);
            
            // Hapus setelah animasi
            setTimeout(() => {
                if (firework.parentNode) {
                    firework.remove();
                }
            }, 3000);
        }, i * 200);
    }
}

// Buat efek kilau pada kue
function createCakeSparkle(container) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'absolute';
    sparkle.style.width = '8px';
    sparkle.style.height = '8px';
    sparkle.style.background = '#fff';
    sparkle.style.borderRadius = '50%';
    sparkle.style.boxShadow = '0 0 15px #fff, 0 0 30px #ffd166';
    sparkle.style.top = Math.random() * 150 + 'px';
    sparkle.style.left = Math.random() * 250 + 'px';
    sparkle.style.zIndex = '5';
    sparkle.style.opacity = '0';
    
    // Animasi muncul dan hilang
    sparkle.animate([
        { opacity: 0, transform: 'scale(0)' },
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(0)' }
    ], {
        duration: 1500,
        easing: 'ease-in-out'
    });
    
    container.appendChild(sparkle);
    
    // Hapus sparkle setelah animasi selesai
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.remove();
        }
    }, 1500);
}

// Handle input keyboard
function handleKeyPress(event) {
    // Jika berada di halaman brangkas
    if (safePage.classList.contains("active") && !isUnlocked) {
        const key = event.key;
        
        // Input angka 0-9
        if (/^[0-9]$/.test(key) && currentCode.length < 4) {
            playSound(clickSound);
            currentCode += key;
            updateDisplay();
        }
        
        // Backspace untuk menghapus
        if (key === "Backspace") {
            playSound(clickSound);
            currentCode = currentCode.slice(0, -1);
            updateDisplay();
        }
        
        // Enter untuk submit
        if (key === "Enter") {
            checkCode();
        }
    }
}

// Putar suara
function playSound(soundElement) {
    soundElement.currentTime = 0;
    soundElement.play().catch(e => console.log("Gagal memutar suara:", e));
}

// Jalankan inisialisasi saat halaman dimuat
document.addEventListener("DOMContentLoaded", init);
