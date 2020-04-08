import { vec2 } from 'gl-matrix'
import * as dat from 'dat.gui'
import Node from './node'
import Edge from './edge'
import { createData } from './testData'

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.appendChild(canvas)

let nodes: Node[] = []
let edges: Edge[] = []

interface IParams {
  /**
   * 拉力系数
   */
  elasticity: number
  /**
   * 中心吸引系数
   */
  attractive: number
  /**
   * 斥力系数
   */
  repulsion: number
  /**
   * 阻尼系数
   */
  damping: number
  /**
   * 连线自然长度
   */
  edgeLength: number
  refresh(): void
}
const params: IParams = {
  elasticity: 1.4,
  attractive: 0.3,
  repulsion: 30,
  damping: 0.32,
  edgeLength: 50,
  refresh() {
    const data = createData(20, 15)
    nodes = []
    edges = []
    data.nodes.forEach(item => {
      const node = new Node(item.id)
      vec2.set(node.coordinate, item.x, item.y)
      nodes.push(node)
    })
    data.edges.forEach(item => {
      const sourceNode = nodes.find(node => node.id === item.sourceId)
      const targetNode = nodes.find(node => node.id === item.targetId)
      if (sourceNode && targetNode && sourceNode !== targetNode) {
        const edge = new Edge(targetNode, sourceNode)
        sourceNode.edges.push(edge)
        targetNode.edges.push(edge)
        edges.push(edge)
      }
    })
  }
}

let lastTime = Date.now()
// 画布中心坐标
const canvasCenter = vec2.create()

/**
 * 渲染
 */
function render() {
  const now = Date.now()
  const deltaTime = now - lastTime
  lastTime = now
  // 计算节点受力
  computeForce(nodes, canvasCenter, params)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  edges.forEach(edge => edge.render(ctx))
  nodes.forEach(node => {
    node.update(deltaTime)
    node.render(ctx)
  })
  requestAnimationFrame(render)
}

/**
 * 计算节点的合力
 * @param nodes 
 * @param canvasCenter 
 */
function computeForce(nodes: Node[], canvasCenter: vec2, params: IParams) {
  nodes.forEach(node => {
    vec2.set(node.force, 0, 0)
    /**
     * 1.节点间的库仑力（斥力）
     * F = (Q1 * Q2) / (distance ** 2) * k 
     */
    nodes.forEach(target => {
      if (node === target) return
      const k = params.repulsion
      let distance = vec2.distance(node.coordinate, target.coordinate)
      distance = distance < 50 ? 50 : distance
      // 大小
      const size = node.Q * target.Q / distance ** 2 * k
      // 方向
      const direction = vec2.create()
      vec2.subtract(direction, node.coordinate, target.coordinate)
      vec2.normalize(direction, direction)
      // 库仑力
      const coulombForce = vec2.create()
      vec2.scale(coulombForce, direction, size)
      // 叠加
      vec2.add(node.force, node.force, coulombForce)
    })

    /**
     * 2.拉力
     * F = L * K
     */
    node.edges.forEach(edge => {
      const target = edge.targetNode === node ? edge.sourceNode : edge.targetNode
      const distance = vec2.distance(node.coordinate, target.coordinate)
      const L = distance > params.edgeLength ? distance - params.edgeLength : 0
      const k = params.elasticity
      // 大小
      const size = L * k
      // 方向
      const direction = vec2.create()
      vec2.subtract(direction, target.coordinate, node.coordinate)
      vec2.normalize(direction, direction)
      const pullForce = vec2.create()
      vec2.scale(pullForce, direction, size)
      // 叠加
      vec2.add(node.force, node.force, pullForce)
    })

    /**
     * 3.聚向画布中心的力
     * F = d * K
     */
    {
      const distance = vec2.distance(node.coordinate, canvasCenter)
      const k = params.attractive
      // 大小
      const size = distance * k
      // 方向
      const direction = vec2.create()
      vec2.subtract(direction, canvasCenter, node.coordinate)
      vec2.normalize(direction, direction)
      const force = vec2.create()
      vec2.scale(force, direction, size)
      // 叠加
      vec2.add(node.force, node.force, force)
    }

    /**
     * 4.阻尼力
     * F = -V * K
     */
    {
      const k = params.damping
      const size = vec2.length(node.velocity) * k
      const direction = vec2.create()
      vec2.negate(direction, node.velocity)
      vec2.normalize(direction, direction)
      const dampingForce = vec2.create()
      vec2.scale(dampingForce, direction, size)
      vec2.add(node.force, node.force, dampingForce)
    }

  })
}

/**
 * 更新画布尺寸
 */
function updateCanvasSize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  vec2.set(canvasCenter, window.innerWidth / 2, window.innerHeight / 2)
}

window.addEventListener('resize', updateCanvasSize)
document.addEventListener('visibilitychange', () => {
  if (document.hidden === false) {
    lastTime = Date.now()
  }
})

// 创建控制面板
const gui = new dat.GUI()
const folder = gui.addFolder('布局参数')
folder.add(params, 'repulsion', 10, 50)
folder.add(params, 'attractive', 0, 1)
folder.add(params, 'elasticity', 0.5, 2.5)
folder.add(params, 'damping', 0.1, 0.9)
folder.add(params, 'edgeLength', 30, 200)
gui.add(params, 'refresh')

updateCanvasSize()
params.refresh()
render()