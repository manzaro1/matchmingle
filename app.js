// ============================================================
// MatchMingle - AI Dating Simulator powered by Pollinations AI
// ============================================================

const API_BASE = "https://gen.pollinations.ai";
const API_TEXT = `${API_BASE}/v1/chat/completions`;
const API_IMAGE = `${API_BASE}/image`;
const TEXT_MODEL = "openai";

// State
let userName = "";
let userGender = "";
let userPreference = "";
let profiles = [];
let currentProfileIndex = 0;
let matches = [];
let activeChatCharacter = null;
let chatHistories = {};
let isGenerating = false;

// ==================== CHARACTER DATABASE ====================

const femaleCharacters = [
    { name: "Sofia", age: 26, style: "flirty and warm", career: "graphic designer", look: "latina woman with dark curly hair, warm smile, casual chic outfit, coffee shop background", interests: ["art", "travel", "cooking"], emotionalState: "playful", behavioralStyle: "flirty", gender: "female" },
    { name: "Maya", age: 24, style: "shy and intellectual", career: "PhD student in marine biology", look: "east asian woman with glasses, long straight black hair, cozy sweater, library background", interests: ["books", "ocean", "documentaries"], emotionalState: "curious", behavioralStyle: "shy", gender: "female" },
    { name: "Aisha", age: 28, style: "confident and direct", career: "startup founder", look: "black woman with short natural hair, bold lipstick, power blazer, city rooftop background", interests: ["tech", "fitness", "wine"], emotionalState: "serious", behavioralStyle: "dominant", gender: "female" },
    { name: "Emma", age: 25, style: "sarcastic and witty", career: "comedy writer", look: "white woman with red hair and freckles, laughing, vintage band tee, bar background", interests: ["comedy", "music", "hiking"], emotionalState: "guarded", behavioralStyle: "sarcastic", gender: "female" },
    { name: "Priya", age: 27, style: "romantic and thoughtful", career: "pediatric nurse", look: "south asian woman with long dark hair, gentle expression, floral dress, garden background", interests: ["yoga", "poetry", "volunteering"], emotionalState: "romantic", behavioralStyle: "warm", gender: "female" },
    { name: "Luna", age: 23, style: "adventurous and free-spirited", career: "travel photographer", look: "mixed race woman with wavy brown hair, sun-kissed skin, adventure gear, mountain background", interests: ["photography", "surfing", "festivals"], emotionalState: "curious", behavioralStyle: "playful", gender: "female" },
    { name: "Jade", age: 29, style: "mysterious and alluring", career: "jazz singer", look: "east asian woman with shoulder length hair, smoky eyes, elegant black dress, dimly lit stage", interests: ["music", "nightlife", "philosophy"], emotionalState: "guarded", behavioralStyle: "flirty", gender: "female" },
    { name: "Olivia", age: 26, style: "bubbly and energetic", career: "fitness instructor", look: "white woman with blonde ponytail, athletic build, bright smile, gym background", interests: ["fitness", "smoothies", "dogs"], emotionalState: "playful", behavioralStyle: "warm", gender: "female" },
    { name: "Zara", age: 30, style: "sophisticated and ambitious", career: "corporate lawyer", look: "middle eastern woman with sleek dark hair, sharp features, tailored suit, modern office", interests: ["law", "fine dining", "chess"], emotionalState: "serious", behavioralStyle: "dominant", gender: "female" },
    { name: "Chloe", age: 22, style: "creative and dreamy", career: "art student", look: "white woman with pastel pink hair, paint-stained overalls, art studio background", interests: ["painting", "anime", "thrift shopping"], emotionalState: "romantic", behavioralStyle: "shy", gender: "female" },
    { name: "Naomi", age: 27, style: "bold and unapologetic", career: "DJ and music producer", look: "black woman with colorful braids, streetwear, neon lights club background", interests: ["EDM", "fashion", "gaming"], emotionalState: "playful", behavioralStyle: "dominant", gender: "female" },
    { name: "Yuki", age: 25, style: "calm and observant", career: "software engineer", look: "japanese woman with bob cut, minimal makeup, clean style, modern apartment background", interests: ["coding", "tea ceremony", "cats"], emotionalState: "curious", behavioralStyle: "shy", gender: "female" },
    { name: "Isabella", age: 28, style: "passionate and expressive", career: "flamenco dancer", look: "spanish woman with long black hair, red lipstick, flowing red dress, dance studio", interests: ["dance", "wine", "poetry"], emotionalState: "romantic", behavioralStyle: "flirty", gender: "female" },
    { name: "Amara", age: 26, style: "grounded and nurturing", career: "elementary school teacher", look: "african woman with natural afro, warm smile, colorful dress, classroom background", interests: ["children", "gardening", "cooking"], emotionalState: "romantic", behavioralStyle: "warm", gender: "female" },
    { name: "Freya", age: 24, style: "fierce and independent", career: "rock climbing instructor", look: "scandinavian woman with short blonde hair, toned arms, outdoor gear, cliff background", interests: ["climbing", "camping", "craft beer"], emotionalState: "guarded", behavioralStyle: "sarcastic", gender: "female" },
    { name: "Mei", age: 23, style: "sweet and playful", career: "pastry chef", look: "chinese woman with long hair in bun, flour on cheek, chef whites, bakery background", interests: ["baking", "K-drama", "bubble tea"], emotionalState: "playful", behavioralStyle: "warm", gender: "female" },
    { name: "Valentina", age: 29, style: "sensual and confident", career: "fashion designer", look: "brazilian woman with caramel skin, flowing dark hair, designer outfit, fashion studio", interests: ["fashion", "salsa", "travel"], emotionalState: "serious", behavioralStyle: "flirty", gender: "female" },
    { name: "Suki", age: 21, style: "quirky and nerdy", career: "veterinary student", look: "korean woman with round glasses, oversized hoodie, holding a kitten, pet clinic background", interests: ["animals", "manga", "board games"], emotionalState: "curious", behavioralStyle: "shy", gender: "female" },
    { name: "Nia", age: 27, style: "spiritual and wise", career: "yoga instructor and life coach", look: "mixed race woman with locs, serene expression, bohemian outfit, sunset beach background", interests: ["meditation", "astrology", "vegan cooking"], emotionalState: "romantic", behavioralStyle: "warm", gender: "female" },
    { name: "Harper", age: 25, style: "sharp-tongued and charming", career: "investigative journalist", look: "white woman with dark bob, intense eyes, leather jacket, newsroom background", interests: ["true crime", "writing", "whiskey"], emotionalState: "guarded", behavioralStyle: "sarcastic", gender: "female" },
    { name: "Aria", age: 22, style: "gentle and artistic", career: "classical pianist", look: "persian woman with long wavy dark hair, elegant blouse, grand piano background", interests: ["classical music", "literature", "stargazing"], emotionalState: "romantic", behavioralStyle: "shy", gender: "female" },
];

