const W = 10;
const H = 10;
const width = 1000;
const height = 1000;
const N_NODES = W * H;

const rawGraph = generateGraph(W, H);
const nodes = flattenGraph(rawGraph.matrix);
const links = flattenLinks(rawGraph.matrix, rawGraph.links);

let source = getRandomInt(0, N_NODES - 1);
let target = getRandomInt(0, N_NODES - 1);
let shortestPath = shortestPathDijkstra(rawGraph, source, target);

const graph = { nodes, links };

function drawGraph() {
  const svg = d3.select('.svg')
    .attr('width', width)
    .attr('height', height);
  const link = svg
    .selectAll('.link')
    .data(graph.links)
    .join('line')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      .classed('link', true)
      .classed('shortest', d => (shortestPath.includes(d.source.id) && shortestPath.includes(d.target.id)));
  const node = svg
    .selectAll('.node')
    .data(graph.nodes)
    .join('circle')
      .attr('r', 10)
      .attr('cy', function (d, i) { return d.y; })
      .attr('cx', function (d, i) { return d.x; })
      .classed('node', true);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function submitNodesForm(e) {
  e.preventDefault()
  const sorceInnput = document.getElementById('sourceInput');
  const targetInnput = document.getElementById('targetInput');
  source = +sorceInnput.value;
  target = +targetInnput.value;
  shortestPath = shortestPathDijkstra(rawGraph, source, target);
  drawGraph();
}

function initInputs(source, target) {
  const sorceInnput = document.getElementById('sourceInput');
  const targetInnput = document.getElementById('targetInput');
  sorceInnput.value = source;
  targetInnput.value = target;
}

initInputs(source, target);
drawGraph();