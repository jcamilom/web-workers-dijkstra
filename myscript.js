const W = 10;
const H = 10;
const width = 1000;
const height = 1000;

const rawGraph = generateGraph(W, H);
const nodes = flattenGraph(rawGraph.matrix);
const links = flattenLinks(rawGraph.matrix, rawGraph.links);

const source = 4;
const target = 2;
const shortestPath = shortestPathDijkstra(rawGraph, source, target)

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