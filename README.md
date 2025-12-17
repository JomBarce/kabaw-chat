# Kabaw Chat

Real-time chat application built with:

* **React + Vite + TypeScript** (client)
* **Go WebSocket server** (backend)

Both services are managed from the root project.

---

## Project Structure

```text
kabaw-chat/
│
├── kabaw-chat-web/      # React client
├── kabaw-sockets/       # Go WebSocket server
├── package.json         # Root scripts
└── README.md
```

---

## Prerequisites

* **Node.js** ≥ 18
* **npm** ≥ 8
* **Go** ≥ 1.21

---

## Getting Started

### 1 Install Dependencies

From the project root:

```bash
npm install
```

Install client dependencies:

```bash
cd kabaw-chat-web
npm install
cd ..
```

Install Go dependencies:

```bash
cd kabaw-sockets
go mod tidy
cd ..
```

---

### 2 Start Everything (Recommended)

From the **project root**:

```bash
npm run dev
```

This starts:

* React client (Vite)
* Go WebSocket server on `:8080`

Stop both with **Ctrl + C**.

---

### 3 Run Services Individually (Optional)

From the **project root**:

```bash
npm run dev:client   # React client only
npm run dev:ws       # Go WebSocket server only
```


---

## Local URLs

| Service   | URL                                                          |
| --------- | ------------------------------------------------------------ |
| Client    | [http://localhost:3000](http://localhost:3000)               |
| WebSocket | ws://localhost:8080/ws                                       |
| Health    | [http://localhost:8080/health](http://localhost:8080/health) |

---

## WebSocket Connection

```text
ws://localhost:8080/ws?username=YourName&channel=general
```

---

## Subprojects

* **Client** → `kabaw-chat-web/`
* **WebSocket Server** → `kabaw-sockets/`

Each folder contains its own README for deeper details.

---

### Setup & Run

**Copy & paste to install all dependencies and start the app:**

```bash
npm install \
&& cd kabaw-chat-web && npm install && cd .. \
&& cd kabaw-sockets && go mod tidy && cd .. \
&& npm run dev
```

---
