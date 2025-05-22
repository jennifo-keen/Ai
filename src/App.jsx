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

    const result = aStar(flippedGrid, flippedStart, flippedEnd);
    const correctedPath = result?.map(([x, y]) => [y, x]);

    setPath(correctedPath || []);
    setTraveledPath([]);

    if (correctedPath) {
      let step = 0;
      const interval = setInterval(() => {
        if (step >= correctedPath.length) {
          clearInterval(interval);
          return;
        }
        setChickenPos(correctedPath[step]);
        setTraveledPath(prev => [...prev, correctedPath[step]]);
        step++;
      }, 60);
    }

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
        traveledPath={traveledPath}
        start={start}
        end={end}
        chickenPos={chickenPos}
      />


      <button onClick={handleSolve} style={{ marginTop: '10px' }}>Tìm đường</button>
    </div>
  );
}

export default App;