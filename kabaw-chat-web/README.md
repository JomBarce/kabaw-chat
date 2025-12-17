# Kabaw Chat Web

A real-time chat application built with React and WebSockets, allowing users to connect to chat channels, send messages, and manage their connection settings.

## How to Run the App

Follow the steps below to set up and run the application:

### Prerequisites

- Node.js (>= v18.0.0)
- npm (>= v8.0.0) or yarn (>= v1.22)

### Steps

1. **Clone the Repository**

   Clone the repository to your local machine using the following command:

   ```bash
   git clone https://github.com/your-username/kabaw-chat-web.git

   ```

2. **Install Dependencies**

   Navigate to the project directory and install the dependencies:

   ```bash
   cd kabaw-chat-web
   npm install
   ```

   or if you are using yarn:

   ```bash
   yarn install
   ```

3. **Run the Development Server**

   To start the app in development mode, use the following command:

   ```bash
   npm run dev
   ```

   or if you're using yarn:

   ```bash
   yarn dev
   ```

   This will start the Vite development server, and the app will be available at [http://localhost:3000](http://localhost:3000).

4. **Preview the App (Optional)**

   If you want to preview the app after building it, run:

   ```bash
   npm run preview
   ```

   or with yarn:

   ```bash
   yarn preview
   ```

5. **Build the App for Production (Optional)**

   To build the app for production, run the following command:

   ```bash
   npm run build
   ```

   or with yarn:

   ```bash
   yarn build
   ```

   This will generate optimized production-ready files in the `/dist` directory.

### WebSocket Server

This app relies on a WebSocket server running at `ws://localhost:8080/ws`. Ensure that you have a WebSocket server running and configured to handle connections and messages.

### Linting and Formatting

The project includes linting and formatting tools for code quality:

- **Lint**: To lint the project files, use:

  ```bash
  npm run lint
  ```

  or with yarn:

  ```bash
  yarn lint
  ```

- **Format**: To format the project files, use:

  ```bash
  npm run format
  ```

  or with yarn:

  ```bash
  yarn format
  ```

## Usage

Once the app is running:

1. **Settings Modal**: Before connecting, you can set your **username** and **channel** via the settings modal.
2. **Connect**: Click the **Connect** button to join the selected chat channel.
3. **Send Messages**: Once connected, you can send messages to the chat channel. The messages will appear in real-time.
4. **Scroll to Bottom**: The chat window will automatically scroll to the bottom whenever a new message is received, unless you've manually scrolled up.
5. **Disconnect**: You can disconnect from the channel at any time by clicking the **Disconnect** button.
6. **Change Settings**: If you want to change your **username** or **channel**, you must first disconnect. Once disconnected, you can modify your settings and reconnect with the new configuration.
