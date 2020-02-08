import { vec2 } from 'gl-matrix'
import Edge from './edge'
export class Node {
  radius = 25
  /**
   * 位置坐标
   */
  coordinate = vec2.create()
  /**
   * 速度
   */
  velocity = vec2.create()
  /**
   * 加速度
   */
  accelerate = vec2.create()
  /**
   * 受力
   */
  force = vec2.create()
  /**
   * 质量
   */
  M = 1
  /**
   * 电荷量
   */
  Q = 128
  edges: Edge[] = []
  constructor(public id: number) { }

  update(time: number) {
    // 计算加速度
    vec2.scale(this.accelerate, this.force, 1 / this.M)
    // 计算速度
    const deltaVelocity = vec2.create()
    vec2.scale(deltaVelocity, this.accelerate, time / 1000)
    vec2.add(this.velocity, this.velocity, deltaVelocity)
    // 计算位移
    const translation = vec2.create()
    vec2.scale(translation, this.velocity, time / 1000)
    vec2.add(this.coordinate, this.coordinate, translation)
  }

  render(ctx: CanvasRenderingContext2D) {
    const [x, y] = this.coordinate
    ctx.beginPath()
    ctx.arc(x, y, this.radius, 0, Math.PI * 2, false)
    ctx.fillStyle = '#333'
    ctx.fill()
    ctx.font = '16px Microsoft YaHei'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#fff'
    ctx.fillText(this.id.toString(), x, y)
  }
}

export default Node