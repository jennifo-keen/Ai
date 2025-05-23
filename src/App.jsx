import React, { useState, useEffect } from 'react';
import MazeBoard from './MazeBoard';
import { aStar } from './astar';
import './App.css'
import generateMaze from './logic/mazeGeneratorDFS';

function App() {
  const [mazeWidth, setMazeWidth] = useState(10);
  const [mazeHeight, setMazeHeight] = useState(10);
  const [grid, setGrid] = useState([]);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [path, setPath] = useState([]);
  const [chickenPos, setChickenPos] = useState(null);
  const [traveledPath, setTraveledPath] = useState([]);
  const [visitedPath, setVisitedPath] = useState([]);
  const [pathShown, setPathShown] = useState(false);

  useEffect(() => {
    createNewMaze();
  }, []);

  const createNewMaze = () => {
    const { map, start, target } = generateMaze(mazeWidth, mazeHeight);
    console.log("Mê cung:", map);
    setGrid(map);
    setStart(start);
    setEnd(target);
    setPath([]);
    setChickenPos(null); // reset vị trí gà
    setTraveledPath([]);
    setChickenPos(null);
  };

const handleSolve = () => {
  if (!grid.length || !start || !end) return;

  const flippedGrid = grid[0].map((_, c) => grid.map(row => row[c]));
  const flippedStart = [start[1], start[0]];
  const flippedEnd = [end[1], end[0]];

  const result = aStar(flippedGrid, flippedStart, flippedEnd); // ✅ gọi xong lưu vào biến

  const rawPath = result.path;
  const visited = result.visited;


  const correctedPath = rawPath?.map(([x, y]) => [y, x]);
  const correctedVisited = visited?.map(([x, y]) => [y, x]);

  setPath(correctedPath || []);
  setTraveledPath([]);
  setVisitedPath(correctedVisited || []);
  setPathShown(false); // 👈 quan trọng

  let step = 0;
  const combined = [...(correctedVisited || [])];
  if (correctedPath) {
    combined.push(...correctedPath);
  }

  const interval = setInterval(() => {
    if (step >= combined.length) {
      clearInterval(interval);
      setPathShown(true); // ✅ chỉ khi đến đích mới hiện màu vàng
      return;
    }
    setTraveledPath(prev => [...prev, combined[step]]);
    setChickenPos(combined[step]);
    step++;
  }, 100);
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
  path={path}
  traveledPath={traveledPath}
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