
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";

type MemoryCard = {
  id: number;
  imageUrl: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const cardImages = [
  '/placeholder.svg',
  '/favicon.ico',
];

const MemoryGame = () => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);
  
  const initializeGame = () => {
    // Create pairs of cards with images
    const cardPairs = [...cardImages, ...cardImages].map((image, index) => ({
      id: index,
      imageUrl: image,
      isFlipped: false,
      isMatched: false,
    }));
    
    // Shuffle cards
    const shuffledCards = shuffleArray(cardPairs);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setGameOver(false);
  };
  
  const shuffleArray = (array: MemoryCard[]): MemoryCard[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  const handleCardClick = (id: number) => {
    // Ignore if game is over or card is already flipped/matched
    if (gameOver || cards[id].isFlipped || cards[id].isMatched) return;
    
    // Ignore if already two cards are flipped
    if (flippedCards.length === 2) return;
    
    // Flip the card
    const updatedCards = [...cards];
    updatedCards[id].isFlipped = true;
    setCards(updatedCards);
    
    // Add card to flipped cards
    const updatedFlippedCards = [...flippedCards, id];
    setFlippedCards(updatedFlippedCards);
    
    // Check if we have a pair
    if (updatedFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstCardId, secondCardId] = updatedFlippedCards;
      const firstCard = updatedCards[firstCardId];
      const secondCard = updatedCards[secondCardId];
      
      if (firstCard.imageUrl === secondCard.imageUrl) {
        // Match found
        updatedCards[firstCardId].isMatched = true;
        updatedCards[secondCardId].isMatched = true;
        setCards(updatedCards);
        setFlippedCards([]);
        
        // Check if game is over
        const isGameOver = updatedCards.every(card => card.isMatched);
        if (isGameOver) {
          setGameOver(true);
        }
      } else {
        // No match, flip cards back after a delay
        setTimeout(() => {
          updatedCards[firstCardId].isFlipped = false;
          updatedCards[secondCardId].isFlipped = false;
          setCards(updatedCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="font-roboto-slab text-2xl text-illusia-highlight1">Memory Game</h2>
        <div className="font-lato">
          <span className="mr-4">Moves: {moves}</span>
          <button 
            onClick={initializeGame}
            className="px-4 py-2 bg-illusia-highlight2 text-white rounded hover:bg-opacity-90"
          >
            Reset Game
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card 
            key={card.id}
            className={`cursor-pointer h-24 transition-all duration-300 ${
              card.isFlipped || card.isMatched ? 'bg-white' : 'bg-illusia-highlight1'
            }`}
            onClick={() => handleCardClick(card.id)}
          >
            <CardContent className="flex items-center justify-center h-full p-2">
              {(card.isFlipped || card.isMatched) ? (
                <img 
                  src={card.imageUrl} 
                  alt="Card" 
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-white text-2xl">?</span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {gameOver && (
        <div className="mt-6 p-4 bg-green-100 text-green-800 rounded font-lato">
          <p className="text-center font-bold">Congratulations! You've completed the game in {moves} moves!</p>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;
