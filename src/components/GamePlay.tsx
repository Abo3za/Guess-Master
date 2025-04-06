export const GamePlay: React.FC<GamePlayProps> = ({ onBack }) => {
  const { 
    currentItem, 
    teams, 
    activeTeam, 
    makeGuess, 
    nextTurn, 
    revealDetail, 
    revealAnswer,
    adjustScore
  } = useGameStore();
  const [guess, setGuess] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  const handleGuess = () => {
    if (!guess.trim()) return;

    const correct = makeGuess(activeTeam.id, guess);
    setIsCorrect(correct);
    setNotificationMessage(
      correct ? 'إجابة صحيحة! 🎉' : 'إجابة خاطئة! حاول مرة أخرى'
    );
    setShowNotification(true);

    if (correct) {
      setTimeout(() => {
        setGuess('');
        nextTurn();
        onBack();
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  if (!currentItem) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="secondary-button"
            >
              <ArrowLeft className="w-5 h-5" />
              العودة
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {currentItem.category}
            </h1>
          </div>
          
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              دور {activeTeam.name}
            </h2>
            <p className="text-gray-300 text-sm sm:text-base">
              النقاط: {activeTeam.score}
            </p>
          </div>
        </div>

        {/* Game Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image and Details */}
          <div className="space-y-6">
            {/* Image */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800">
              {currentItem.image ? (
                <img
                  src={currentItem.image}
                  alt={currentItem.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentItem.details.map((detail, index) => (
                <button
                  key={index}
                  onClick={() => !detail.revealed && revealDetail(index)}
                  className={`detail-card ${detail.revealed ? 'revealed' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    {detail.revealed ? (
                      <>
                        <span className="text-gray-300">{detail.label}:</span>
                        <span className="font-semibold">{detail.value}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-400">؟</span>
                        <span className="text-gray-400">اضغط للكشف</span>
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Teams and Input */}
          <div className="space-y-6">
            {/* Teams List */}
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-3">الفرق</h3>
              <div className="space-y-2">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    className={`flex justify-between items-center p-2 rounded-lg ${
                      team.isActive ? 'bg-blue-500/20' : 'bg-gray-700/50'
                    }`}
                  >
                    <span className="font-medium">{team.name}</span>
                    <span className="text-gray-300">{team.score} نقطة</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guess Input */}
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="اكتب إجابتك هنا..."
                  className="input-field"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleGuess}
                    className="primary-button flex-1"
                  >
                    <Check className="w-5 h-5" />
                    تأكيد
                  </button>
                  <button
                    onClick={revealAnswer}
                    className="secondary-button"
                  >
                    <Eye className="w-5 h-5" />
                    كشف الإجابة
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
          <div
            className={`px-6 py-3 rounded-lg shadow-lg ${
              isCorrect ? 'bg-green-500/90' : 'bg-red-500/90'
            }`}
          >
            <p className="text-white font-medium">{notificationMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}; 