const maleCharacters = [
    { name: "Marcus", age: 28, style: "charming and confident", career: "architect", look: "black man with short fade, warm brown eyes, fitted blazer, modern building background", interests: ["design", "basketball", "cooking"], emotionalState: "playful", behavioralStyle: "flirty", gender: "male" },
    { name: "Ethan", age: 26, style: "laid-back and funny", career: "software developer", look: "white man with messy brown hair, casual hoodie, coffee in hand, coworking space background", interests: ["coding", "stand-up comedy", "gaming"], emotionalState: "curious", behavioralStyle: "sarcastic", gender: "male" },
    { name: "Kai", age: 25, style: "adventurous and spontaneous", career: "surf instructor", look: "hawaiian man with tan skin, long wavy hair, board shorts, beach sunset background", interests: ["surfing", "travel", "photography"], emotionalState: "playful", behavioralStyle: "warm", gender: "male" },
    { name: "Rafael", age: 30, style: "intense and passionate", career: "chef and restaurant owner", look: "latino man with dark stubble, strong jawline, chef coat, restaurant kitchen background", interests: ["cooking", "wine", "motorcycles"], emotionalState: "serious", behavioralStyle: "dominant", gender: "male" },
    { name: "James", age: 27, style: "thoughtful and reserved", career: "English professor", look: "white man with glasses, neatly trimmed beard, tweed jacket, bookshelf background", interests: ["literature", "poetry", "jazz"], emotionalState: "romantic", behavioralStyle: "shy", gender: "male" },
    { name: "Darius", age: 29, style: "smooth and ambitious", career: "investment banker", look: "black man with clean shave, sharp suit, confident smile, city skyline background", interests: ["finance", "golf", "fine dining"], emotionalState: "serious", behavioralStyle: "dominant", gender: "male" },
    { name: "Hiroshi", age: 24, style: "quiet and artistic", career: "tattoo artist", look: "japanese man with undercut hairstyle, tattooed arms, artistic studio background", interests: ["art", "anime", "skateboarding"], emotionalState: "guarded", behavioralStyle: "shy", gender: "male" },
    { name: "Leo", age: 26, style: "playful and flirtatious", career: "personal trainer", look: "italian man with dark curly hair, athletic build, tank top, outdoor gym background", interests: ["fitness", "soccer", "pasta making"], emotionalState: "playful", behavioralStyle: "flirty", gender: "male" },
    { name: "Omar", age: 28, style: "poetic and deep", career: "documentary filmmaker", look: "arab man with short beard, soulful eyes, casual linen shirt, desert landscape background", interests: ["cinema", "philosophy", "travel"], emotionalState: "romantic", behavioralStyle: "warm", gender: "male" },
    { name: "Nikolai", age: 31, style: "mysterious and intense", career: "classical violinist", look: "eastern european man with sharp cheekbones, dark eyes, black turtleneck, concert hall background", interests: ["music", "chess", "whiskey"], emotionalState: "guarded", behavioralStyle: "dominant", gender: "male" },
    { name: "Tyler", age: 23, style: "goofy and endearing", career: "veterinarian", look: "white man with blonde hair, freckles, scrubs, holding a puppy, vet clinic background", interests: ["animals", "hiking", "board games"], emotionalState: "playful", behavioralStyle: "warm", gender: "male" },
    { name: "Andre", age: 27, style: "suave and worldly", career: "diplomat", look: "french african man with neat beard, tailored coat, European cafe background", interests: ["politics", "languages", "wine tasting"], emotionalState: "curious", behavioralStyle: "flirty", gender: "male" },
    { name: "Jin", age: 25, style: "gentle and caring", career: "pediatrician", look: "korean man with soft features, clean cut, white coat, hospital garden background", interests: ["medicine", "piano", "volunteering"], emotionalState: "romantic", behavioralStyle: "warm", gender: "male" },
    { name: "Diego", age: 29, style: "wild and free-spirited", career: "rock musician", look: "latino man with long dark hair, leather jacket, guitar, dimly lit stage background", interests: ["music", "road trips", "tattoos"], emotionalState: "guarded", behavioralStyle: "sarcastic", gender: "male" },
    { name: "Aiden", age: 24, style: "nerdy and sweet", career: "game developer", look: "white man with glasses, graphic tee, headphones around neck, gaming setup background", interests: ["gaming", "sci-fi", "D&D"], emotionalState: "curious", behavioralStyle: "shy", gender: "male" },
    { name: "Malik", age: 28, style: "protective and loyal", career: "firefighter", look: "black man with muscular build, warm smile, firefighter jacket, fire station background", interests: ["fitness", "community service", "BBQ"], emotionalState: "serious", behavioralStyle: "warm", gender: "male" },
    { name: "Ravi", age: 26, style: "witty and intellectual", career: "data scientist", look: "indian man with trimmed beard, smart casual outfit, modern office background", interests: ["AI", "cricket", "stand-up comedy"], emotionalState: "curious", behavioralStyle: "sarcastic", gender: "male" },
    { name: "Sebastian", age: 30, style: "old-school romantic", career: "winemaker", look: "white man with salt-and-pepper stubble, linen shirt rolled up, vineyard background", interests: ["wine", "cooking", "sailing"], emotionalState: "romantic", behavioralStyle: "flirty", gender: "male" },
    { name: "Tao", age: 23, style: "chill and mindful", career: "yoga instructor", look: "chinese man with lean build, man bun, peaceful expression, zen garden background", interests: ["meditation", "martial arts", "tea"], emotionalState: "romantic", behavioralStyle: "warm", gender: "male" },
    { name: "Axel", age: 27, style: "edgy and charismatic", career: "motorcycle mechanic", look: "scandinavian man with blonde stubble, grease-stained hands, motorcycle garage background", interests: ["motorcycles", "rock music", "camping"], emotionalState: "guarded", behavioralStyle: "dominant", gender: "male" },
    { name: "Mateo", age: 25, style: "warm and family-oriented", career: "elementary school teacher", look: "latino man with kind eyes, casual button-up, playground background", interests: ["kids", "soccer", "guitar"], emotionalState: "romantic", behavioralStyle: "warm", gender: "male" },
];

