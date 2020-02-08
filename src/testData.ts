interface INodeData {
  x: number
  y: number
  id: number
}
interface IEdgeData {
  targetId: number
  sourceId: number
}
export function createData(nodeCount: number, edgeCount: number) {
  const nodes: INodeData[] = []
  const edges: IEdgeData[] = []
  while (nodes.length <= nodeCount) {
    nodes.push({
      x: randomInt(0, window.innerWidth),
      y: randomInt(0, window.innerHeight),
      id: nodes.length
    })
  }
  while (edges.length <= edgeCount) {
    edges.push({
      sourceId: randomInt(0, nodeCount),
      targetId: randomInt(0, nodeCount)
    })
  }
  return {
    nodes,
    edges
  }
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min
}

export default {
  nodes: [
    {
      x: 100,
      y: 100,
      id: 1
    },
    {
      x: 200,
      y: 200,
      id: 2
    },
    {
      x: 800,
      y: 500,
      id: 3
    },
    {
      x: 600,
      y: 100,
      id: 4
    }
  ],
  edges: [
    {
      targetId: 1,
      sourceId: 2
    },
    {
      targetId: 1,
      sourceId: 3
    },
    {
      sourceId: 1,
      targetId: 4
    }
  ]
}