const WIDTH = 5;
const HEIGHT = 5;

function generateLinks(col, row, width, height, id) {
  let links = [];
  if (col < width - 1) links.push(id + 1);
  if (row < height - 1) links.push(id + width);
  return links;
}

function generateGraph(width, height) {
  let matrix = new Array(height);
  let links = new Array(height);
  for (let j = 0; j < height; j++) {
    matrix[j] = new Array(width);
    links[j] = new Array(width);
    for (let i = 0; i < width; i++) {
      matrix[j][i] = i + (j * width);
      links[j][i] = generateLinks(i, j, width, height, matrix[j][i]);
    }
  }
  return { matrix, links };
}

const matrix = generateGraph(WIDTH, HEIGHT);
