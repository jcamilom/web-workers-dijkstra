/**
 * Output example
 * [
 *  [0, 4, 0, 0, 0, 0, 0, 8, 0],
 *  [4, 0, 8, 0, 0, 0, 0, 11, 0],
 *  [0, 8, 0, 7, 0, 4, 0, 0, 2],
 *  [0, 0, 7, 0, 9, 14, 0, 0, 0],
 *  [0, 0, 0, 9, 0, 10, 0, 0, 0],
 *  [0, 0, 4, 14, 10, 0, 2, 0, 0],
 *  [0, 0, 0, 0, 0, 2, 0, 1, 6],
 *  [8, 11, 0, 0, 0, 0, 1, 0, 7],
 *  [0, 0, 2, 0, 0, 0, 6, 7, 0]
 * ];
 * @param {*} fancyGraph 
 * @returns 
 */
function transformToRawGraph(fancyGraph) {
  const nodeNames = Object.getOwnPropertyNames(fancyGraph);
  const nNodes = nodeNames.length;
  const nodePseudoIndexes = {};
  for (let i = 0; i < nNodes; i++) {
    nodePseudoIndexes[nodeNames[i]] = i;
  }
  let graph = [];
  for (let i = 0; i < nNodes; i++) {
    const node = fancyGraph[nodeNames[i]];
    graph.push([...new Array(nNodes)].map(_ => 0));
    for (let j = 0; j < node.edges.length; j++) {
      const { to, weight } = node.edges[j];
      const toPseudoIndex = nodePseudoIndexes[to];
      graph[i][toPseudoIndex] = weight;
    }
  }
  return graph;
}

const LOG_PROGRESS = false;
let progressCount = -1;

function logProgress(visited, unvisited, distances, previous) {
  if (LOG_PROGRESS) {
    console.log('========================')
    console.log('count: ', progressCount)
    console.log('visited', visited)
    console.log('unvisited', unvisited)
    console.log('distances', distances)
    console.log('previous', previous)
    progressCount++;
  }
}

function findMinDistance(distances, unvisited) {
  let minDistance = Number.MAX_VALUE;
  let minDistanceIdx;
  for (let i = 0; i < distances.length; i++) {
    if (!unvisited.includes(i)) continue;
    const distance = distances[i];
    if (distance < minDistance) {
      minDistance = distance;
      minDistanceIdx = i;
    }
  }
  return minDistanceIdx;
}

function getAdjacentVerticesWithDistance(vertice) {
  let adjacent = [];
  vertice.forEach((v, i) => {
    if (v !== 0) {
      adjacent.push({
        idx: i,
        value: v,
      })
    }
  });
  return adjacent;
}

function dijkstra(graph, source, target) {
  const visited = []; //idxs
  const previous = [...new Array(graph.length)]; // undefined array of node's length
  const unvisited = previous.map((_, idx) => idx); //idxs
  const distances = unvisited.map((v => (v === source ? 0 : Infinity))); // distances from source
  logProgress(visited, unvisited, distances, previous);
  while (unvisited.length !== 0) {
    const u = findMinDistance(distances, unvisited);
    visited.push(u);
    const idxToRemove = unvisited.findIndex(v => v === u);
    unvisited.splice(idxToRemove, 1);
    if (u === target) break;
    const adjacents = getAdjacentVerticesWithDistance(graph[u]);
    const distanceU = distances[u]; // shortest known distance from source to current node
    for (let i = 0; i < adjacents.length; i++) {
      const v = adjacents[i];
      const distanceV = distances[v.idx]; // shortest known distance from source to current adjacent
      const sum = distanceU + v.value;  // distance from source to current adjacent through current node. (v.value is length(u,v))
      if (sum < distanceV) {
        distances[v.idx] = sum;
        previous[v.idx] = u;
      }
    }
    logProgress(visited, unvisited, distances, previous);
  }
  return { distances, previous };
}

function extractShortestPath(source, target, previous) {
  const s = [];
  let u = target;
  if (previous[u] !== undefined || u === source) {
    while (u !== undefined) {
      s.push(u);
      u = previous[u];
    }
  }
  return s.reverse();
}

function shortestPathDijkstra(fancyGraph, source, target) {
  const flattenFancyGraph = flattenGraphToObject(fancyGraph);
  const rawGraph = transformToRawGraph(flattenFancyGraph);
  const { distances, previous } = dijkstra(rawGraph, source, target);
  const shortestPath = extractShortestPath(source, target, previous);
  console.log('distances trunc', distances)
  console.log(`shortestPath from ${source} to ${target}`, shortestPath);
  return shortestPath;
}