export function aStar(grid, start, end) {
  const openSet = [start];
  const cameFrom = {};
  const gScore = {};
  const fScore = {};
  const visited = []; // thêm dòng này

  const key = (x, y) => `${x},${y}`;
  const neighbors = (x, y) => [
    [x - 1, y], [x + 1, y],
    [x, y - 1], [x, y + 1]
  ];

  gScore[key(...start)] = 0;
  fScore[key(...start)] = heuristic(start, end);

  while (openSet.length > 0) {
    openSet.sort((a, b) => fScore[key(...a)] - fScore[key(...b)]);
    const current = openSet.shift();
    visited.push(current); // lưu lại node đã duyệt

    const [x, y] = current;
    if (x === end[0] && y === end[1]) {
      return { path: reconstructPath(cameFrom, current), visited }; // trả về cả path và visited
    }

    for (const [nx, ny] of neighbors(x, y)) {
      if (!isValid(nx, ny, grid)) continue;
      const tentativeG = gScore[key(x, y)] + 1;

      if (tentativeG < (gScore[key(nx, ny)] ?? Infinity)) {
        cameFrom[key(nx, ny)] = [x, y];
        gScore[key(nx, ny)] = tentativeG;
        fScore[key(nx, ny)] = tentativeG + heuristic([nx, ny], end);
        if (!openSet.find(p => p[0] === nx && p[1] === ny))
          openSet.push([nx, ny]);
      }
    }
  }

  return { path: null, visited }; // không tìm được đường
}


function heuristic(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]); // Manhattan
}

function isValid(x, y, grid) {
  return x >= 0 && x < grid.length && y >= 0 && y < grid[0].length && grid[x][y] !== 1;
}

function reconstructPath(cameFrom, current) {
  const path = [current];
  while (cameFrom[`${current[0]},${current[1]}`]) {
    current = cameFrom[`${current[0]},${current[1]}`];
    path.push(current);
  }
  return path.reverse();
}
