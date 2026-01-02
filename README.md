# ⚡ Command Pilot

> **Your AI-powered terminal copilot.** Speak naturally, execute perfectly. One request, one command, zero friction.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18.x-61dafb)](https://reactjs.org/)

---

## 💡 The Problem

Developers waste **countless hours** searching for the right CLI command:
- 🔍 Googling syntax across different operating systems
- 📚 Checking documentation for package managers
- 🔄 Context-switching between browser and terminal
- 🤔 Remembering flags and options

## ✨ The Solution

**Command Pilot eliminates the search.** Just describe what you need—get the perfect command instantly.

```bash
You think: "I need to install Docker"

Linux   → sudo apt-get update && sudo apt-get install docker.io -y
macOS   → brew install --cask docker
Windows → winget install Docker.DockerDesktop
```

**One input. Platform-perfect output. Every time.**

---

## 🎯 Core Features

### 🤖 **AI-Powered Command Generation**
Advanced language models understand your intent and generate production-ready commands. No more guessing, no more Stack Overflow deep dives.

### 🌍 **Automatic OS Detection**
Command Pilot **intelligently detects your operating system** and delivers the optimized command for your exact environment:
- **Linux**: Recognizes apt, yum, dnf, pacman and more
- **macOS**: Leverages Homebrew, MacPorts, native tools
- **Windows**: Uses winget, chocolatey, PowerShell commands

**You never specify your OS—Command Pilot just knows.**

### ⚡ **Optimized for Speed**
Millisecond response times. Zero configuration. Maximum productivity.

### 💾 **Smart Command History**
Never lose a working command again. Your personal command library syncs across sessions:
- 🔖 Save frequently used commands
- 🔍 Search through your history
- ♻️ Reuse with one click
- 🗑️ Clean up when needed

### 🎨 **Beautiful, Minimal Interface**
A distraction-free UI that stays out of your way. Built as a lightweight extension-style client that integrates seamlessly into your workflow.

### 🔐 **Privacy-First Design**
- Guest mode: Try instantly without registration
- Authenticated mode: Secure JWT-based sessions
- Your commands, your data, your control

---

## 🚀 See It In Action

### **Natural Language → Perfect Command**

| What You Type | Command Pilot Returns |
|--------------|---------------------|
| *"install postgres"* | **Linux:** `sudo apt-get install postgresql postgresql-contrib` |
| *"create react app"* | **All:** `npx create-react-app my-app` |
| *"check disk space"* | **Linux:** `df -h` **macOS:** `df -h` **Windows:** `Get-PSDrive` |
| *"find large files"* | **Linux/macOS:** `find . -type f -size +100M` |
| *"setup python env"* | **All:** `python -m venv venv && source venv/bin/activate` |

### **Cross-Platform Intelligence**

Command Pilot doesn't just return *a* command—it returns the **right** command for your system:

```
Request: "install nginx"

🐧 Ubuntu/Debian    → sudo apt-get install nginx
🎩 RHEL/CentOS      → sudo yum install nginx  
🍎 macOS            → brew install nginx
🪟 Windows          → winget install nginx
```

**Automatic. Intelligent. Platform-aware.**

---

## 🏗️ Architecture

Built with cutting-edge technology for reliability and performance:

```
┌──────────────────────────────────┐
│   🎨 React Frontend (Vite)       │
│   Lightweight Extension UI       │
└────────────┬─────────────────────┘
             │
        ┌────▼─────┐
        │ REST API │
        └────┬─────┘
             │
┌────────────▼─────────────────────┐
│   ⚡ Express Backend              │
│   • OS Detection Engine          │
│   • Command Optimization         │
│   • User Management              │
└────┬──────────────────┬──────────┘
     │                  │
┌────▼─────┐       ┌────▼──────┐
│ MongoDB  │       │  🤖 LLM   │
│ Storage  │       │  Engine   │
└──────────┘       └───────────┘
```

**Powered by:**
- **Backend:** Node.js + Express for blazing-fast API responses
- **Frontend:** React 18 + Vite for instant UI updates
- **Database:** MongoDB for flexible command storage
- **AI:** OpenAI/OpenRouter for intelligent command generation
- **Security:** JWT authentication with HTTP-only cookies

---

## 🚀 Quick Start

### Prerequisites
```bash
✓ Node.js 16 or higher
✓ MongoDB instance (local or cloud)
✓ LLM API key (OpenAI/OpenRouter)
```

### Setup in 3 Minutes

**1️⃣ Clone the Repository**
```bash
git clone https://github.com/yourusername/command-pilot.git
cd command-pilot
```

**2️⃣ Configure Environment**

Create `server/.env`:
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/command-pilot
OPENROUTER_API_KEY=your_api_key_here
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

**3️⃣ Launch Backend**
```bash
cd server
npm install
npm start
```
✅ **Backend live at http://localhost:4000**

**4️⃣ Launch Frontend**
```bash
cd cli-client/cli-extension
npm install
npm run dev
```
✅ **Client live at http://localhost:5173**

**That's it!** Start generating commands instantly. 🎉

---

## 🎯 Who Uses Command Pilot?

### 👨‍💻 **Developers**
*"I stopped memorizing package manager syntax. Command Pilot handles it."*
- Quickly set up new projects
- Install dependencies across different environments
- Focus on coding, not command syntax

### 🛠️ **DevOps Engineers**
*"Managing 50+ servers? Command Pilot knows every distro's quirks."*
- Deploy across multiple Linux distributions
- Automate server configurations
- Reduce human error in production

### 🎓 **Students & Learners**
*"Learning the terminal without the frustration."*
- Discover new CLI tools naturally
- Build confidence with commands
- Learn by doing, not memorizing

### 🚀 **Productivity Enthusiasts**
*"My terminal just got 10x faster."*
- Eliminate context switching
- Build a personal command library
- Work at the speed of thought

---

## 🛣️ Roadmap

### 🎯 **Coming Soon**
- **Smart Distro Detection** - Detect Ubuntu vs Debian vs Arch vs Fedora
- **Command Explanations** - Understand what each flag does
- **Multi-Command Workflows** - Chain complex operations
- **Shell Aliases Generation** - Create shortcuts from commands

### 🔮 **Future Vision**
- **Native CLI Tool** - Use Command Pilot offline from your terminal
- **IDE Integration** - VS Code, JetBrains plugins
- **Team Workspaces** - Share command libraries with your team
- **Command Analytics** - Track usage and optimize workflows
- **Voice Input** - Speak your commands (experimental)

---

## 📊 Why Command Pilot Wins

| Feature | Command Pilot | Stack Overflow | Manual Docs |
|---------|--------------|----------------|-------------|
| **Speed** | ⚡ Instant | 🐌 Minutes of searching | 🐌 Page scanning |
| **Accuracy** | ✅ Platform-optimized | ⚠️ Multiple conflicting answers | ✅ Accurate but dense |
| **Ease** | 🎯 Natural language | 📚 Technical jargon | 📚 Technical jargon |
| **History** | 💾 Saved automatically | ❌ None | ❌ None |
| **Learning** | 🧠 Context-aware | 🔀 Fragmented | 📖 Linear |

---

## 🔒 Security & Privacy

Command Pilot takes security seriously:

- 🔐 **Secure Authentication** - JWT tokens with HTTP-only cookies
- 🔑 **Password Protection** - Industry-standard bcrypt hashing
- ✅ **Input Validation** - All inputs sanitized and validated
- 🚫 **No Command Execution** - We generate, you review and execute
- 🔒 **Environment Variables** - Secrets never committed to code

**Security issue?** Contact: security@commandpilot.dev

---

## 🤝 Contributing

We'd love your help making Command Pilot better!

**Ways to Contribute:**
- 🐛 Report bugs and edge cases
- 💡 Suggest new features
- 📝 Improve documentation
- 🎨 Enhance the UI/UX
- 🧪 Add test coverage

**Getting Started:**
1. Fork the repo
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Check out [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📂 Project Structure

```
command-pilot/
│
├── 🖥️  server/                  # Backend API & Logic
│   ├── controllers/           # Business logic
│   ├── models/               # MongoDB schemas
│   ├── routes/              # API endpoints
│   ├── middleware/          # Auth & validation
│   └── index.js            # Server entry point
│
├── 🎨 cli-client/
│   └── cli-extension/       # Frontend Application
│       ├── src/
│       │   ├── components/  # React components
│       │   ├── services/    # API integration
│       │   └── App.jsx     # Main application
│       └── vite.config.js
│
└── 📚 docs/                  # Documentation
```

---

## 🌟 Show Your Support

If Command Pilot saves you time and keystrokes:

- ⭐ **Star this repository** - Help others discover it
- 🐦 **Share on Twitter** - Spread the word
- 🐛 **Report issues** - Help us improve
- 💬 **Join discussions** - Share your ideas

Every star motivates us to build better tools for developers! ✨

---

## 📬 Connect With Us

- 📖 **Documentation:** [docs.commandpilot.dev](https://docs.commandpilot.dev)
- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/yourusername/command-pilot/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/yourusername/command-pilot/discussions)
- 🐦 **Twitter:** [@CommandPilot](https://twitter.com/commandpilot)
- 📧 **Email:** hello@commandpilot.dev

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

Free to use, modify, and distribute. Build something awesome! 🚀

---

<p align="center">
  <img src="https://img.shields.io/badge/Made%20with-❤️-red.svg" alt="Made with love"/>
  <img src="https://img.shields.io/badge/Powered%20by-AI-blue.svg" alt="Powered by AI"/>
  <img src="https://img.shields.io/badge/Built%20for-Developers-green.svg" alt="Built for Developers"/>
</p>

<p align="center">
  <strong>Stop searching. Start executing.</strong>
  <br>
  <sub>The command line just got smarter.</sub>
</p>

<p align="center">
  <a href="#-quick-start">🚀 Get Started</a> •
  <a href="#-roadmap">🛣️ Roadmap</a> •
  <a href="#-contributing">🤝 Contribute</a>
</p>
