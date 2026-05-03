# CivicAI - Your Guide to the Election Process 🗳️

Welcome to **CivicAI**, a smart, dynamic assistant built to educate citizens on the election process. CivicAI aims to make democracy accessible by guiding first-time voters and general citizens through the complexities of voting without political bias.

## 🎯 Chosen Vertical
**Election Process Education**

## 💡 Approach and Logic
CivicAI is designed to be an objective, factual, and highly accessible conversational AI.
The logic centers around an AI model specifically instructed (via system prompts) to:
- Remain strictly neutral and objective.
- Avoid political opinions, candidate endorsements, or partisan debates.
- Focus entirely on the **process**: how to register, how to find polling stations, understanding the ballot, and the mechanics of vote counting.

By leveraging **Google's Gemini API**, CivicAI provides real-time, dynamic responses to user questions. It breaks down complex civic procedures into digestible, easy-to-understand information using Markdown formatting.

## ⚙️ How the Solution Works
1. **Frontend Architecture**: Built with React and Vite for a lightning-fast, highly responsive user interface.
2. **Dynamic UI/UX**: Features a sleek, modern dark mode with glassmorphism effects, ensuring the app feels like a premium assistant.
3. **Google Services Integration**: Utilizes the `@google/generative-ai` SDK. Users enter their Gemini API key securely in the browser, which is stored in `localStorage`. 
4. **Interactive Voter Journey**: A persistent checklist in the sidebar helps users track their civic readiness (from registration to casting their ballot), rewarding them with a celebration animation (`canvas-confetti`) upon completion.
5. **Contextual Chat**: The app maintains chat history in the state and passes it to the Gemini model to allow follow-up questions and contextual learning.
6. **Quick Prompts**: Built-in prompts help users get started immediately with common questions like "How do I register to vote?" or "Explain the ballot counting process."
7. **Accessibility Focus**: Fully implemented semantic ARIA labels for screen readers.

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- A Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation
1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the local server
4. Open the app in your browser and enter your Gemini API key when prompted.

## 🤔 Assumptions Made
- Users have access to a web browser and an internet connection.
- The user is seeking general procedural information rather than specific legal advice for extremely localized edge cases (though the AI can handle many local questions if asked specifically).
- The Gemini API is available and the user can generate a free API key via Google AI Studio.
- All state is managed locally in the browser to ensure user privacy (the API key and chat logs are not stored on any external server other than being processed by Google's API).

## 🛠️ Technology Stack
- **Core**: React (Vite), JavaScript
- **Styling**: Vanilla CSS with modern variables and animations
- **AI Integration**: Google Gemini API (`@google/generative-ai`)
- **Icons & Markdown**: `lucide-react`, `react-markdown`

---
*Built for the Antigravity Hackathon Challenge.*
