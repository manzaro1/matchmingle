# MatchMingle - AI Dating Simulator 💕

![MatchMingle](https://img.shields.io/badge/AI-Pollinations-ff6b6b?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Web-4ecdc4?style=for-the-badge)

An AI-powered dating simulator that lets you swipe, match, and chat with unique AI characters. Built with vanilla JavaScript and powered by Pollinations AI.

## ✨ Features

- **Smart Swiping** - Tinder-style card swiping interface
- **AI-Generated Characters** - Each profile features unique AI-generated profile photos using Pollinations AI
- **Real-time Chat** - Have conversations with your matches using Pollinations text AI
- **Match System** - When you and an AI character like each other, it's a match!
- **8 Unique Characters** - Each with distinct personalities, bios, and tags
- **Persistent Matches** - Your matches are saved in localStorage

## 🎨 Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **AI Integration**: Pollinations AI (Free, Open Source)
  - Image Generation: Flux Schnell model for profile photos
  - Text Generation: AI chat completions for conversations

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone https://github.com/manzaro1/matchmingle.git
cd matchmingle
```

2. Open `index.html` in your browser

3. Start swiping!

## 📁 Project Structure

```
matchmingle/
├── index.html     # Main HTML structure
├── styles.css     # Styling and animations
├── app.js         # Core application logic
├── tinder.txt     # Character data and prompts
└── README.md      # This file
```

## 🤖 How It Works

### Character Generation
Each dating profile is generated using Pollinations AI image API:
- Uses Flux Schnell model for fast image generation
- Prompts describe the character's appearance, style, and personality
- Images are cached for consistent experience

### Chat System
Conversations are powered by Pollinations text AI:
- Each character has a unique system prompt defining their personality
- Chat history is maintained per conversation
- Typing indicators provide realistic feedback

## 🎯 Characters

The app includes 8 unique AI characters:
1. **Nexus** - Mysterious and intellectual
2. **Luna** - Creative free spirit
3. **Phoenix** - Ambitious entrepreneur
4. **Maya** - Kind-hearted healer
5. **Alex** - Adventure seeker
6. **Jordan** - Calm philosopher
7. **Riley** - Fun-loving explorer
8. **Sam** - Athletic and outdoorsy

## 🔗 Live Demo

Try the live version at: **https://manzaro1.github.io/matchmingle**

## 👤 Developer

**Charles Levison**
- GitHub: [@manzaro1](https://github.com/manzaro1)
- LinkedIn: [Charles Levison](https://linkedin.com/in/charles-levison-65386a281)
- Location: Lilongwe, Malawi 🇲🇼

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [Pollinations AI](https://pollinations.ai) - For providing free, open-source AI capabilities
- All the open-source libraries used in this project

---

*Made with 💕 and AI*
