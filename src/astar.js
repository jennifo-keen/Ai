
//THUẬT TOÁN A* TÌM ĐƯỜNG
export function aStar(grid, start, end) {
  // Danh sách các node cần xét
  const openSet = [start];

  // Lưu các node đi trước (để reconstruct path)
  const cameFrom = {};

  // Chi phí từ start đến mỗi node
  const gScore = {};

  // Ước lượng chi phí từ start đến end qua mỗi node
  const fScore = {};

  // Danh sách node đã duyệt (để hiển thị)
  const visited = [];

  // Chuyển tọa độ [x, y] thành chuỗi để làm key
  const key = (x, y) => `${x},${y}`;

  // Lấy các ô hàng xóm theo 4 hướng (trên, dưới, trái, phải)
  const neighbors = (x, y) => [
    [x - 1, y], [x + 1, y],
    [x, y - 1], [x, y + 1]
  ];

  // Gán điểm khởi đầu
  gScore[key(...start)] = 0;
  fScore[key(...start)] = heuristic(start, end);

  // 🔁 VÒNG LẶP TÌM ĐƯỜNG
  while (openSet.length > 0) {
    // Chọn node có fScore nhỏ nhất
    openSet.sort((a, b) => fScore[key(...a)] - fScore[key(...b)]);
    const current = openSet.shift();
    visited.push(current); // Ghi lại các node đã duyệt

    const [x, y] = current;

    // Nếu đến đích thì dựng lại đường đi và trả về
    if (x === end[0] && y === end[1]) {
      return {
        path: reconstructPath(cameFrom, current),
        visited
      };
    }

    // Xét các node hàng xóm
    for (const [nx, ny] of neighbors(x, y)) {
      if (!isValid(nx, ny, grid)) continue;

      const tentativeG = gScore[key(x, y)] + 1;

      // Nếu tìm được đường đi tốt hơn đến node này
      if (tentativeG < (gScore[key(nx, ny)] ?? Infinity)) {
        cameFrom[key(nx, ny)] = [x, y];
        gScore[key(nx, ny)] = tentativeG;
        fScore[key(nx, ny)] = tentativeG + heuristic([nx, ny], end);

        // Thêm node vào openSet nếu chưa có
        if (!openSet.find(p => p[0] === nx && p[1] === ny)) {
          openSet.push([nx, ny]);
        }
      }
    }
  }

  // Nếu không tìm thấy đường đi
  return { path: null, visited };
}

// 🔧 HÀM ƯỚC LƯỢNG (HEURISTIC)
// Dùng khoảng cách Manhattan (thích hợp cho grid 4 hướng)
function heuristic(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

// ✅ KIỂM TRA TỌA ĐỘ HỢP LỆ
function isValid(x, y, grid) {
  return (
    x >= 0 && x < grid.length &&
    y >= 0 && y < grid[0].length &&
    grid[x][y] !== 1 // Không đi vào tường
  );
}

// 🔁 DỰNG LẠI ĐƯỜNG ĐI TỪ ĐÍCH VỀ ĐẦU
function reconstructPath(cameFrom, current) {
  const path = [current];
  while (cameFrom[`${current[0]},${current[1]}`]) {
    current = cameFrom[`${current[0]},${current[1]}`];
    path.push(current);
  }
  return path.reverse();
}
