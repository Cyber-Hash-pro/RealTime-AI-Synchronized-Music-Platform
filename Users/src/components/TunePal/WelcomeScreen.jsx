const WelcomeScreen = ({ onActionClick }) => {
  const quickActions = [
    { label: '🎵 Play a song', prompt: 'Play me a song' },
    { label: '😊 Happy mood', prompt: 'Create a happy mood playlist with 5 songs' },
    { label: '😢 Sad mood', prompt: 'I am feeling sad, recommend me some songs' },
    { label: '💪 Workout', prompt: 'Create a gym workout playlist' },
    { label: '💝 Romantic', prompt: 'Give me romantic songs' },
    { label: 'ℹ️ Song details', prompt: 'Tell me about the song' },
  ];

  return (
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
            onClick={() => onActionClick(action.prompt)}
            className="bg-purple-500/20 hover:bg-purple-500/30 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;
