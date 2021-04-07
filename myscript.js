const width = 500;
const height = 500;
const nodes = [
  { id: 0, x: 50, y: 250 },
  { id: 1, x: 100, y: 100 },
  { id: 2, x: 250, y: 80 },
  { id: 3, x: 330, y: 90 },
  { id: 4, x: 450, y: 280 },
  { id: 5, x: 320, y: 350 },
  { id: 6, x: 200, y: 390 },
  { id: 7, x: 150, y: 300 },
  { id: 8, x: 250, y: 180 },
];
const links = [
  { source: nodes[0], target: nodes[1] },
  { source: nodes[0], target: nodes[7] },
  { source: nodes[1], target: nodes[2] },
  { source: nodes[1], target: nodes[7] },
  { source: nodes[2], target: nodes[3] },
  { source: nodes[2], target: nodes[5] },
  { source: nodes[2], target: nodes[8] },
  { source: nodes[3], target: nodes[4] },
  { source: nodes[3], target: nodes[5] },
  { source: nodes[4], target: nodes[5] },
  { source: nodes[5], target: nodes[6] },
  { source: nodes[6], target: nodes[7] },
  { source: nodes[7], target: nodes[8] },
];

const graph = { nodes, links };

const svg = d3.select('body')
  .append('svg')
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
    .classed('link', true);
const node = svg
  .selectAll('.node')
  .data(graph.nodes)
  .join('circle')
    .attr('r', 10)
    .attr('cy', function (d, i) { return d.y; })
    .attr('cx', function (d, i) { return d.x; })
    .classed('node', true);