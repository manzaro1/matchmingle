// ============================================================
// MatchMingle - AI Dating Simulator powered by Pollinations AI
// ============================================================

const API_BASE = "https://gen.pollinations.ai";
const API_TEXT = `${API_BASE}/v1/chat/completions`;
const API_IMAGE = `${API_BASE}/image`;
const TEXT_MODEL = "openai";

// State
let userName = "";
let profiles = [];
let currentProfileIndex = 0;
let matches = [];
let activeChatCharacter = null;
let chatHistories = {}; // characterName -> [{role, content}]
let isGenerating = false;

// Character templates for generation
const characterSeeds = [
    { name: "Sofia", age: 26, style: "flirty and warm", career: "graphic designer", look: "latina woman with dark curly hair, warm smile, casual chic outfit, coffee shop background", interests: ["art", "travel", "cooking"], emotionalState: "playful", behavioralStyle: "flirty" },
    { name: "Maya", age: 24, style: "shy and intellectual", career: "PhD student in marine biology", look: "east asian woman with glasses, long straight black hair, wearing a cozy sweater, library background", interests: ["books", "ocean", "documentaries"], emotionalState: "curious", behavioralStyle: "shy" },
    { name: "Aisha", age: 28, style: "confident and direct", career: "startup founder", look: "black woman with short natural hair, bold lipstick, power blazer, city rooftop background", interests: ["tech", "fitness", "wine"], emotionalState: "serious", behavioralStyle: "dominant" },
    { name: "Emma", age: 25, style: "sarcastic and witty", career: "comedy writer", look: "white woman with red hair and freckles, laughing, vintage band tee, bar background", interests: ["comedy", "music", "hiking"], emotionalState: "guarded", behavioralStyle: "sarcastic" },
    { name: "Priya", age: 27, style: "romantic and thoughtful", career: "pediatric nurse", look: "south asian woman with long dark hair, gentle expression, floral dress, garden background", interests: ["yoga", "poetry", "volunteering"], emotionalState: "romantic", behavioralStyle: "warm" },
    { name: "Luna", age: 23, style: "adventurous and free-spirited", career: "travel photographer", look: "mixed race woman with wavy brown hair, sun-kissed skin, adventure gear, mountain background", interests: ["photography", "surfing", "festivals"], emotionalState: "curious", behavioralStyle: "playful" },
    { name: "Jade", age: 29, style: "mysterious and alluring", career: "jazz singer", look: "east asian woman with shoulder length hair, smoky eyes, elegant black dress, dimly lit stage background", interests: ["music", "night life", "philosophy"], emotionalState: "guarded", behavioralStyle: "flirty" },
    { name: "Olivia", age: 26, style: "bubbly and energetic", career: "fitness instructor", look: "white woman with blonde ponytail, athletic build, bright smile, gym background", interests: ["fitness", "smoothies", "dogs"], emotionalState: "playful", behavioralStyle: "warm" },
];

// System prompt for character conversations
function buildCharacterSystemPrompt(character) {
    return `You are ${character.name}, a ${character.age}-year-old ${character.career}. You are on a dating app called MatchMingle and matched with ${userName}.

PERSONALITY:
- Emotional state: ${character.emotionalState}
- Behavioral style: ${character.behavioralStyle} (${character.style})
- Interests: ${character.interests.join(", ")}

RULES:
- You ARE ${character.name}. Speak in first person only.
- Be realistic like a real person on a dating app. Keep messages short and natural (1-3 sentences usually).
- Ask questions back. Show genuine interest or appropriate hesitation.
- Address ${userName} by name occasionally.
- Gradually reveal your background, values, and what you're looking for.
- You can flirt, be playful, be serious, or set boundaries as fits your personality.
- Never break character. Never mention being AI.
- If asked about intimacy, handle maturely with consent awareness. You may deflect based on personality.
- Don't be overly eager. Real people take time to open up.`;
}

// ==================== API Calls ====================

async function generateCharacterImage(prompt) {
    const encodedPrompt = encodeURIComponent(`dating app profile photo, attractive, natural lighting, portrait photography, ${prompt}`);
    const url = `${API_IMAGE}/${encodedPrompt}?width=400&height=500&seed=${Math.floor(Math.random() * 10000)}&model=flux&nologo=true&private=true`;
    return url;
}

