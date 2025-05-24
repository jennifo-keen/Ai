import React, { useState, useEffect } from 'react';
import MazeBoard from './MazeBoard';
import { aStar } from './astar';
import './App.css';
import generateMaze from './logic/mazeGeneratorDFS';

function App() {
  const [mazeWidth, setMazeWidth] = useState(10);
  const [mazeHeight, setMazeHeight] = useState(10);
  const [grid, setGrid] = useState([]);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [path, setPath] = useState([]);
  const [chickenPos, setChickenPos] = useState(null);
  const [visitedPath, setVisitedPath] = useState([]);
  const [visitedTraveledPath, setVisitedTraveledPath] = useState([]);
  const [pathAnimated, setPathAnimated] = useState([]);
  const [pathShown, setPathShown] = useState(false);

  useEffect(() => {
    createNewMaze();
  }, []);

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

  const handleSolve = () => {
    if (!grid.length || !start || !end) return;

    const flippedGrid = grid[0].map((_, c) => grid.map(row => row[c]));
    const flippedStart = [start[1], start[0]];
    const flippedEnd = [end[1], end[0]];

    const result = aStar(flippedGrid, flippedStart, flippedEnd);
    const rawPath = result.path;
    const visited = result.visited;

    const correctedPath = rawPath?.map(([x, y]) => [y, x]);
    const correctedVisited = visited?.map(([x, y]) => [y, x]);

    setPath(correctedPath || []);
    setVisitedPath(correctedVisited || []);
    setVisitedTraveledPath([]);
    setPathAnimated([]);
    setPathShown(false);

    let step = 0;
    const interval = setInterval(() => {
      if (step >= correctedVisited.length) {
        clearInterval(interval);
        setChickenPos(correctedPath?.[correctedPath.length - 1] || null);// gà đứng tại đích
        animatePathReverse(correctedPath);
        setPathShown(true);
        return;
      }
      setVisitedTraveledPath(prev => [...prev, correctedVisited[step]]);
      setChickenPos(correctedVisited[step]);
      step++;
    }, 60);
  };

const animatePathReverse = (path) => {
  let i = path.length - 1;

  const animate = () => {
    if (i < 0) return;

    setPathAnimated(prev => [...prev, path[i]]);
    i--;

    // Kết hợp animation frame và timeout để có hiệu ứng nhẹ nhàng
    setTimeout(() => {
      requestAnimationFrame(animate);
    }, 20); // 16ms ~ 60fps
  };

  requestAnimationFrame(animate);
};

return (
    <div className="app-container">
      {/* Maze Section (Left) */}
      <div className="maze-section">
        <h1 className="title">🌟 Mê Cung A* 🌟</h1>
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

      {/* Control Section (Right) */}
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
