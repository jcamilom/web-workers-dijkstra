let gridSize = 30;
let width, height;
let nNodes, rawGraph, nodes, links, source, target, shortestPath, graph, processActive;

nNodes = gridSize * gridSize;
source = getRandomInt(0, nNodes - 1);
target = getRandomInt(0, nNodes - 1);

function createGraphStructure() {
  const W = gridSize;
  const H = gridSize;
  rawGraph = generateGraph(W, H);
  nodes = flattenGraph(rawGraph.matrix);
  links = flattenLinks(rawGraph.matrix, rawGraph.links);
  graph = { nodes, links };
}

function initGraph() {
  const svg = d3.select('.svg');
  const g = svg.append('g');
}

function updateGraph() {
  width = gridSize * 100;
  height = gridSize * 100;
  const svg = d3.select('.svg')
    .attr('viewBox', [0, 0, width, height]);
  const g = svg.select('g');
  updateLinks();
  updateNodes();

  svg.call(d3.zoom()
    .extent([[0, 0], [width, height]])
    .scaleExtent([1, 8])
    .on('zoom', zoomed))

  function zoomed({transform}) {
    g.attr('transform', transform);
  }
}

function updateLinks() {
  d3.select('.svg')
    .select('g')
    .selectAll('.link')
    .data(graph.links)
    .join('line')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      .classed('link', true)
      .classed('shortest', d => (shortestPath.includes(d.source.id) && shortestPath.includes(d.target.id)));
}

function updateNodes() {
  d3.select('.svg')
    .select('g')
    .selectAll('.node')
    .data(graph.nodes)
    .join('circle')
      .attr('r', 10)
      .attr('cy', function (d, i) { return d.y; })
      .attr('cx', function (d, i) { return d.x; })
      .classed('node', true)
      .classed('visited', d => d.visited)
      .classed('source', d => d.id === source)
      .classed('target', d => d.id === target);
}

function updateVisitedNodes() {
  d3.select('.svg')
    .select('g')
    .selectAll('.node')
    .data(graph.nodes)
    .join(
      enter => enter.append('circle')
        .attr('r', 10)
        .attr('cy', function (d, i) { return d.y; })
        .attr('cx', function (d, i) { return d.x; })
        .classed('node', true)
        .classed('source', d => d.id === source)
        .classed('target', d => d.id === target),
      update => update
        .classed('visited', d => d.visited)
    )
}

function clearGraph() {
  shortestPath = [];
  graph.nodes.forEach(node => (node.visited = false));
}

function markNodeAsVisited(nodeId) {
  graph.nodes[nodeId].visited = true;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function setInputsValue(source, target, gridSize) {
  const sorceInnput = document.getElementById('sourceInput');
  const targetInnput = document.getElementById('targetInput');
  const sizeInnput = document.getElementById('sizeInput');
  sorceInnput.value = source + 1;
  targetInnput.value = target + 1;
  sizeInnput.value = gridSize;
}

function setLoader(state) {
  processActive = state;
  const spinner = document.getElementById('spinner');
  const action = processActive ? 'add' : 'remove';
  spinner.classList[action]('show');
}

createGraphStructure();
setInputsValue(source, target, gridSize);
initGraph();
clearGraph();
updateGraph();

if (window.Worker) {
  let dijkstraWorker;

  const form = document.getElementById('form');

  form.onsubmit = function(e) {
    e.preventDefault();
    if (processActive) {
      dijkstraWorker.terminate();
      createWorker();
    }
    setLoader(true);
    const sorceInput = document.getElementById('sourceInput');
    const targetInput = document.getElementById('targetInput');
    const sizeInput = document.getElementById('sizeInput');
    const sourceValue = +sorceInput.value - 1;
    const targetValue = +targetInput.value - 1;
    const sizeValue = +sizeInput.value;
    if (sizeValue !== gridSize) {
      gridSize = sizeValue;
      nNodes = gridSize * gridSize;
      createGraphStructure();
      if ((sourceValue < 0 || sourceValue >= nNodes) || (targetValue < 0 || targetValue >= nNodes)) {
        source = getRandomInt(0, nNodes - 1);
        target = getRandomInt(0, nNodes - 1);
        setInputsValue(source, target, gridSize);
      } else {
        source = sourceValue;
        target = targetValue;
      }
    } else if ((sourceValue < 0 || sourceValue >= nNodes) || (targetValue < 0 || targetValue >= nNodes)) {
      setInputsValue(source, target, gridSize);
      return;
    } else {
      source = sourceValue;
      target = targetValue;
    }
    clearGraph();
    updateGraph();
    dijkstraWorker.postMessage([rawGraph, source, target]);
  }

  createWorker();

  setLoader(true);
  dijkstraWorker.postMessage([rawGraph, source, target]);

  function createWorker () {
    dijkstraWorker = new Worker('dijkstra.js');
    dijkstraWorker.onmessage = function(e) {
      const { data } = e;
      if (data.id === 'added') {
        markNodeAsVisited(data.newVisited);
        updateVisitedNodes();
      } else if (data.id === 'finished') {
        shortestPath = data.path;
        updateGraph();
        setLoader(false);
      }
    }
  }

} else {
  console.log('Your browser doesn\'t support web workers.');
}
