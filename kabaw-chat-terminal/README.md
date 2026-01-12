# Kabaw Chat Terminal

A terminal-based, real-time chat application built with Rust, Tokio, Cursive and WebSockets, allowing users to connect to chat channels, send and receive messages, and manage their connection settings.

## How to Run the App

Follow the steps below to set up and run the application:

### Prerequisites

- **Rust** ≥ 1.75
   - Includes `cargo`

### Steps

1. **Clone the Repository**

   Clone the repository to your local machine using the following command:

   ```bash
   git clone https://github.com/your-username/kabaw-chat-terminal.git

   ```

2. **Navigate to the Project Directory**
   
   ```bash
   cd kabaw-chat-terminal
   npm install
   ```

3. **Build the Project**

   ```bash
   cargo build
   ```

4. **Run the Application**

   ```bash
   cargo run
   ```

---

### WebSocket Server

This app relies on a WebSocket server running at `ws://localhost:8080/ws`. Ensure that you have a WebSocket server running and configured to handle connections and messages.

## Usage

Once the app is running:

1. **Login Screen**: 
   - Enter your **username**
   - Enter the **channel**
   - Press **Connect**
2. **Chat Interface**: 
   - The messages are displayed in real-time.
   - Your messages are visually distinguished from others
3. **Send Messages**: 
   - Once connected, you can send messages to the chat channel.
   - Type your messages and press **Enter** to send
4. **Logout**: 
   - You can disconnect from the channel and return to login at any time by entering the `/logout` command
5. **Change Details**: 
   - If you want to change your **username** or **channel**, you must first logout. 
   - Once disconnected, you can enter the details in the login screen and reconnect with the new configuration.

---

## Keyboard Shortcuts and Commands

You can control the app using the following Keyboard Shortcuts:

- **Enter** - Send message
- **ESC** - Quit application

You can control the app using the following commands: 

| Command    | Description                             |
| ---------- | --------------------------------------- |
| `/help`    | Show available commands                 |
| `/clear`   | Clear the message history               |
| `/logout`  | Disconnect and return to login          |
| `/quit`    | Exit the application                    |
