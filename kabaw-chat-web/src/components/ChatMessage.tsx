import type { ServerMessage } from '../types/Message';

interface Props {
  message: ServerMessage;
  isOwnMessage?: boolean;
}

function ChatMessage({ message, isOwnMessage }: Props) {
  const baseClasses = 'px-4 py-2 rounded-lg break-words';

  let containerClasses = '';
  let showHeader = false;

  switch (message.type) {
    case 'system':
      containerClasses = 'bg-gray-700 text-gray-300 text-center self-center';
      break;
    case 'message':
      containerClasses = isOwnMessage
        ? 'bg-blue-800 text-white self-end'
        : 'bg-green-800 text-white self-start';
      showHeader = true;
      break;
    case 'user_connected':
      containerClasses = 'bg-purple-600 text-white self-center';
      break;
  }

  return (
    <div className={`${baseClasses} ${containerClasses}`}>
      {showHeader && (
        <div className="text-sm text-gray-400 mb-1">
          {message.username}
          {' ('}
          {message.timestamp
            ? new Date(message.timestamp).toLocaleTimeString()
            : '--:--'}
          {')'}
        </div>
      )}
      <div>{message.content}</div>
    </div>
  );
}

export default ChatMessage;
