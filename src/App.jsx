import React, { useState, useEffect, useRef } from 'react';
import StartScreen from './StartScreen';
import MazeBoard from './MazeBoard';
import { aStar } from './astar';
import generateMaze from './logic/mazeGeneratorDFS';
import './App.css';

// COMPONENT CHÍNH
function App() {
  // STATE CƠ BẢN
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [mazeWidth, setMazeWidth] = useState(18);
  const [mazeHeight, setMazeHeight] = useState(9);
  const [grid, setGrid] = useState([]);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [bgPlaying, setBgPlaying] = useState(false);

  // STATE ĐƯỜNG ĐI
  const [path, setPath] = useState([]);
  const [visitedPath, setVisitedPath] = useState([]);
  const [visitedTraveledPath, setVisitedTraveledPath] = useState([]);
  const [pathAnimated, setPathAnimated] = useState([]);
  const [chickenPos, setChickenPos] = useState(null);
  const [pathShown, setPathShown] = useState(false);


  //ÂM THANH (DÙNG useRef để không tạo mới mỗi render)

  const clickSound = useRef(new Audio('./public/sounds/playing.mp3'));
  const goalSound = useRef(new Audio('./public/sounds/end.mp3'));
  const bgMusic = useRef(new Audio('./public/sounds/start.mp3'));


  //KHỞI TẠO GAME KHI LOAD

  useEffect(() => {
    createNewMaze();
  }, []);


  // TẠO MÊ CUNG MỚI

  const createNewMaze = () => {
    const { map, start, target } = generateMaze(mazeWidth, mazeHeight);
    setGrid(map);
    setStart(start);
    setEnd(target);
    setPath([]);
    setVisitedPath([]);
    setVisitedTraveledPath([]);
    setPathAnimated([]);
    setChickenPos(null);
    setPathShown(false);
  };


  //GIẢI MÊ CUNG BẰNG A*

  const handleSolve = () => {
    if (!grid.length || !start || !end) return;

    //Tắt nhạc nền nếu đang phát
    if (bgPlaying) {
      bgMusic.current.pause();
      bgMusic.current.currentTime = 0;
      setBgPlaying(false);
    }

    // Lật ma trận để phù hợp với thuật toán
    const flippedGrid = grid[0].map((_, c) => grid.map(row => row[c]));
    const flippedStart = [start[1], start[0]];
    const flippedEnd = [end[1], end[0]];

    const result = aStar(flippedGrid, flippedStart, flippedEnd);
    const rawPath = result.path;
    const visited = result.visited;

    // startSound.current.play();
    clickSound.current.currentTime = 0;
    clickSound.current.loop = true;
    clickSound.current.play();

    const correctedPath = rawPath?.map(([x, y]) => [y, x]);
    const correctedVisited = visited?.map(([x, y]) => [y, x]);

    setPath(correctedPath || []);
    setVisitedPath(correctedVisited || []);
    setVisitedTraveledPath([]);
    setPathAnimated([]);
    setPathShown(false);

    // Animation di chuyển
    let step = 0;
    const interval = setInterval(() => {
      if (step >= correctedVisited.length) {
        clearInterval(interval);
        setChickenPos(correctedPath?.[correctedPath.length - 1] || null);

        clickSound.current.pause();
        clickSound.current.currentTime = 0;

        goalSound.current.currentTime = 0;
        goalSound.current.play();

        animatePathReverse(correctedPath);
        setPathShown(true);
        return;
      }

      const stepSound = new Audio('./public/sounds/step.mp3');
      stepSound.currentTime = 0;
      stepSound.play();

      setVisitedTraveledPath(prev => [...prev, correctedVisited[step]]);
      setChickenPos(correctedVisited[step]);
      step++;
    }, 120);
  };


  //ANIMATION CHO ĐƯỜNG ĐI NGƯỢC

  const animatePathReverse = (path) => {
    let i = path.length - 1;

    const animate = () => {
      if (i < 0) return;
      setPathAnimated(prev => [...prev, path[i]]);
      i--;
      setTimeout(() => {
        requestAnimationFrame(animate);
      }, 50);
    };

    requestAnimationFrame(animate);
  };


  //GIAO DIỆN MỞ ĐẦU

  if (showStartScreen) {
    return <StartScreen onStart={() => {
        setShowStartScreen(false);
        bgMusic.current.loop = true;
        bgMusic.current.volume = 1;
        bgMusic.current.play();
        setBgPlaying(true);
      }} />;
  }


  //GIAO DIỆN CHÍNH

  return (
    <div className="app-container">
      <div className="maze-section">
        <h1 className="title">🌟 MÈO TÌM VÀNG 🌟</h1>
        <MazeBoard
          grid={grid}
          visitedPath={visitedPath}
          visitedTraveledPath={visitedTraveledPath}
          pathAnimated={pathAnimated}
          start={start}
          end={end}
          chickenPos={chickenPos}
          pathShown={pathShown}
        />
      </div>

      <div className="control-section">
        <h3 className="section-title">🎮 Điều Khiển</h3>
        <div className="control-sliders">
          <label className="slider-label">
            Chiều Rộng: {mazeWidth} 🐾
            <input
              type="range"
              min="5"
              max="50"
              value={mazeWidth}
              onChange={(e) => setMazeWidth(Number(e.target.value))}
              className="slider"
            />
          </label>
          <label className="slider-label">
            Chiều Cao: {mazeHeight} 🐾
            <input
              type="range"
              min="5"
              max="50"
              value={mazeHeight}
              onChange={(e) => setMazeHeight(Number(e.target.value))}
              className="slider"
            />
          </label>
        </div>

        <div className="control-buttons">
          <button className="generate-btn" onClick={createNewMaze}>
            Tạo Mê Cung Mới ✨
          </button>
          <button className="solve-btn" onClick={handleSolve}>
            Tìm Đường! 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
