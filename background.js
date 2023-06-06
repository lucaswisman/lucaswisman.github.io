const videoSelect = document.getElementById('videoSelect');
const videoSource = document.getElementById('videoSource');
const lofiVideo = document.getElementById('lofiVideo');

function changeBackgroundVideo() {
    const selectedVideo = videoSelect.value;
    videoSource.src = selectedVideo;
    lofiVideo.load();
}

// Sélectionner la première vidéo par défaut
videoSelect.selectedIndex = 0;
changeBackgroundVideo();