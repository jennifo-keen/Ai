function MazeBoard({ grid, traveledPath = [], start, end, chickenPos }) {
  if (!Array.isArray(grid) || !Array.isArray(grid[0])) return null;

  return (
    <div
      className="grid"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${grid[0].length}, 20px)`,
        gap: '0px',
        margin: '10px auto',
        width: 'max-content'
      }}
    >
      {grid.map((row, i) =>
        row.map((cell, j) => {
          const isWall = cell === 1;
          const isPath =
            Array.isArray(traveledPath) &&
            traveledPath.some((coord) =>
              Array.isArray(coord) && coord[0] === i && coord[1] === j
            );
          const isStart = start && i === start[0] && j === start[1];
          const isEnd = end && i === end[0] && j === end[1];
          const isChicken = chickenPos && i === chickenPos[0] && j === chickenPos[1];

          return (
            <div
              key={`${i}-${j}`}
              className={`cell ${isWall ? 'wall' : ''} ${isPath ? 'path' : ''} ${isStart ? 'start' : ''} ${isEnd ? 'end' : ''} ${isChicken ? 'chicken' : ''}`}
            />
          );
        })
      )}
    </div>
  );
}

export default MazeBoard;
