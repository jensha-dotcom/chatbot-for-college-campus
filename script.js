// 🔊 LOAD VOICES (IMPORTANT)
let voices = [];

window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
};

function sendMessage() {
    let input = document.getElementById("userInput");
    let msg = input.value.trim();

    if (msg === "") return;

    let chatBox = document.getElementById("chat-box");

    // 👤 USER MESSAGE
    chatBox.innerHTML += `
        <div class="msg user">
            <div class="bubble">${msg}</div>
        </div>
    `;

    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // 🔁 SEND TO FLASK
    fetch("/get", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "msg=" + encodeURIComponent(msg)
    })
    .then(res => res.text())
    .then(data => {

        let formattedData = data;

        // ✅ MAKE LINK CLICKABLE
        if (data.includes("http")) {
            formattedData = `
                <a href="${data}" target="_blank" style="text-decoration:none;">
                    <button style="
                        padding:8px 15px;
                        background:#00aaff;
                        border:none;
                        color:white;
                        border-radius:20px;
                        cursor:pointer;">
                        🌐 Visit Website
                    </button>
                </a>
            `;
        }

        // 🤖 BOT MESSAGE
        chatBox.innerHTML += `
            <div class="msg bot">
                <div class="bubble">${formattedData}</div>
            </div>
        `;

        speak(data); // 🔊 VOICE
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}

// 🔊 FEMALE VOICE FUNCTION
function speak(text) {
    let speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1.4;

    let femaleVoice = voices.find(v =>
        v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("zira") ||
        v.name.toLowerCase().includes("samantha") ||
        v.name.toLowerCase().includes("google uk english female")
    );

    if (femaleVoice) {
        speech.voice = femaleVoice;
    }

    window.speechSynthesis.speak(speech);
}

// 🎤 VOICE INPUT
function startVoice() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Voice not supported in this browser");
        return;
    }

    let recognition = new webkitSpeechRecognition();
    recognition.lang = "en-IN";

    recognition.start();

    recognition.onresult = function(event) {
        let text = event.results[0][0].transcript;
        document.getElementById("userInput").value = text;
        sendMessage();
    };
}

// ⌨️ ENTER KEY
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("userInput").addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
});

// 🔄 NEW CHAT
function newChat() {
    document.getElementById("chat-box").innerHTML = "";
}
