const text = document.getElementById("text"),
      fileUpload = document.getElementById("fileUpload"),
      voiceSelectBox = document.getElementById("voice"),
      volume = document.getElementById("volume"),
      rate = document.getElementById("rate"),
      pitch = document.getElementById("pitch"),
      playBtn = document.getElementById("play"),
      pauseBtn = document.getElementById("pause"),
      resumeBtn = document.getElementById("resume"),
      resetBtn = document.getElementById("reset"),
      volume_amount = document.getElementById("volume_amount"),
      rate_amount = document.getElementById("rate_amount"),
      pitch_amount = document.getElementById("pitch_amount");

let speech = new SpeechSynthesisUtterance(text.value);
speech.lang = 'en';

let voicesOptions = [];

// File upload handling
fileUpload.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.name.split('.').pop().toLowerCase();
    
    try {
        if (fileType === 'txt') {
            // Read text file
            const reader = new FileReader();
            reader.onload = function(e) {
                text.value = e.target.result;
            };
            reader.readAsText(file);
        } else if (fileType === 'pdf') {
            // Read PDF file
            const reader = new FileReader();
            reader.onload = async function(e) {
                const pdfData = new Uint8Array(e.target.result);
                const pdf = await pdfjsLib.getDocument({data: pdfData}).promise;
                let fullText = '';

                // Extract text from all pages
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    fullText += pageText + '\n';
                }

                text.value = fullText;
            };
            reader.readAsArrayBuffer(file);
        }
    } catch (error) {
        console.error('Error reading file:', error);
        alert('Error reading file. Please try again.');
    }
});

// Voice selection setup
window.speechSynthesis.onvoiceschanged = function() {
    voicesOptions = window.speechSynthesis.getVoices();
    speech.voice = voicesOptions[0];  // setting default voice
    voicesOptions.forEach(function(systemVoice, index) {
        voiceSelectBox.options[index] = new Option(systemVoice.name, index); // setting options in select box
    });
};

voiceSelectBox.addEventListener("change", function() {
    speech.voice = voicesOptions[voiceSelectBox.value];
});

// Volume, rate, and pitch controls
volume.addEventListener("input", function() {
    speech.volume = volume.value;
    volume_amount.innerText = volume.value;
});

rate.addEventListener("input", function() {
    speech.rate = rate.value;
    rate_amount.innerText = rate.value;
});

pitch.addEventListener("input", function() {
    speech.pitch = pitch.value;
    pitch_amount.innerText = pitch.value;
});

// Playback controls
playBtn.addEventListener("click", function() {
    speech.text = text.value;
    window.speechSynthesis.speak(speech);
});

pauseBtn.addEventListener("click", () => window.speechSynthesis.pause());
resumeBtn.addEventListener("click", () => window.speechSynthesis.resume());
resetBtn.addEventListener("click", () => window.speechSynthesis.cancel());