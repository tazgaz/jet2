import React, { useState, useEffect } from 'react';
import { VOCABULARY_LIST } from '../constants';
import { Trophy, RefreshCw, Volume2 } from 'lucide-react';

interface Card {
  id: number;
  content: string;
  type: 'english' | 'hebrew';
  matchId: string; // The English word acts as the unique ID for the pair
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  // Initialize game
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    // Select 6 random words to keep the game manageable
    const shuffledVocab = [...VOCABULARY_LIST].sort(() => 0.5 - Math.random()).slice(0, 6);
    
    const gameCards: Card[] = [];
    shuffledVocab.forEach((word, index) => {
      // English Card
      gameCards.push({
        id: index * 2,
        content: word.english,
        type: 'english',
        matchId: word.english,
        isFlipped: false,
        isMatched: false,
      });
      // Hebrew Card
      gameCards.push({
        id: index * 2 + 1,
        content: word.hebrew,
        type: 'hebrew',
        matchId: word.english,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle the cards
    setCards(gameCards.sort(() => 0.5 - Math.random()));
    setFlippedCards([]);
    setMatches(0);
    setGameWon(false);
  };

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        // Stop any current speech to avoid overlap
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 1;
        window.speechSynthesis.speak(utterance);
    }
  };

  const handleCardClick = (id: number) => {
    // Prevent clicking if already 2 flipped, or clicking matched/flipped card
    if (flippedCards.length === 2) return;
    
    const clickedCard = cards.find(c => c.id === id);
    if (!clickedCard || clickedCard.isMatched || clickedCard.isFlipped) return;

    // Speak if English
    if (clickedCard.type === 'english') {
        speak(clickedCard.content);
    }

    // Flip the card
    const newCards = cards.map(card => 
      card.id === id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    // Check for match
    if (newFlipped.length === 2) {
      const card1 = newCards.find(c => c.id === newFlipped[0]);
      const card2 = newCards.find(c => c.id === newFlipped[1]);

      if (card1 && card2 && card1.matchId === card2.matchId) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === card1.id || c.id === card2.id 
              ? { ...c, isMatched: true, isFlipped: true } 
              : c
          ));
          setFlippedCards([]);
          setMatches(prev => {
            const newMatches = prev + 1;
            if (newMatches === 6) setGameWon(true);
            return newMatches;
          });
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === newFlipped[0] || c.id === newFlipped[1] 
              ? { ...c, isFlipped: false } 
              : c
          ));
          setFlippedCards([]);
        }, 1200);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between w-full mb-6">
        <h2 className="text-3xl font-display font-bold text-purple-600">משחק הזיכרון</h2>
        <button 
          onClick={startNewGame}
          className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 font-bold"
        >
          <RefreshCw size={20} />
          משחק חדש
        </button>
      </div>

      {gameWon ? (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-xl border-4 border-yellow-400 animate-bounce-in">
          <Trophy size={64} className="text-yellow-400 mb-4" />
          <h3 className="text-3xl font-bold text-slate-800 mb-2">כל הכבוד!</h3>
          <p className="text-slate-600 mb-6">סיימת את כל הזוגות!</p>
          <button 
            onClick={startNewGame}
            className="px-8 py-3 bg-purple-600 text-white rounded-full font-bold text-lg hover:bg-purple-700 shadow-lg"
          >
            שחק שוב
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 w-full">
          {cards.map(card => (
            <div 
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square relative cursor-pointer perspective-1000 ${card.isMatched ? 'opacity-0 pointer-events-none transition-opacity duration-500' : ''}`}
            >
               <div className={`w-full h-full transition-all duration-500 transform-style-3d ${card.isFlipped ? 'rotate-y-180' : ''}`}>
                 {/* Back of Card (Face down) */}
                 <div className="absolute w-full h-full bg-purple-500 rounded-xl shadow-md backface-hidden flex items-center justify-center border-b-4 border-purple-700">
                    <span className="text-white text-2xl font-bold">?</span>
                 </div>
                 {/* Front of Card (Face up) */}
                 <div className={`absolute w-full h-full bg-white rounded-xl shadow-md backface-hidden rotate-y-180 flex flex-col items-center justify-center p-2 text-center border-b-4 ${card.type === 'english' ? 'border-sky-400' : 'border-orange-400'}`}>
                    <span className={`font-bold text-slate-800 leading-tight select-none ${card.content.length > 8 ? 'text-sm' : 'text-lg'}`}>
                      {card.content}
                    </span>
                    {card.type === 'english' && (
                        <Volume2 size={16} className="text-sky-400 mt-1 opacity-50" />
                    )}
                 </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryGame;