const PADDING = 50;

function generateLinks(col, row, width, height, id, previousRightBottomLinkAdded) {
  let links = [];
  let rightBottomLinkAdded = false;
  if (col < width - 1) {
    // Add right link
    links.push({ id: id + 1, i: col + 1, j: row });
    // Add random right-bottom diagonal to 30% of the nodes
    if (row < height - 1 && Math.random() > 0.7) {
      links.push({ id: id + width + 1, i: col + 1, j: row + 1 });
      rightBottomLinkAdded = true;
    }
  }
  if (row < height - 1) {
    // Add bottom link
    links.push({ id: id + width, i: col, j: row + 1 });
    // Add random left-bottom diagonal to 30% of the nodes
    if (col > 0 && !previousRightBottomLinkAdded && Math.random() > 0.7) {
      links.push({ id: id + width - 1, i: col - 1, j: row + 1 });
    }
  }
  return [links, rightBottomLinkAdded];
}

function generateGraph(width, height) {
  let matrix = new Array(height);
  let links = new Array(height);
  let previousRightBottomLinkAdded = false;
  for (let j = 0; j < height; j++) {
    matrix[j] = new Array(width);
    links[j] = new Array(width);
    for (let i = 0; i < width; i++) {
      matrix[j][i] = {
        id: i + (j * width),
        x: addRandomness((i * 100) + PADDING, 25),
        y: addRandomness((j * 100) + PADDING, 25),
      };
      [links[j][i], previousRightBottomLinkAdded] = generateLinks(i, j, width, height, matrix[j][i].id, previousRightBottomLinkAdded);
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

// add random between -30 and 30
function addRandomness(value, max) {
  const rand = (Math.random() - 0.5) * 2; // random between -1 and 1
  return value + Math.floor(rand * max);
}

