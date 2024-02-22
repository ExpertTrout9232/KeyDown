export function shortestPathSearch(game_board, xp, yp, x_npc, y_npc) {
  const numRows = game_board.length;
  const numCols = game_board[0].length;

  // Define movement directions (up, down, left, right)
  const dx = [-1, 1, 0, 0];
  const dy = [0, 0, -1, 1];

  // Create a 2D array to mark visited cells and store parent cells
  const visited = Array(numRows)
    .fill(false)
    .map(() => Array(numCols).fill(false));
  const parent = Array(numRows)
    .fill(null)
    .map(() => Array(numCols).fill(null));

  // Create a queue for BFS
  const queue = [];

  // Push the player's position into the queue
  queue.push([xp, yp]);
  visited[xp][yp] = true;

  while (queue.length > 0) {
    const [x, y] = queue.shift();

    if (x === x_npc && y === y_npc) {
      // Found the enemy's position, reconstruct the path
      const path = [];
      let curX = x_npc;
      let curY = y_npc;
      while (curX !== xp || curY !== yp) {
        path.push([curX, curY]);
        const [prevX, prevY] = parent[curX][curY];
        curX = prevX;
        curY = prevY;
      }
      path.push([xp, yp]);
      path.reverse(); // Reverse the path to start from player's position
      return path;
    }

    // Explore adjacent cells
    for (let i = 0; i < 4; i++) {
      const newX = x + dx[i];
      const newY = y + dy[i];

      if (newX >= 0 && newX < numRows && newY >= 0 && newY < numCols && game_board[newX][newY] === 0 && !visited[newX][newY]) {
        queue.push([newX, newY]);
        visited[newX][newY] = true;
        parent[newX][newY] = [x, y];
      }
    }
  }

  // If no path is found, return an empty array
  return [];
}