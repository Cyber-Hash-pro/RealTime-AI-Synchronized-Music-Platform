import { useState, useEffect, useRef } from 'react';
import { useTunePalSocket } from '../services/tunePalSocket';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const TunePal = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userData);

  const { socket, connect, disconnect, sendMessage } = useTunePalSocket();

  useEffect(() => {
    // Check if user is logged in
   

    // Connect to TunePal socket
    connect();

    return () => {
      disconnect();
    };
  }, [user, navigate]);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      setIsConnected(true);
      console.log('Connected to TunePal');
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.log('Disconnected from TunePal');
    };

    const handleAIResponse = (data) => {
      console.log('AI Response:', data);
      setIsTyping(false);
      
      // Extract the actual message content from the response
      let messageContent = '';
      
      if (data.message && data.message.messages && Array.isArray(data.message.messages)) {
        const lastMessage = data.message.messages[data.message.messages.length - 1];
        if (lastMessage && lastMessage.content) {
          messageContent = lastMessage.content;
        }
      } else if (typeof data.message === 'string') {
        messageContent = data.message;
      } else {
        messageContent = JSON.stringify(data.message, null, 2);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: messageContent,
          timestamp: new Date(),
        },
      ]);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('ai-response', handleAIResponse);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('ai-response', handleAIResponse);
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !isConnected) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    sendMessage(input);
    setInput('');
  };

  const formatMessage = (content) => {
    // Try to parse if it looks like JSON
    try {
      if (content.startsWith('{') || content.startsWith('[')) {
        const parsed = JSON.parse(content);
        return <pre className="bg-gray-800 p-3 rounded overflow-x-auto text-sm">{JSON.stringify(parsed, null, 2)}</pre>;
      }
    } catch (e) {
      // Not JSON, return as is
    }
    
    // Split by newlines and render
    return content.split('\n').map((line, i) => (
      <p key={i} className="mb-1">
        {line}
      </p>
    ));
  };

  const quickActions = [
    { label: '🎵 Play a song', prompt: 'Play me a song' },
    { label: '😊 Happy mood', prompt: 'Create a happy mood playlist with 5 songs' },
    { label: '😢 Sad mood', prompt: 'I am feeling sad, recommend me some songs' },
    { label: '💪 Workout', prompt: 'Create a gym workout playlist' },
    { label: '💝 Romantic', prompt: 'Give me romantic songs' },
    { label: 'ℹ️ Song details', prompt: 'Tell me about the song' },
  ];

  const handleQuickAction = (prompt) => {
    setInput(prompt);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-purple-500/30 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-2xl">🎵</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">TunePal AI</h1>
              <p className="text-xs text-gray-400">
                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-4xl">🎵</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to TunePal!</h2>
              <p className="text-gray-400 mb-6">
                Your AI-powered music assistant. Ask me to play songs, create playlists, or recommend music!
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-2xl mx-auto">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAction(action.prompt)}
                    className="bg-purple-500/20 hover:bg-purple-500/30 text-white px-4 py-2 rounded-lg text-sm transition"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-gray-800 text-gray-100'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xl">
                    {message.role === 'user' ? '👤' : '🤖'}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold mb-1">
                      {message.role === 'user' ? 'You' : 'TunePal'}
                    </div>
                    <div className="text-sm">{formatMessage(message.content)}</div>
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-800 rounded-2xl p-4 max-w-[80%]">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🤖</span>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-black/50 backdrop-blur-sm border-t border-purple-500/30 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isConnected ? "Ask TunePal anything..." : "Connecting..."}
              disabled={!isConnected}
              className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || !isConnected}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
          {messages.length > 0 && (
            <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
              {quickActions.slice(0, 4).map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TunePal;
