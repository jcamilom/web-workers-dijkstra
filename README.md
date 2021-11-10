# Shortest Path Problem - Dijkstra Visualization

This is a visualization tool for showing the solving process of the "Shortest Path Problem" using the Dijkstra's algorithm.

See the demo [here](https://jcamilom.github.io/web-workers-dijkstra/).

![preview](https://github.com/jcamilom/web-workers-dijkstra/blob/master/images/preview.png?raw=true)

## Usage

Choose a `SourceNode` and a `TargetNode` from the inputs, then hit the **find!** button and see how the algorithm searches the shortest path between the two nodes.

The graph is based on a square matrix, where the first node is at the upper left corner and the last node (`GridSize²`) at the bottom right.

## How does it work?

The graph is generated from a square matrix where each node is connected to its surrounding neighbors. Later, some connections are removed randomly and a bit of noise is added to each node's position.

The Dijkstra's algorithm then finds the shortest path between the two selected nodes. Visited nodes turn blue during the process, and the shortest path is highlighted in orange color.

## Technologies used

Made with pure js, html and css. The graph is powered by [D3.js](https://d3js.org/).

Javascript WebWorkers are used to avoid the rendering thread to be blocked by the algorithm computations.
