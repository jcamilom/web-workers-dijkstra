const PADDING = 15;

function generateLinks(col, row, width, height, id) {
  let links = [];
  if (col < width - 1) links.push({ id: id + 1, i: col + 1, j: row });
  if (row < height - 1) links.push({ id: id + width, i: col, j: row + 1 });
  return links;
}

function generateGraph(width, height) {
  let matrix = new Array(height);
  let links = new Array(height);
  for (let j = 0; j < height; j++) {
    matrix[j] = new Array(width);
    links[j] = new Array(width);
    for (let i = 0; i < width; i++) {
      matrix[j][i] = {
        id: i + (j * width),
        x: (i * 100) + PADDING,
        y: (j * 100) + PADDING,
      };
      links[j][i] = generateLinks(i, j, width, height, matrix[j][i].id);
    }
  }
  return { matrix, links };
}

function flattenGraph(matrix) {
  let flatGraph = [];
  for (let i = 0; i < matrix.length; i++) {
    flatGraph.push(...matrix[i]);
  }
  return flatGraph;
}

function flattenLinks(matrix, links) {
  let flatLinks = [];
  for (let j = 0; j < links.length; j++) {
    for (let i = 0; i < links[j].length; i++) {
      for (let k = 0; k < links[j][i].length; k++) {
        const targetLink = links[j][i][k];
        flatLinks.push({
          source: matrix[j][i],
          target: matrix[targetLink.j][targetLink.i],
        });
      }
    }
  }
  return flatLinks;
}

