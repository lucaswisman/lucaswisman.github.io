const effectFolder = 'effects/';
let effectPlayers = [];
let effectFiles = [];
function retrieveEffectFiles() {
    const effectList = [];

    fetch('https://api.github.com/repos/lucaswisman/lucaswisman.github.io/effects/contents/')
        .then((response) => response.json())
        .then((data) => {
            data.forEach((item) => {
                const name = item.name;
                if (name.endsWith('.mp3')) {
                    const effectPath = `https://lucaswisman.github.io/effects/${name}`;
                    effectList.push(effectPath);
                }
            });

            console.log(effectList); // Vérifiez si les fichiers d'effet sont correctement récupérés

            // Créez des instances de Audio pour chaque fichier d'effet
            effectList.forEach((effectPath) => {
                const effectPlayer = new Audio();
                effectPlayer.src = effectPath;
                effectPlayer.loop = true; // Définissez loop sur true
                effectPlayers.push(effectPlayer);
            });

            effectFiles = effectList;
            createEffectControls(); // Créez les contrôles d'effet après avoir récupéré les fichiers
        })
        .catch((error) => {
            console.log('Erreur lors de la récupération des fichiers d\'effet :', error);
        });
}


function setEffectVolume(effectIndex, volume) {
    if (effectIndex >= 0 && effectIndex < effectPlayers.length) {
        const effectPlayer = effectPlayers[effectIndex];
        effectPlayer.volume = volume;
    }
}

function playEffect(effectIndex) {
    if (effectIndex >= 0 && effectIndex < effectPlayers.length) {
        const effectPlayer = effectPlayers[effectIndex];
        effectPlayer.play();
        setEffectVolume(effectIndex, 0.1)
    }
}

function pauseEffect(effectIndex) {
    if (effectIndex >= 0 && effectIndex < effectPlayers.length) {
        const effectPlayer = effectPlayers[effectIndex];
        effectPlayer.pause();
    }
}
function createEffectControls() {
    const effectContainer = document.querySelector('.effect-container');

    effectFiles.forEach((effectPath, index) => {
        const effectName = effectPath
            .substring(effectPath.lastIndexOf('/') + 1, effectPath.lastIndexOf('.'))
            .replace('_', ' ')
            .replace(/^(.)(.*)$/, (_, firstChar, rest) => firstChar.toUpperCase() + rest);
        const effectElement = document.createElement('div');
        effectElement.classList.add('effect-item');

        const effectLabel = document.createElement('div');
        effectLabel.textContent = effectName;
        effectLabel.classList.add('effect-label');
        effectElement.appendChild(effectLabel);

        const effectSliderContainer = document.createElement('div');
        effectSliderContainer.classList.add('effect-slider-container');
        effectElement.appendChild(effectSliderContainer);

        const effectVolume = document.createElement('div');
        effectVolume.classList.add('volume');

        const effectSlider = document.createElement('div');
        effectSlider.classList.add('slider');
        effectSlider.addEventListener('input', () => setEffectVolume(index, effectSlider.value));
        effectVolume.appendChild(effectSlider);

        effectSliderContainer.appendChild(effectVolume);

        const effectPlayButton = document.createElement('button');
        effectPlayButton.textContent = 'Play';
        effectPlayButton.classList.add('effect-play-button');
        effectPlayButton.addEventListener('click', () => playEffect(index));
        effectElement.appendChild(effectPlayButton);


        effectContainer.appendChild(effectElement);
    });

    $('.volume').slider({
        min: 0,
        max: 100,
        value: 30,
        range: 'min',
        slide: function (event, ui) {
            var volume = ui.value / 100 / 3;
            var effectIndex = $(this).closest('.effect-item').index();
            setEffectVolume(effectIndex, volume);
        }
    });
}


retrieveEffectFiles();
