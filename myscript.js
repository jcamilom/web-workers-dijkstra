const W = 20;
const H = 20;
const width = 2000;
const height = 2000;
const N_NODES = W * H;

const rawGraph = generateGraph(W, H);
const nodes = flattenGraph(rawGraph.matrix);
const links = flattenLinks(rawGraph.matrix, rawGraph.links);

let source = getRandomInt(0, N_NODES - 1);
let target = getRandomInt(0, N_NODES - 1);
let shortestPath = [];

const graph = { nodes, links };

function initGraph() {
  const svg = d3.select('.svg')
    .attr('viewBox', [0, 0, width, height]);
  const g = svg.append('g');
}

function updateGraph() {
  const svg = d3.select('.svg')
  const g = svg.select('g');
  const link = g
    .selectAll('.link')
    .data(graph.links)
    .join('line')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      .classed('link', true)
      .classed('shortest', d => (shortestPath.includes(d.source.id) && shortestPath.includes(d.target.id)));
  const node = g
    .selectAll('.node')
    .data(graph.nodes)
    .join('circle')
      .attr('r', 10)
      .attr('cy', function (d, i) { return d.y; })
      .attr('cx', function (d, i) { return d.x; })
      .classed('node', true);

  svg.call(d3.zoom()
    .extent([[0, 0], [width, height]])
    .scaleExtent([1, 8])
    .on('zoom', zoomed))

  function zoomed({transform}) {
    g.attr('transform', transform);
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function setInputsValue(source, target) {
  const sorceInnput = document.getElementById('sourceInput');
  const targetInnput = document.getElementById('targetInput');
  sorceInnput.value = source;
  targetInnput.value = target;
}

function setLoader(state) {
  const spinner = document.getElementById('spinner');
  const action = state ? 'add' : 'remove';
  spinner.classList[action]('show');
}

setInputsValue(source, target);
initGraph();

if (window.Worker) {
  const dijkstraWorker = new Worker('dijkstra.js');

  const form = document.getElementById('form');

  form.onsubmit = function(e) {
    e.preventDefault()
    const sorceInnput = document.getElementById('sourceInput');
    const targetInnput = document.getElementById('targetInput');
    const sourceValue = +sorceInnput.value;
    const targetValue = +targetInnput.value;
    if ((sourceValue < 0 || sourceValue >= N_NODES) || (targetValue < 0 || targetValue >= N_NODES)) {
      setInputsValue(source, target);
      return;
    }
    source = sourceValue;
    target = targetValue;
    setLoader(true);
    dijkstraWorker.postMessage([rawGraph, source, target]);
  }

  dijkstraWorker.onmessage = function(e) {
    shortestPath = e.data;
    updateGraph();
    setLoader(false);
  }

  setLoader(true);
  dijkstraWorker.postMessage([rawGraph, source, target]);

} else {
  console.log('Your browser doesn\'t support web workers.');
}
