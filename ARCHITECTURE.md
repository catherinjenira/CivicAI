# CivicAI Architectural Documentation 🏛️

## Overview
CivicAI is built on a **Modular Micro-Page Architecture** designed for scalability, performance, and maximum resilience. The application utilizes a hybrid state management system combining local React state with **Firebase Realtime Database** for cloud synchronization.

## 🏗️ Structural Layers

### 1. Presentation Layer (React 18+)
- **Atomic Components**: Reusable UI elements (Buttons, Inputs, Cards).
- **Page Modules**: Specialized views (Dashboard, Assistant, Practice, Resources) isolated for performance.
- **Layout Shell**: A persistent `Sidebar` layout providing global navigation and real-time user status.

### 2. Logic Layer (Custom Hooks & API)
- **AI Engine**: Integrated with **Google Gemini 1.5 Flash**. Uses a specialized "Safe Mode" prompt injection to ensure non-partisan educational responses.
- **Speech Engine**: Leverages the **Web Speech API** for hands-free voice interaction.
- **Sync Engine**: Handles bi-directional synchronization with **Firebase Database**, featuring graceful degradation for offline or restricted environments.

### 3. Persistence Layer (Firebase & LocalStorage)
- **Auth**: Firebase Authentication (Email/Password + Anonymous Demo).
- **Database**: User-scoped data paths (`chats/{uid}`) for secure, multi-tenant data isolation.
- **Cache**: LocalStorage used for persistent API configuration and user preferences.

## 🛡️ Security Posture
- **Environmental Isolation**: All API keys are injected via `Vite` environment variables.
- **CSP (Content Security Policy)**: Implemented via `vercel.json` to prevent XSS and data injection attacks.
- **Transport Security**: Enforced HTTPS with secure header configurations (nosniff, frame-options).

## 🚀 Performance Optimizations
- **Code Splitting**: Routes are managed via `React Router` for efficient bundle delivery.
- **Asset Optimization**: SVG-based iconography (Lucide) and Google Fonts pre-connection.
- **Graceful Fallbacks**: A massive 100+ context mock database ensures the app remains interactive even with zero connectivity.

---
*CivicAI: Engineering Democracy for the Future.*
