const musicFolder = '.music/';
let musicFiles = [];
let currentTrackIndex = 0;
let isPlaying = false;
let currentVolume = 0.2;
let paused = false;
const audioPlayer = new Audio();
const playButton = document.getElementById('playButton');
const skipButton = document.getElementById('skipButton');
const volumeSlider = document.getElementById('volumeSlider');
const musicInfo = document.getElementById('musicInfo');


function retreivemusicfiles() {
    const musicList = [];

    fetch('music/')
        .then((response) => response.text())
        .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const links = doc.querySelectorAll('a');

            links.forEach((link) => {
                const href = link.getAttribute('href');
                if (href.endsWith('.mp3')) {
                    musicList.push(href); // Use the href as the music file path
                }
            });

            console.log(musicList); // Check if the music files are correctly retrieved

            // Play the first music file by default
            if (musicList.length > 0) {
                audioPlayer.src = musicList[0]; // Update the path to include the 'music/' directory
                //audioPlayer.play();
                musicFiles = musicList;
            }
        })
        .catch((error) => {
            console.log('Error retrieving music files:', error);
        });
}

function playMusic() {
    if (musicFiles.length === 0) return;
    const musicPath = musicFiles[currentTrackIndex];
    audioPlayer.src = musicPath;
    audioPlayer.play();
    isPlaying = true;
    playButton.innerHTML = '<i class="bi bi-pause"></i>';
    displayMusicInfo();
    changeVolume(20 / 100 / 3)
}

function restartMusic() {
    audioPlayer.currentTime = 0;
    audioPlayer.play();
    isPlaying = true;
    playButton.innerHTML = '<i class="bi bi-pause"></i>';
    paused = false;
}

function resumeMusic() {
    audioPlayer.play();
    isPlaying = true;
    playButton.innerHTML = '<i class="bi bi-pause"></i>';
}

function togglePlay() {
    if (isPlaying) {
        pauseMusic();
    } else if (paused) {
        resumeMusic();
    } else {
        playMusic();
    }
}

function pauseMusic() {
    audioPlayer.pause();
    isPlaying = false;
    paused = true;
    playButton.innerHTML = '<i class="bi bi-play"></i>';
}

function previousMusic() {
    currentTrackIndex = (currentTrackIndex - 1 + musicFiles.length) % musicFiles.length;
    playMusic();
}

function skipMusic() {
    currentTrackIndex = (currentTrackIndex + 1) % musicFiles.length;
    playMusic();
}

function changeVolume(volume) {
    if (!isNaN(volume) && isFinite(volume)) {
        currentVolume = volume;
        audioPlayer.volume = currentVolume;
    }
}

$("#volume").slider({
    min: 0,
    max: 100,
    value: 20,
    range: "min",
    slide: function (event, ui) {
        // Mettre à jour le volume lorsque le slider est modifié
        var volume = ui.value / 100 / 3;
        changeVolume(volume);
    }
});

audioPlayer.addEventListener('ended', skipMusic);

function displayMusicInfo() {
    const musicName = musicFiles[currentTrackIndex];
    const musicInfo = document.getElementById('musicInfo');
    musicInfo.textContent = musicName;
}


retreivemusicfiles();
changeVolume();