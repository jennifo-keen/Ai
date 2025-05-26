import React from 'react';
import catImg from '/image/cat.png'; // import ảnh con gà

function MazeBoard({ grid, visitedPath = [], visitedTraveledPath = [], pathAnimated = [], start, end, chickenPos, pathShown = false }) {
  if (!Array.isArray(grid) || !Array.isArray(grid[0])) return null;

  return (
    <div
      className="grid"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${grid[0].length}, 30px)`,
        gap: '0px',
        margin: '10px auto',
        width: 'max-content'
      }}
    >
      {grid.map((row, i) =>
        row.map((cell, j) => {
          const isWall = cell === 1;

          const isVisited = visitedPath.some(coord =>
            Array.isArray(coord) &&
            coord[0] === i && coord[1] === j &&
            visitedTraveledPath.some(p => Array.isArray(p) && p[0] === i && p[1] === j)
          );

          const isPath = pathShown && pathAnimated.some(coord =>
            Array.isArray(coord) && coord[0] === i && coord[1] === j
          );

          const isStart = start && i === start[0] && j === start[1];
          const isEnd = end && i === end[0] && j === end[1];
          const isChicken = chickenPos && i === chickenPos[0] && j === chickenPos[1];

          // style cho ô con gà
          const chickenStyle = {
            backgroundImage: `url(${catImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            animation: 'hop 0.15s ease-in-out infinite alternate'
          };

          return (
            <div
              key={`${i}-${j}`}
              className={`cell ${isWall ? 'wall' : ''} ${isPath ? 'path' : (isVisited ? 'visited' : '')} ${isStart ? 'start' : ''} ${isEnd ? 'end' : ''}`}
              style={isChicken ? chickenStyle : {}}
            />
          );
        })
      )}
    </div>
  );
}

export default MazeBoard;
