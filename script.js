// Hindi Devotional Songs - Using reliable audio sources
const playlist = [
    {
        title: "Radhe Radhe",
        artist: "Devotional Song",
        duration: "5:30",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        title: "Hare Krishna",
        artist: "ISKCON Bhajan",
        duration: "6:15",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        title: "Jai Shri Ram",
        artist: "Ram Bhajan",
        duration: "4:45",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
        title: "Om Namo Shivay",
        artist: "Shiv Bhajan",
        duration: "5:00",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    },
    {
        title: "Govind Bolo Hari",
        artist: "Krishna Bhajan",
        duration: "7:20",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
    }
];

// DOM Elements
const audio = document.getElementById('audio');
const playBtn = document.querySelector('.play-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const progressBar = document.querySelector('.progress-bar');
const volumeSlider = document.querySelector('.volume-slider');
const currentTimeEl = document.querySelector('.current-time');
const durationEl = document.querySelector('.duration');
const songTitle = document.querySelector('.song-title');
const artist = document.querySelector('.artist');
const vinyl = document.querySelector('.vinyl');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');
const autoplayCheckbox = document.querySelector('.autoplay-checkbox');
const playlistItems = document.querySelector('.playlist-items');

// State
let currentSongIndex = 0;
let isPlaying = false;
let autoplay = true;

// Initialize
function init() {
    loadSong(currentSongIndex);
    renderPlaylist();
    setupEventListeners();
}

// Load song
function loadSong(index) {
    const song = playlist[index];
    songTitle.textContent = song.title;
    artist.textContent = song.artist;
    audio.src = song.src;
    updatePlaylistActiveState();
}

// Render playlist
function renderPlaylist() {
    playlistItems.innerHTML = '';
    playlist.forEach((song, index) => {
        const li = document.createElement('li');
        li.className = 'playlist-item';
        li.innerHTML = `
            <div class="playlist-item-title">${song.title}</div>
            <div class="playlist-item-artist">${song.artist} • ${song.duration}</div>
        `;
        li.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
        });
        playlistItems.appendChild(li);
    });
    updatePlaylistActiveState();
}

// Update playlist active state
function updatePlaylistActiveState() {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        if (index === currentSongIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Play song
function playSong() {
    isPlaying = true;
    audio.play();
    vinyl.classList.add('playing');
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
}

// Pause song
function pauseSong() {
    isPlaying = false;
    audio.pause();
    vinyl.classList.remove('playing');
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
}

// Previous song
function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = playlist.length - 1;
    }
    loadSong(currentSongIndex);
    if (isPlaying) {
        playSong();
    }
}

// Next song
function nextSong() {
    currentSongIndex++;
    if (currentSongIndex >= playlist.length) {
        currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
    if (isPlaying) {
        playSong();
    }
}

// Update progress bar
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    if (isNaN(duration)) return;
    
    const progressPercent = (currentTime / duration) * 100;
    progressBar.value = progressPercent;
    
    // Update time display
    currentTimeEl.textContent = formatTime(currentTime);
    durationEl.textContent = formatTime(duration);
}

// Set progress
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    
    audio.currentTime = (clickX / width) * duration;
}

// Format time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Set volume
function setVolume(e) {
    audio.volume = e.target.value / 100;
}

// Setup event listeners
function setupEventListeners() {
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleSongEnd);

    progressBar.addEventListener('input', (e) => {
        const duration = audio.duration;
        audio.currentTime = (e.target.value / 100) * duration;
    });

    volumeSlider.addEventListener('input', setVolume);

    autoplayCheckbox.addEventListener('change', (e) => {
        autoplay = e.target.checked;
    });

    // Set initial volume
    audio.volume = volumeSlider.value / 100;
}

// Handle song end
function handleSongEnd() {
    if (autoplay) {
        nextSong();
    } else {
        pauseSong();
        progressBar.value = 0;
        currentTimeEl.textContent = '0:00';
    }
}

// Initialize the player
init();
