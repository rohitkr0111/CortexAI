# ⚡ Cortex AI — Autonomous Multi-Agent Intelligence Platform

> Production-grade autonomous multi-agent platform orchestrated with **LangGraph**, real-time **Tavily Web Search**, **Vector RAG Document Intelligence**, and interactive **Monaco Code Sandboxes** with responsive device previews.

---

## 🏛️ Architecture & System Design

```
                                  ┌───────────────────────────────┐
                                  │      User Prompt & Upload     │
                                  └───────────────┬───────────────┘
                                                  │
                                                  ▼
                                    [ Express API Gateway ]
                                  (JWT Auth, Quota, Multer)
                                                  │
                                                  ▼
                                ┌───────────────────────────────────┐
                                │     LangGraph State Machine       │
                                │       (Supervisor Router)         │
                                └───┬───────┬───────┬───────┬───────┘
                                    │       │       │       │
             ┌──────────────────────┘       │       │       └──────────────────────┐
             ▼                              ▼       ▼                              ▼
    [ Coding Agent ]                [ Tavily Search ] [ PDF Vector RAG ]   [ Vision & PPT ]
   (Monaco Artifacts)              (Live Web Index) (Pinecone Embeddings)   (OCR & Decks)
             │                              │       │                              │
             └──────────────────────┬───────┴───────┴──────────────────────────────┘
                                    │
                                    ▼
                         [ Shared State & Memory ]
                          (Redis Cache + MongoDB)
                                    │
                                    ▼
                        [ Client Runtime UI ]
                (Monaco IDE + Responsive Live Sandbox)
```

---

## 🚀 Key Engineering Features

- **Autonomous Supervisor Routing**: Intelligent intent classification routes complex queries across 7 specialized sub-agents:
  - 💻 **Coding Agent**: Multi-file artifact generation (HTML, CSS, JS, Python) with Monaco Editor.
  - 🌐 **Web Search Agent**: Grounded live internet queries powered by Tavily API.
  - 📄 **Document RAG Agent**: Semantic chunking and vector similarity retrieval for PDFs.
  - 📊 **Presentation Engine**: Executive slide deck outline generation.
  - 👁️ **Vision Studio**: Multimodal OCR and UI diagram inspection.
  - 💬 **Chain-of-Thought Chat**: Persistent conversational context via Redis.
- **Monaco Code Sandbox & Responsive Viewports**:
  - Live iframe sandbox supporting HTML5, CSS3, and JavaScript execution.
  - Instant viewport switching: **Desktop** (100%), **Tablet** (768px), and **Mobile** (375px).
  - Code syntax detection, multi-file tab switching, and direct file export.
- **Live Agent Telemetry & Reasoning Trace**:
  - Real-time pipeline step visualizer (`Analyzing Intent` &rarr; `Routing` &rarr; `Tool Invocation` &rarr; `Synthesis`).
  - Monospace latency timers and operational health indicators.
- **Obsidian & Platinum Design System**:
  - Zero neon or cliché gradients. Built with crisp `#090a0d` obsidian surfaces, hairline borders (`border-white/[0.08]`), `Plus Jakarta Sans`, and `JetBrains Mono`.
- **Integrated SaaS Billing**:
  - Quota tracking with real-time credit progress bars and Razorpay checkout.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Motion (Framer Motion), Monaco Editor, Lucide Icons |
| **State Management** | Redux Toolkit, React-Redux |
| **Orchestration** | LangGraph, LangChain, Node.js Microservices |
| **Storage & Cache** | Redis, MongoDB, AWS S3, Vector DB |
| **APIs** | Tavily Web Search, Razorpay, Firebase Auth |

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```

