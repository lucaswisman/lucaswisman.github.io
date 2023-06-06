const effectFolder = 'effects/';
let effectPlayers = [];
let effectFiles = [];

function retrieveEffectFiles() {
    const effectList = [];

    fetch('./effects/')
        .then((response) => response.text())
        .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const links = doc.querySelectorAll('a');

            links.forEach((link) => {
                const href = link.getAttribute('href');
                if (href.endsWith('.mp3')) {
                    effectList.push(href);
                }
            });

            console.log(effectList); // Check if the effect files are correctly retrieved

            // Create instances of Audio for each effect file
            effectList.forEach((effectPath) => {
                const effectPlayer = new Audio();
                effectPlayer.src = effectPath;
                effectPlayer.loop = true; // Set loop to true
                effectPlayers.push(effectPlayer);
            });

            effectFiles = effectList;
            createEffectControls(); // Create effect controls after retrieving the files
        })
        .catch((error) => {
            console.log('Error retrieving effect files:', error);
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
        setEffectVolume(effectIndex,0.1)
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
