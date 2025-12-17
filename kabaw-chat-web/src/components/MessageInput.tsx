import { useState } from 'react';

interface Props {
  onSend: (msg: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: Props) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="flex p-4 bg-gray-800 border-t border-gray-700 gap-2">
      <input
        id="messageInput"
        className="flex-1 p-2 rounded bg-gray-700 text-white outline-none"
        placeholder="Aa"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        disabled={disabled}
      />
      <button
        onClick={handleSend}
        className={`transition px-4 py-2 rounded ${disabled ? 'bg-blue-900' : 'bg-blue-700 hover:bg-blue-500'}`}
        disabled={disabled}
      >
        Send
      </button>
    </div>
  );
}
