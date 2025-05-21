function MazeBoard({ grid, path, start, end }) {
  if (!grid || !Array.isArray(grid) || grid.length === 0 || !grid[0]) return null;

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
          const isPath = path?.some(([x, y]) => x === i && y === j);
          const isStart = start && i === start[0] && j === start[1];
          const isEnd = end && i === end[0] && j === end[1];

          return (
            <div
              key={`${i}-${j}`}
              className={`cell ${isWall ? 'wall' : ''} ${isPath ? 'path' : ''} ${isStart ? 'start' : ''} ${isEnd ? 'end' : ''}`}
            />
          );
        })
      )}
    </div>
  );
}

export default MazeBoard;
