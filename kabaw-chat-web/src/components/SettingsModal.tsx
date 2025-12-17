import { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  connected: boolean;
  username: string;
  channel: string;
  onConnect: (username: string, channel: string) => void;
  onDisconnect: () => void;
  onClose: () => void;
}

function SettingsModal({
  isOpen,
  connected,
  username,
  channel,
  onConnect,
  onDisconnect,
  onClose,
}: SettingsModalProps) {
  const [tempUsername, setTempUsername] = useState(username);
  const [tempChannel, setTempChannel] = useState(channel);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-80 space-y-4 relative">
        <h2 className="text-lg font-semibold">Connection Settings</h2>

        <div>
          <label htmlFor="usernameInput" className="text-sm text-gray-300">
            Username
          </label>
          <input
            id="usernameInput"
            className="w-full mt-1 p-2 bg-gray-700 rounded outline-none"
            value={tempUsername}
            onChange={(e) => setTempUsername(e.target.value)}
            disabled={connected}
          />
        </div>

        <div>
          <label htmlFor="channelInput" className="text-sm text-gray-300">
            Channel
          </label>
          <input
            id="channelInput"
            className="w-full mt-1 p-2 bg-gray-700 rounded outline-none"
            value={tempChannel}
            onChange={(e) => setTempChannel(e.target.value)}
            disabled={connected}
          />
        </div>

        <div className="space-y-2">
          <div className="w-full">
            {!connected ? (
              <button
                className="w-full px-3 py-2 rounded text-white bg-green-700 hover:bg-green-800"
                onClick={() => onConnect(tempUsername, tempChannel)}
              >
                Connect
              </button>
            ) : (
              <button
                className="w-full px-3 py-2 rounded text-white bg-red-800 hover:bg-red-900"
                onClick={onDisconnect}
              >
                Disconnect
              </button>
            )}
          </div>

          <div className="w-full">
            <button
              className="w-full px-3 py-2 rounded text-white bg-gray-600 hover:bg-gray-700"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
