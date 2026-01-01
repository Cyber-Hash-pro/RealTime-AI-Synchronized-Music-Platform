const MessageBubble = ({ message, formatMessage }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl p-4 ${
          isUser
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
            : 'bg-gray-800 text-gray-100'
        }`}
      >
        <div className="flex items-start gap-2">
          <span className="text-xl">
            {isUser ? '👤' : '🤖'}
          </span>
          <div className="flex-1">
            <div className="text-sm font-semibold mb-1">
              {isUser ? 'You' : 'TunePal'}
            </div>
            <div className="text-sm">{formatMessage(message.content)}</div>
            <div className="text-xs opacity-70 mt-2">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
