function createEmptyMaze(rows, cols) {
  const maze = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push(1); // 1 = wall, 0 = path
    }
    maze.push(row);
  }
  return maze;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function carve(x, y, maze, visited, width, height) {
  const dirs = shuffle([
    [0, -1], [-1, 0], [0, 1], [1, 0]
  ]);

  visited[y][x] = true;

  for (const [dx, dy] of dirs) {
    const nx = x + dx;
    const ny = y + dy;

    if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
    if (visited[ny][nx]) continue;

    const mx = 2 * x + 1;
    const my = 2 * y + 1;
    const mx2 = 2 * nx + 1;
    const my2 = 2 * ny + 1;

    maze[(my + my2) / 2][(mx + mx2) / 2] = 0;
    maze[my2][mx2] = 0;

    carve(nx, ny, maze, visited, width, height);
  }
}

// ✅ Hàm mở ngẫu nhiên các tường để tạo đường phụ
function openRandomWalls(maze, count = 15) {
  const height = maze.length;
  const width = maze[0].length;

  let opened = 0;
  while (opened < count) {
    const y = Math.floor(Math.random() * (height - 2)) + 1;
    const x = Math.floor(Math.random() * (width - 2)) + 1;

    if (maze[y][x] === 1) {
      // kiểm tra nếu xung quanh có ít nhất 2 đường thì mới mở
      const neighbors = [
        maze[y - 1][x],
        maze[y + 1][x],
        maze[y][x - 1],
        maze[y][x + 1]
      ];
      const openCount = neighbors.filter(v => v === 0).length;
      if (openCount >= 2) {
        maze[y][x] = 0;
        opened++;
      }
    }
  }
  return maze;
}

export default function generateMazeDFS(width = 10, height = 10) {
  const mazeHeight = 2 * height + 1;
  const mazeWidth = 2 * width + 1;

  const maze = createEmptyMaze(mazeHeight, mazeWidth);
  const visited = Array(height).fill().map(() => Array(width).fill(false));

  maze[1][1] = 0;
  carve(0, 0, maze, visited, width, height);
  maze[1][0] = 0;
  maze[mazeHeight - 2][mazeWidth - 1] = 0;

  // ✅ Thêm bước mở tường sau khi DFS
  openRandomWalls(maze, Math.floor(width * height * 0.1)); // ví dụ mở thêm ~10% tường

  const start = [1, 0];
  const target = [mazeHeight - 2, mazeWidth - 1];

  return { map: maze, start, target };
}