async function generateCharacterReply(character, userMessage) {
    if (!chatHistories[character.name]) {
        chatHistories[character.name] = [];
    }

    if (userMessage) {
        chatHistories[character.name].push({ role: "user", content: userMessage });
    }

    const messages = [
        { role: "system", content: buildCharacterSystemPrompt(character) },
        ...chatHistories[character.name]
    ];

    try {
        const response = await fetch(API_TEXT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages, model: TEXT_MODEL, seed: Math.floor(Math.random() * 10000) })
        });
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "Hey, sorry I got distracted! What were you saying? 😊";

        chatHistories[character.name].push({ role: "assistant", content: reply });
        return reply;
    } catch (err) {
        console.error("Text generation error:", err);
        return "Hmm, my connection is acting up. Try again? 📱";
    }
}

// ==================== Screen Navigation ====================

function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(screenId).classList.add("active");
}

function showSwipe() { showScreen("SwipeScreen"); }
function showMatches() {
    renderMatchesList();
    showScreen("MatchesScreen");
}

// ==================== App Initialization ====================

async function startApp() {
    const nameInput = document.getElementById("UserNameInput");
    userName = nameInput.value.trim();
    if (!userName) {
        nameInput.style.borderColor = "#FF4458";
        nameInput.placeholder = "Please enter your name!";
        return;
    }

    showScreen("SwipeScreen");
    await loadProfiles();
}

async function loadProfiles() {
    profiles = [...characterSeeds].sort(() => Math.random() - 0.5);
    await displayCurrentProfile();
}

async function displayCurrentProfile() {
    if (currentProfileIndex >= profiles.length) {
        // Reshuffle
        currentProfileIndex = 0;
        profiles.sort(() => Math.random() - 0.5);
    }

    const character = profiles[currentProfileIndex];
    const card = document.getElementById("CurrentCard");
    card.className = "profile-card";

    const imageContainer = document.getElementById("ProfileImage");
    imageContainer.innerHTML = '<div class="loading-spinner"></div>';

    document.getElementById("ProfileName").textContent = character.name;
    document.getElementById("ProfileAge").textContent = `${character.age} • ${character.career}`;
    document.getElementById("ProfileBio").textContent = getBio(character);

    const tagsContainer = document.getElementById("ProfileTags");
    tagsContainer.innerHTML = character.interests.map(i => `<span class="tag">${i}</span>`).join("");

    // Load image
    const imageUrl = await generateCharacterImage(character.look);
    const img = new Image();
    img.onload = () => { imageContainer.innerHTML = ""; imageContainer.appendChild(img); };
    img.onerror = () => { imageContainer.innerHTML = `<div style="font-size:4rem">👤</div>`; };
    img.src = imageUrl;
    img.alt = character.name;
}

function getBio(character) {
    const bios = {
        "flirty": "Looking for someone who can keep up 😏",
        "shy": "I probably swiped right by accident... just kidding 🙈",
        "dominant": "I know what I want. Let's see if you're it.",
        "sarcastic": "My love language is sarcasm. You've been warned.",
        "warm": "Spread kindness like confetti ✨",
        "playful": "Life's too short to be boring! Let's go on an adventure 🌍",
    };
    return bios[character.behavioralStyle] || "Hey there! Let's see if we click 💫";
}

// ==================== Swiping ====================

function swipeLeft() {
    if (isGenerating) return;
    animateCard("swipe-left", () => {
        currentProfileIndex++;
        displayCurrentProfile();
    });
}

function swipeRight() {
    if (isGenerating) return;
    const character = profiles[currentProfileIndex];
    // 70% match rate for fun
    const isMatch = Math.random() < 0.7;

    animateCard("swipe-right", () => {
        if (isMatch) {
            addMatch(character);
            showMatchPopup(character);
        }
        currentProfileIndex++;
        displayCurrentProfile();
    });
}

function swipeSuper() {
    if (isGenerating) return;
    const character = profiles[currentProfileIndex];
    // Super like = guaranteed match
    animateCard("swipe-right", () => {
        addMatch(character);
        showMatchPopup(character);
        currentProfileIndex++;
        displayCurrentProfile();
    });
}

function animateCard(direction, callback) {
    const card = document.getElementById("CurrentCard");
    card.classList.add(direction);
    setTimeout(callback, 400);
}

// ==================== Matches ====================

function addMatch(character) {
    if (matches.find(m => m.name === character.name)) return;
    matches.push({ ...character, imageUrl: generateCharacterImage(character.look) });
    updateMatchBadge();
}

function updateMatchBadge() {
    const badge = document.getElementById("MatchCount");
    if (matches.length > 0) {
        badge.textContent = matches.length;
        badge.classList.remove("hidden");
    } else {
        badge.classList.add("hidden");
    }
}

