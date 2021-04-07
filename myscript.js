const width = 500;
const height = 500;
const graph = {
  nodes: [
    { x: 50, y: 250 },
    { x: 100, y: 100 },
    { x: 250, y: 80 },
    { x: 330, y: 90 },
    { x: 450, y: 280 },
    { x: 320, y: 350 },
    { x: 200, y: 390 },
    { x: 150, y: 300 },
    { x: 250, y: 180 },
  ]
}
const svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);
const node = svg
  .selectAll('.node')
  .data(graph.nodes)
  .join('circle')
    .attr('r', 10)
    .attr('cy', function (d, i) { return d.y; })
    .attr('cx', function (d, i) { return d.x; })
    .classed('node', true)