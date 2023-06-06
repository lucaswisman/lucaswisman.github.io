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

    fetch('https://api.github.com/repos/lucaswisman/lucaswisman.github.io/contents/music')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                if (item.type === 'file' && item.name.endsWith('.mp3')) {
                    const musicPath = item.download_url;
                    musicList.push(musicPath);
                }
            });

            console.log(musicList); // Vérifiez si les fichiers de musique sont correctement récupérés

            // Jouez le premier fichier de musique par défaut
            if (musicList.length > 0) {
                audioPlayer.src = musicList[0]; // Mettez à jour le chemin pour inclure le dossier 'music'
                //audioPlayer.play();
                musicFiles = musicList;
            }
        })
        .catch(error => {
            console.log('Erreur lors de la récupération des fichiers de musique :', error);
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