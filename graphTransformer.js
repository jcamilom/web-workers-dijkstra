function flattenGraphToObject(graph) {
  const { matrix, links } = graph;
  let flatGraphObject = {};
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const node = matrix[i][j];
      const nodeLinks = links[i][j];
      flatGraphObject[node.id] = { ...node, links: [...nodeLinks], edges: [] };
    }
  }
  for (const nodeId in flatGraphObject) {
    const node = flatGraphObject[nodeId];
    const newEdges = node.links.map(link => {
      const toNode = flatGraphObject[link.id];
      const weight = Math.floor(distance(node, toNode));
      return { to: `${link.id}`, weight };
    });
    node.edges.push(...newEdges);
    addReciprocalEdges(flatGraphObject, `${node.id}`);
  }
  return flatGraphObject;
}

function addReciprocalEdges(graph, currentNodeId) {
  const currentNode = graph[currentNodeId];
  for (const edge of currentNode.edges) {
    const reciprocalNode = graph[edge.to];
    if (reciprocalNode.edges.find(re => re.to === currentNodeId)) continue;
    reciprocalNode.edges.push({ to: currentNodeId, weight: edge.weight });
  }
}

function distance(a, b) {
  const powX = Math.pow((b.x - a.x), 2);
  const powY = Math.pow((b.y - a.y), 2);
  return Math.sqrt(powX + powY);
}