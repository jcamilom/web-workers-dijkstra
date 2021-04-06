const width = 500;
const height = 500;
const data = [12, 15, 8];
const svg = d3.select('body')
  .append('svg')
  .attr('viewBox', [0, 0, width, height]);
const node = svg
  .selectAll('.node')
  .data(data)
  .join('circle')
    .attr('r', function (d, i) { return d; })
    .attr('cy', 50)
    .attr('cx', function (d, i) { return (i + 1) * 50; })
    .classed('node', true)