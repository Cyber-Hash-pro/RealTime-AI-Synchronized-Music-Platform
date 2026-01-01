const QuickActions = ({ onActionClick }) => {
  const quickActions = [
    { label: '🎵 Play a song', prompt: 'Play me a song' },
    { label: '😊 Happy mood', prompt: 'Create a happy mood playlist with 5 songs' },
    { label: '😢 Sad mood', prompt: 'I am feeling sad, recommend me some songs' },
    { label: '💪 Workout', prompt: 'Create a gym workout playlist' },
    { label: '💝 Romantic', prompt: 'Give me romantic songs' },
    { label: 'ℹ️ Song details', prompt: 'Tell me about the song' },
  ];

  return (
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
  );
};

export default QuickActions;
