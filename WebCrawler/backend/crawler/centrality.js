/**
 *
 * closenessCentrality(nodes, edges) - This function will calculate the closeness centrality for each node in the graph.
 *
 * @param {*} nodes - the array of nodes to calculate the closeness centrality for
 * @param {*} edges - the array of edges connecting nodes
 * @returns centrality - an object containing the closeness centrality for each node
 */
function closenessCentrality(nodes, edges, graphs) {
  const centrality = {};
  const graphCenters = [];

  // Initialize centrality scores for all nodes to 0
  for (let node of nodes) {
    centrality[node.id] = 0;
  }

  for (let graph of graphs) {
    // Calculate shortest paths for all nodes
    currentNodes = nodes.filter((node) => node.graph === graph);
    currentEdges = edges.filter((edge) => edge.graph === graph);
    let mostCentralNode = { id: -1, centrality: 0 };

    for (let node of currentNodes) {
      const reversedEdges = edges.map((edge) => {
        return {
          source: edge.target,
          target: edge.source,
        };
      });

      const distances = dijkstra(currentNodes, reversedEdges, node.id);
      let totalDistance = 0;

      // Calculate total distance from node to all other nodes
      for (let distance of Object.values(distances)) {
        if (distance !== Infinity) {
          totalDistance += distance;
        }
      }

      // Calculate closeness centrality for the node
      if (totalDistance !== 0) {
        //outgoingEdges.length is the number of nodes reachable from the current node
        outgoingEdges = currentEdges.filter((edge) => edge.source === node.id);

        //Wasserman and Faust closeness centrality
        //centrality[node.id] = ((outgoingEdges.length - 1) / (nodes.length - 1) ) * ((outgoingEdges.length -1))/totalDistance;

        centrality[node.id] = (outgoingEdges.length - 1) / totalDistance;

        //Keep track of the most central node
        if (centrality[node.id] > mostCentralNode.centrality) {
          mostCentralNode.id = node.id;
          mostCentralNode.centrality = centrality[node.id];
        }
      }
    }

    graphCenters.push(mostCentralNode);
  }

  // Print the centrality highest centrality for each page entered by the user
  graphCenters.map((center, index) => {
    if (center.id !== -1) {
      console.log(
        "Central Node Per Page Entered: " +
          nodes[center.id].url +
          " Centrality: " +
          center.centrality
      );
    }
  });

  //Find the highest centrality node overall
  let highestCentrality = { id: -1, centrality: 0 };
  for (let center of graphCenters) {
    if (center.centrality > highestCentrality.centrality) {
      highestCentrality = center;
    }
  }
  console.log(
    "Highest Centrality Node Overall : " + nodes[highestCentrality.id].url
  );

  return centrality;
}

/**
 *
 * dijkstra(nodes, edges, source) - This function will calculate the shortest path from a source node to all other nodes in the graph.
 *
 * @param {*} nodes - the array of nodes to calculate the shortest path
 * @param {*} edges - the array of edges connecting nodes
 * @param {*} source - the source node to calculate the shortest path from
 * @returns distances from all other nodes in the graph to the source node
 */
function dijkstra(nodes, edges, source) {
  const distances = {};
  const visited = {};
  const queue = [];

  // Initialize distances to Infinity and visited to false for all nodes
  for (let node of nodes) {
    distances[node.id] = Infinity;
    visited[node.id] = false;
  }

  // Set distance of source node to 0
  distances[source] = 0;

  // Add source node to the queue
  queue.push(source);

  while (queue.length > 0) {
    // Get the node with the minimum distance from the queue
    let minDistanceNode = queue[0];
    let minDistance = distances[minDistanceNode];
    for (let i = 1; i < queue.length; i++) {
      let node = queue[i];
      if (distances[node] < minDistance) {
        minDistanceNode = node;
        minDistance = distances[node];
      }
    }

    // Remove the node with the minimum distance from the queue
    queue.splice(queue.indexOf(minDistanceNode), 1);

    // Mark the node as visited
    visited[minDistanceNode] = true;

    // Get the neighbors of the current node
    let neighbors = edges
      .filter((edge) => edge.source === minDistanceNode)
      .map((edge) => edge.target);

    // Update distances of neighbors
    for (let neighbor of neighbors) {
      if (!visited[neighbor]) {
        let distance = distances[minDistanceNode] + 1;
        if (distance < distances[neighbor]) {
          distances[neighbor] = distance;
          queue.push(neighbor);
        }
      }
    }
  }

  return distances;
}

module.exports = closenessCentrality;