// ==================== API Calls ====================

function generateCharacterImageUrl(lookPrompt) {
    const encodedPrompt = encodeURIComponent(`dating app profile photo, attractive, natural lighting, portrait photography, ${lookPrompt}`);
    return `${API_IMAGE}/${encodedPrompt}?width=400&height=500&seed=${Math.floor(Math.random() * 10000)}&model=flux&nologo=true&private=true`;
}

function generateCharacterThumbUrl(lookPrompt, seed) {
    const encodedPrompt = encodeURIComponent(`dating app profile photo, portrait, ${lookPrompt}`);
    return `${API_IMAGE}/${encodedPrompt}?width=100&height=100&seed=${seed || 42}&model=flux&nologo=true&private=true`;
}

function buildCharacterSystemPrompt(character) {
    return `You are ${character.name}, a ${character.age}-year-old ${character.gender} ${character.career}. You are on a dating app called MatchMingle and matched with ${userName}.

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

// ==================== App Init ====================

function startApp() {
    const nameInput = document.getElementById("UserNameInput");
    userName = nameInput.value.trim();
    if (!userName) {
        nameInput.style.borderColor = "#FF4458";
        nameInput.placeholder = "Please enter your name!";
        return;
    }

    // Get gender
    const genderRadio = document.querySelector('input[name="gender"]:checked');
    if (!genderRadio) {
        document.getElementById("GenderError").textContent = "Please select your gender";
        return;
    }
    userGender = genderRadio.value;

    // Get preference
    const prefRadio = document.querySelector('input[name="preference"]:checked');
    if (!prefRadio) {
        document.getElementById("PrefError").textContent = "Please select your preference";
        return;
    }
    userPreference = prefRadio.value;

    showScreen("SwipeScreen");
    loadProfiles();
}

function loadProfiles() {
    let pool = [];
    if (userPreference === "women" || userPreference === "both") {
        pool = pool.concat(femaleCharacters);
    }
    if (userPreference === "men" || userPreference === "both") {
        pool = pool.concat(maleCharacters);
    }
    profiles = pool.sort(() => Math.random() - 0.5);
    currentProfileIndex = 0;
    displayCurrentProfile();
}

function displayCurrentProfile() {
    if (currentProfileIndex >= profiles.length) {
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

    const imageUrl = generateCharacterImageUrl(character.look);
    const img = new Image();
    img.onload = () => { imageContainer.innerHTML = ""; imageContainer.appendChild(img); };
    img.onerror = () => { imageContainer.innerHTML = `<div style="font-size:4rem">👤</div>`; };
    img.src = imageUrl;
    img.alt = character.name;
}

function getBio(character) {
    const bios = {
        flirty: [
            "Looking for someone who can keep up 😏",
            "Swipe right if you can handle this energy 💋",
            "I don't bite... unless you're into that 😉",
        ],
        shy: [
            "I probably swiped right by accident... just kidding 🙈",
            "Quiet but worth getting to know 🌸",
            "My friends made me download this... but hi 👋",
        ],
        dominant: [
            "I know what I want. Let's see if you're it.",
            "Not here to waste time. Impress me.",
            "Ambitious is my middle name 💪",
        ],
        sarcastic: [
            "My love language is sarcasm. You've been warned.",
            "Looking for someone who laughs at my terrible jokes 🙃",
            "If you can't handle me at my worst, that's fair 😂",
        ],
        warm: [
            "Spread kindness like confetti ✨",
            "Good vibes and deep conversations 💛",
            "Looking for my person. Maybe it's you? 🥰",
        ],
        playful: [
            "Life's too short to be boring! Let's go on an adventure 🌍",
            "Challenge me to anything, I dare you 🎯",
            "Fun first, serious stuff later 🎉",
        ],
    };
    const options = bios[character.behavioralStyle] || ["Hey there! Let's see if we click 💫"];
    return options[Math.floor(Math.random() * options.length)];
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
    character.seed = Math.floor(Math.random() * 10000);
    matches.push({ ...character });
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
    document.getElementById("MatchPhoto").src = generateCharacterThumbUrl(character.look, character.seed);
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
        const preview = lastMsg
            ? (lastMsg.content.startsWith("[System:") ? "Tap to start chatting!" : lastMsg.content.substring(0, 40) + "...")
            : "Tap to start chatting!";
        const imgUrl = generateCharacterThumbUrl(m.look, m.seed);
        return `<div class="match-item" onclick="openChat(matches[${i}])">
            <img src="${imgUrl}" alt="${m.name}">
            <div class="match-item-info">
                <h4>${m.name}, ${m.age}</h4>
                <p>${escapeHtml(preview)}</p>
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
    document.getElementById("ChatAvatar").src = generateCharacterThumbUrl(character.look, character.seed);

    renderChatHistory(character);

    // First message from character
    if (!chatHistories[character.name] || chatHistories[character.name].length === 0) {
        chatHistories[character.name] = [];
        showTyping(true);
        await generateCharacterReply(character,
            `[System: You just matched with ${userName} on MatchMingle. Send your very first message to them. Be natural and in-character. Keep it short and fun.]`
        );
        showTyping(false);
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

    appendMessage(text, "sent");

    showTyping(true);
    const delay = 1000 + Math.random() * 2000;
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