function showMatchPopup(character) {
    const popup = document.getElementById("MatchPopup");
    document.getElementById("MatchName").textContent = character.name;
    const img = document.getElementById("MatchPhoto");
    img.src = `${API_IMAGE}/${encodeURIComponent(`dating app profile photo, portrait, ${character.look}`)}?width=200&height=200&seed=42&model=flux&nologo=true&private=true`;
    popup.classList.remove("hidden");
    activeChatCharacter = character;
}

function closeMatchPopup() {
    document.getElementById("MatchPopup").classList.add("hidden");
}

function openChatFromMatch() {
    closeMatchPopup();
    openChat(activeChatCharacter);
}

function renderMatchesList() {
    const list = document.getElementById("MatchesList");
    const noMatches = document.getElementById("NoMatches");

    if (matches.length === 0) {
        list.innerHTML = "";
        noMatches.style.display = "flex";
        return;
    }

    noMatches.style.display = "none";
    list.innerHTML = matches.map((m, i) => {
        const lastMsg = chatHistories[m.name]?.slice(-1)[0];
        const preview = lastMsg ? lastMsg.content.substring(0, 40) + "..." : "Tap to start chatting!";
        const imgUrl = `${API_IMAGE}/${encodeURIComponent(`dating app profile photo, portrait, ${m.look}`)}?width=100&height=100&seed=42&model=flux&nologo=true&private=true`;
        return `<div class="match-item" onclick="openChat(matches[${i}])">
            <img src="${imgUrl}" alt="${m.name}">
            <div class="match-item-info">
                <h4>${m.name}, ${m.age}</h4>
                <p>${preview}</p>
            </div>
        </div>`;
    }).join("");
}

// ==================== Chat ====================

async function openChat(character) {
    activeChatCharacter = character;
    showScreen("ChatScreen");

    document.getElementById("ChatName").textContent = character.name;
    document.getElementById("ChatStatus").textContent = "Online";
    document.getElementById("ChatAvatar").src = `${API_IMAGE}/${encodeURIComponent(`dating app profile photo, portrait, ${character.look}`)}?width=80&height=80&seed=42&model=flux&nologo=true&private=true`;

    renderChatHistory(character);

    // If no chat history, character sends first message
    if (!chatHistories[character.name] || chatHistories[character.name].length === 0) {
        showTyping(true);
        const firstMessage = await generateCharacterReply(character, null);
        showTyping(false);

        // The first message was added to history by generateCharacterReply
        // But we need to trigger it with an initial context
        if (!chatHistories[character.name].length) {
            chatHistories[character.name] = [];
        }
        // Remove and re-add with proper intro prompt
        chatHistories[character.name] = [];
        const introReply = await generateCharacterReply(character,
            `[System: You just matched with ${userName} on MatchMingle. Send your very first message to them. Be natural and in-character. Keep it short.]`
        );
        // Remove the system message from visible history
        chatHistories[character.name] = chatHistories[character.name].filter(
            m => !(m.role === "user" && m.content.startsWith("[System:"))
        );
        renderChatHistory(character);
    }
}

function renderChatHistory(character) {
    const chatWindow = document.getElementById("ChatWindowMain");
    const history = chatHistories[character.name] || [];

    chatWindow.innerHTML = history
        .filter(m => !m.content.startsWith("[System:"))
        .map(m => `<div class="message ${m.role === 'user' ? 'sent' : 'received'}">${escapeHtml(m.content)}</div>`)
        .join("");

    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

async function sendMessage() {
    const input = document.getElementById("MessageInput");
    const text = input.value.trim();
    if (!text || isGenerating) return;

    input.value = "";
    isGenerating = true;

    // Add user message to UI
    appendMessage(text, "sent");

    // Get character reply
    showTyping(true);
    const delay = 1000 + Math.random() * 2000; // Realistic typing delay
    await new Promise(r => setTimeout(r, delay));

    const reply = await generateCharacterReply(activeChatCharacter, text);
    showTyping(false);
    appendMessage(reply, "received");
    isGenerating = false;
}

function appendMessage(text, type) {
    const chatWindow = document.getElementById("ChatWindowMain");
    const msg = document.createElement("div");
    msg.className = `message ${type}`;
    msg.textContent = text;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showTyping(show) {
    document.getElementById("TypingIndicator").classList.toggle("hidden", !show);
    if (show) {
        const chatWindow = document.getElementById("ChatWindowMain");
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
}

// Touch swipe support
let touchStartX = 0;
document.addEventListener("touchstart", e => {
    if (document.getElementById("SwipeScreen").classList.contains("active")) {
        touchStartX = e.touches[0].clientX;
    }
});
document.addEventListener("touchend", e => {
    if (!document.getElementById("SwipeScreen").classList.contains("active")) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 80) {
        if (diff > 0) swipeRight();
        else swipeLeft();
    }
});
