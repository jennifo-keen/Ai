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
    const interval = setInterval(() => {
      if (i < 0) {
        clearInterval(interval);
        return;
      }
      setPathAnimated(prev => [...prev, path[i]]);
      i--;
    }, 9);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Mê Cung A*</h1>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Width: {mazeWidth}
          <input
            type="range"
            min="5"
            max="50"
            value={mazeWidth}
            onChange={(e) => setMazeWidth(Number(e.target.value))}
            style={{ margin: '0 10px' }}
          />
        </label>
        <label>
          Height: {mazeHeight}
          <input
            type="range"
            min="5"
            max="50"
            value={mazeHeight}
            onChange={(e) => setMazeHeight(Number(e.target.value))}
            style={{ margin: '0 10px' }}
          />
        </label>
        <button onClick={createNewMaze} style={{ marginLeft: '15px' }}>
          Tạo mê cung mới
        </button>
      </div>

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

      <button onClick={handleSolve} style={{ marginTop: '10px' }}>Tìm đường</button>
    </div>
  );
}

export default App;
