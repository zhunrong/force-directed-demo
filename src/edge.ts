import { Node } from './node'
export class Edge {
  constructor(public targetNode: Node, public sourceNode: Node) { }
  render(ctx: CanvasRenderingContext2D) {
    const { targetNode, sourceNode } = this
    const [tx, ty] = targetNode.coordinate
    const [sx, sy] = sourceNode.coordinate
    ctx.beginPath()
    ctx.moveTo(sx, sy)
    ctx.lineTo(tx, ty)
    ctx.strokeStyle = '#666'
    ctx.stroke()
  }
}

export default Edge