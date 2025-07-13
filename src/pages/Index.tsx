import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

type Screen = "start" | "levels" | "settings" | "game";

interface GameBlock {
  id: number;
  x: number;
  y: number;
  color: string;
}

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("start");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [difficulty, setDifficulty] = useState("normal");
  const [score, setScore] = useState(0);
  const [gameBlocks, setGameBlocks] = useState<GameBlock[]>([]);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [playerPosition, setPlayerPosition] = useState(50);

  // Игровая логика
  useEffect(() => {
    if (!isGameRunning) return;

    const gameInterval = setInterval(() => {
      // Двигаем блоки вниз
      setGameBlocks((prev) => {
        const updatedBlocks = prev
          .map((block) => ({
            ...block,
            y: block.y + 2,
          }))
          .filter((block) => block.y < 100);

        // Добавляем новый блок случайно
        if (Math.random() < 0.02) {
          updatedBlocks.push({
            id: Date.now(),
            x: Math.random() * 80 + 10,
            y: 0,
            color: Math.random() > 0.5 ? "#000000" : "#808080",
          });
        }

        return updatedBlocks;
      });
    }, 50);

    return () => clearInterval(gameInterval);
  }, [isGameRunning]);

  // Управление игроком
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setPlayerPosition((prev) => Math.max(0, prev - 5));
      } else if (e.key === "ArrowRight") {
        setPlayerPosition((prev) => Math.min(90, prev + 5));
      } else if (e.key === " ") {
        setIsGameRunning((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Проверка столкновений и подсчет очков
  useEffect(() => {
    gameBlocks.forEach((block) => {
      if (block.y > 85 && Math.abs(block.x - playerPosition) < 8) {
        setScore((prev) => prev + 10);
        setGameBlocks((prev) => prev.filter((b) => b.id !== block.id));
      }
    });
  }, [gameBlocks, playerPosition]);

  const StartScreen = () => (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center font-['Arial'] animate-fade-in">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-bold text-black mb-2 animate-scale-in">
          ИГРА
        </h1>
        <p className="text-lg text-gray-600 animate-fade-in">
          Минималистичная аркада
        </p>

        <div className="space-y-4 mt-12">
          <Button
            onClick={() => setCurrentScreen("levels")}
            className="w-48 h-12 bg-black text-white hover:bg-gray-800 text-lg font-normal rounded-none border-2 border-black transition-all duration-200 hover:scale-105 animate-fade-in"
          >
            ИГРАТЬ
          </Button>
          <br />
          <Button
            onClick={() => setCurrentScreen("settings")}
            variant="outline"
            className="w-48 h-12 bg-white text-black border-2 border-black hover:bg-gray-100 text-lg font-normal rounded-none transition-all duration-200 hover:scale-105 animate-fade-in"
          >
            НАСТРОЙКИ
          </Button>
        </div>
      </div>
    </div>
  );

  const LevelsScreen = () => (
    <div className="min-h-screen bg-white p-8 font-['Arial'] animate-slide-in-right">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => setCurrentScreen("start")}
            variant="ghost"
            className="p-2 hover:bg-gray-100"
          >
            <Icon name="ArrowLeft" size={24} />
          </Button>
          <h2 className="text-2xl font-bold text-black">УРОВНИ</h2>
          <div className="w-10" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
            <Card
              key={level}
              className="aspect-square flex items-center justify-center cursor-pointer hover:bg-gray-50 border-2 border-black rounded-none bg-white"
              onClick={() => setCurrentScreen("game")}
            >
              <span className="text-2xl font-bold text-black">{level}</span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const SettingsScreen = () => (
    <div className="min-h-screen bg-white p-8 font-['Arial'] animate-slide-in-right">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => setCurrentScreen("start")}
            variant="ghost"
            className="p-2 hover:bg-gray-100"
          >
            <Icon name="ArrowLeft" size={24} />
          </Button>
          <h2 className="text-2xl font-bold text-black">НАСТРОЙКИ</h2>
          <div className="w-10" />
        </div>

        <div className="space-y-6">
          <Card className="p-6 border-2 border-black rounded-none bg-white">
            <div className="flex items-center justify-between">
              <span className="text-lg text-black">Звук</span>
              <Button
                onClick={() => setSoundEnabled(!soundEnabled)}
                variant="ghost"
                className="p-2"
              >
                <Icon name={soundEnabled ? "Volume2" : "VolumeX"} size={24} />
              </Button>
            </div>
          </Card>

          <Card className="p-6 border-2 border-black rounded-none bg-white">
            <div className="space-y-4">
              <span className="text-lg text-black block">Сложность</span>
              <div className="space-y-2">
                {["легко", "нормально", "сложно"].map((level) => (
                  <Button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    variant={difficulty === level ? "default" : "outline"}
                    className={`w-full justify-start rounded-none border-2 border-black ${
                      difficulty === level
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    {level.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const GameScreen = () => (
    <div className="min-h-screen bg-white p-4 font-['Arial'] animate-fade-in">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => setCurrentScreen("levels")}
            variant="ghost"
            className="p-2 hover:bg-gray-100"
          >
            <Icon name="ArrowLeft" size={24} />
          </Button>
          <div className="text-center">
            <div className="text-sm text-gray-600">УРОВЕНЬ 1</div>
            <div className="text-lg font-bold text-black">СЧЁТ: {score}</div>
          </div>
          <Button variant="ghost" className="p-2">
            <Icon name="Pause" size={24} />
          </Button>
        </div>

        <Card className="aspect-square border-4 border-black rounded-none bg-white p-4 mb-6 relative overflow-hidden">
          <div className="w-full h-full relative bg-gray-50">
            {/* Падающие блоки */}
            {gameBlocks.map((block) => (
              <div
                key={block.id}
                className="absolute w-6 h-6 transition-all duration-75"
                style={{
                  left: `${block.x}%`,
                  top: `${block.y}%`,
                  backgroundColor: block.color,
                }}
              />
            ))}

            {/* Игрок */}
            <div
              className="absolute bottom-2 w-8 h-4 bg-black transition-all duration-100"
              style={{ left: `${playerPosition}%` }}
            />

            {/* Инструкции для игры */}
            {!isGameRunning && gameBlocks.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-600 text-sm">
                <p className="mb-2">Стрелки ← → для движения</p>
                <p className="mb-4">Пробел для старта/паузы</p>
                <Button
                  onClick={() => setIsGameRunning(true)}
                  className="bg-black text-white px-4 py-2 text-sm"
                >
                  СТАРТ
                </Button>
              </div>
            )}
          </div>
        </Card>

        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => setPlayerPosition((prev) => Math.max(0, prev - 10))}
            className="w-16 h-16 bg-black text-white hover:bg-gray-800 rounded-none border-2 border-black"
          >
            <Icon name="ArrowLeft" size={24} />
          </Button>
          <Button
            onClick={() => setIsGameRunning((prev) => !prev)}
            className="w-16 h-16 bg-black text-white hover:bg-gray-800 rounded-none border-2 border-black"
          >
            <Icon name={isGameRunning ? "Pause" : "Play"} size={24} />
          </Button>
          <Button
            onClick={() => setPlayerPosition((prev) => Math.min(90, prev + 10))}
            className="w-16 h-16 bg-black text-white hover:bg-gray-800 rounded-none border-2 border-black"
          >
            <Icon name="ArrowRight" size={24} />
          </Button>
        </div>
      </div>
    </div>
  );

  const screens = {
    start: <StartScreen />,
    levels: <LevelsScreen />,
    settings: <SettingsScreen />,
    game: <GameScreen />,
  };

  return screens[currentScreen];
};

export default Index;
