const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-gray-800 rounded-2xl p-4 max-w-[80%]">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></span>
            <span
              className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: '0.1s' }}
            ></span>
            <span
              className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            ></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
