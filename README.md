# 📑 DocuNexus — Advanced RAG Document Intelligence

An AI-powered document research platform that transforms static PDFs into interactive knowledge hubs using Agentic Retrieval-Augmented Generation (RAG).

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white&style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white&style=for-the-badge)
![LangChain](https://img.shields.io/badge/LangChain-black?style=for-the-badge)
![Redis](https://img.shields.io/badge/Redis-D82C20?logo=redis&logoColor=white&style=for-the-badge)
![Tailwind](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)

---

### ▶️ Live Demo
https://docunexusai.vercel.app/

### 💻 Source Code
https://github.com/vikasgautam2003/DocuNexus-Your-AI-PDF-Assistant

---

## 📖 About The Project

DocuNexus is designed to eliminate manual PDF reading and replace it with intelligent, context-aware reasoning.

Instead of keyword search, the platform:

• understands document meaning  
• retrieves semantically relevant chunks  
• verifies answers through multi-step reasoning  
• generates structured insights automatically  

It uses a distributed architecture with asynchronous workers to ensure lightning-fast performance even with large documents.

---

## 🌟 Key Features

- 📑 Agentic RAG with LangGraph reasoning workflows  
- 📊 Automatic executive summaries on upload  
- 😈 Nemesis Mode (critical contradiction detection)  
- 🃏 AI Flashcard generation for study  
- 🌍 Deep Research with web search augmentation  
- ⚡ Celery-based distributed PDF processing  
- 🔍 High-speed Chroma vector retrieval  

---

## 🧠 Architecture

Frontend  
- Next.js 15 (TypeScript)  
- Tailwind CSS + Shadcn/UI  

Backend  
- FastAPI  
- Celery Workers  
- Redis Queue  

AI Stack  
- LangChain  
- LangGraph  
- Google Gemini 2.5 Flash  
- Chroma Cloud  

---

## 📦 Getting Started

### Clone

```bash
git clone https://github.com/vikasgautam2003/DocuNexus-Your-AI-PDF-Assistant.git
cd DocuNexus-Your-AI-PDF-Assistant

Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

Frontend
cd frontend
npm install
npm run dev


Open → http://localhost:3000
