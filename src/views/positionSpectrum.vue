<template>
  <div class="canvas-box">
    <button @click="isFiniteCall">线条显示</button>
    <canvas ref="canvasRef" width="1000" height="400"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
const isRelease = ref(false)
const canvasRef = ref(null)
const isFinite = ref(false)
const isFiniteCall = () => {
  isFinite.value = !isFinite.value
}
onMounted(() => {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  canvas.addEventListener('wheel', handleWheel)
  let startNode = null;

  // 通用函数：绘制圆角矩形
  function drawRoundedRect(x, y, width, height, radiusrt, radiusrb, radiuslt, radiuslb, color = '#4a90e2',
    strokeColor = '#fff',
    lineWidth = 0
  ) {
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + width - radiusrt, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radiusrt)//这个是右上角的弧线
    ctx.lineTo(x + width, y + height - radiusrb)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radiusrb, y + height)//这个是右下角的弧线
    ctx.lineTo(x + radiuslb, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radiuslb)//这个是左下角的弧线
    ctx.lineTo(x, y + radiuslt)
    ctx.quadraticCurveTo(x, y, x + radiuslt, y) //这个是右下角的弧线
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()

    if (strokeColor && lineWidth > 0) {
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = lineWidth
      ctx.stroke()
    }
  }

  function drawMultilineText(ctx, text, x, y, maxWidth, lineHeight = 20) {
    const chars = text.split('')
    let line = ''
    let offsetY = 0

    for (let i = 0; i < chars.length; i++) {
      const testLine = line + chars[i]
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, x, y + offsetY)
        line = chars[i]
        offsetY += lineHeight
      } else {
        line = testLine
      }
    }
    ctx.fillText(line, x, y + offsetY)
  }

  //选中框体的颜色
  const blockSelected = {
    color: '#4b82ff',
    bgColor: '#e0f0ff',
    borderColor: '#4b82ff',
  }
  //连接线与角标的颜色
  const link = {
    lineColor: '#0e2af5',
    cornerColor: '#0e2af5',
  }
  const boxes = [
    {
      x: 70, y: 70, w: 200, h: 50, color: '#fff', text: '课程名称'
      , radiusrt: 0, radiusrb: 0, radiuslt: 15, radiuslb: 0, scrollY: 0,
      strokeColor: '#fff', bgColor: '#514be9', lineWidth: 1, children: [
        {
          id: 0, parent: 0, x: 90, y: 200, w: 170, h: 30, color: '#3a007b', bgColor: '#e1e2f9', text: '内科护理',
          radiusrt: 10, radiusrb: 10, radiuslt: 10, radiuslb: 10
        },
        {
          id: -1, parent: 0, x: 90, y: 250, w: 170, h: 30, color: '#3a007b', bgColor: '#e1e2f9', text: '外科护理',
          radiusrt: 10, radiusrb: 10, radiuslt: 10, radiuslb: 10
        },
      ]
    },
    {
      x: 300, y: 70, w: 200, h: 50, color: '#fff', text: '一级节点名称',
      radiusrt: 0, radiusrb: 0, radiuslt: 0, radiuslb: 0, scrollY: 0,
      strokeColor: '#fff', bgColor: '#514be9', lineWidth: 0.5, children: [
        {
          id: 1, parent: [-1], x: 315, y: 150, w: 170, h: 50, color: '#3a007b', bgColor: '#e1e2f9', text: '呼吸系统疾病病人的护理',
          radiusrt: 5, radiusrb: 5, radiuslt: 5, radiuslb: 5
        },
        {
          id: 2, parent: [0, -1], x: 315, y: 250, w: 170, h: 50, color: '#3a007b', bgColor: '#e1e2f9', text: '呼吸系统疾病病人的护理',
          radiusrt: 5, radiusrb: 5, radiuslt: 5, radiuslb: 5
        },
        {
          id: 3, parent: [-1], x: 315, y: 350, w: 170, h: 50, color: '#3a007b', bgColor: '#e1e2f9', text: '呼吸系统疾病病人的护理',
          radiusrt: 5, radiusrb: 5, radiuslt: 5, radiuslb: 5
        },
        {
          id: 4, parent: [0], x: 315, y: 450, w: 170, h: 50, color: '#3a007b', bgColor: '#e1e2f9', text: '呼吸系统疾病病人的护理',
          radiusrt: 5, radiusrb: 5, radiuslt: 5, radiuslb: 5
        },
        {
          id: 5, parent: [0], x: 315, y: 550, w: 170, h: 50, color: '#3a007b', bgColor: '#e1e2f9', text: '呼吸系统疾病病人的护理',
          radiusrt: 5, radiusrb: 5, radiuslt: 5, radiuslb: 5
        },
        {
          id: 6, parent: [0], x: 315, y: 650, w: 170, h: 50, color: '#3a007b', bgColor: '#e1e2f9', text: '呼吸系统疾病病人的护理',
          radiusrt: 5, radiusrb: 5, radiuslt: 5, radiuslb: 5
        },
        {
          id: 7, parent: [0], x: 315, y: 750, w: 170, h: 50, color: '#3a007b', bgColor: '#e1e2f9', text: '呼吸系统疾病病人的护理',
          radiusrt: 5, radiusrb: 5, radiuslt: 5, radiuslb: 5
        }
      ]
    },
    {
      x: 530, y: 70, w: 200, h: 50, color: '#fff', text: '二级节点名称',
      radiusrt: 0, radiusrb: 0, radiuslt: 0, radiuslb: 0, scrollY: 0,
      strokeColor: '#fff', bgColor: '#514be9', lineWidth: 0.5, children: [
        {
          id: 8, parent: [1], x: 545, y: 150, w: 170, h: 50, color: '#3a007b', bgColor: '#e1e2f9', text: '呼吸系统疾病病人的护理',
          radiusrt: 0, radiusrb: 0, radiuslt: 0, radiuslb: 0
        },
        {
          id: 9, parent: [2], x: 545, y: 250, w: 170, h: 50, color: '#3a007b', bgColor: '#e1e2f9', text: '呼吸系统疾病病人的护理',
          radiusrt: 0, radiusrb: 0, radiuslt: 0, radiuslb: 0
        },
        {
          id: 10, parent: [1], x: 545, y: 350, w: 170, h: 50, color: '#3a007b', bgColor: '#e1e2f9', text: '呼吸系统疾病病人的护理',
          radiusrt: 0, radiusrb: 0, radiuslt: 0, radiuslb: 0
        },
        {
          id: 11, parent: [3], x: 545, y: 450, w: 170, h: 50, color: '#3a007b', bgColor: '#e1e2f9', text: '呼吸系统疾病病人的护理',
          radiusrt: 0, radiusrb: 0, radiuslt: 0, radiuslb: 0
        }
      ]
    },
    {
      x: 760, y: 70, w: 200, h: 50, color: '#fff', text: '三级节点名称',
      radiusrt: 15, radiusrb: 0, radiuslt: 0, radiuslb: 0, scrollY: 0,
      strokeColor: '#fff', bgColor: '#514be9', lineWidth: 0.5, children: [
        {
          id: 12, parent: [8], x: 775, y: 150, w: 170, h: 50, color: '#3a007b', bgColor: '#e1e2f9', text: '呼吸系统疾病病人的护理',
          radiusrt: 0, radiusrb: 0, radiuslt: 0, radiuslb: 0
        },
        {
          id: 13, parent: [8], x: 775, y: 250, w: 170, h: 50, color: '#3a007b', bgColor: '#e1e2f9', text: '呼吸系统疾病病人的护理',
          radiusrt: 0, radiusrb: 0, radiuslt: 0, radiuslb: 0
        },
        {
          id: 14, parent: [8], x: 775, y: 350, w: 170, h: 50, color: '#3a007b', bgColor: '#e1e2f9', text: '呼吸系统疾病病人的护理',
          radiusrt: 0, radiusrb: 0, radiuslt: 0, radiuslb: 0
        },
        {
          id: 15, parent: [8], x: 775, y: 450, w: 170, h: 50, color: '#3a007b', bgColor: '#e1e2f9', text: '呼吸系统疾病病人的护理',
          radiusrt: 0, radiusrb: 0, radiuslt: 0, radiuslb: 0
        }
      ]
    }
  ]

  function drawAll() {
    if (!ctx) return
    ctx.clearRect(0, 0, 1000, 400)

    const clipTop = 70
    const clipBottom = 400
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, clipTop, 1000, clipBottom - clipTop)
    ctx.clip()

    boxes.forEach(b => {
      drawRoundedRect(b.x, b.y + 50, b.w, b.h + 230, 0, 0, 0, 0, b.strokeColor, '', b.lineWidth)
    })

    boxes.forEach(b => {
      b.children = b.children || []
      b?.children.forEach((c) => {
        const y = c.y - b.scrollY
        // if (y + c.h < 100 || y > 400) return // 不在视口就不画
        drawRoundedRect(c.x, y, c.w, c.h + c.text.length * 2,
          c.radiusrt, c.radiusrb, c.radiuslt, c.radiuslb, c.bgColor,
          c.strokeColor, c.lineWidth)
        ctx.font = '15px Microsoft YaHei'
        ctx.fillStyle = c.color
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        // ctx.fillText(c.text, c.x + c.w / 2, c.y + c.h / 2)
        drawMultilineText(ctx, c.text, c.x + c.w / 2, y + 20, c.w - 40)
      })

      drawRoundedRect(b.x, b.y, b.w + 30, b.h,
        b.radiusrt, b.radiusrb, b.radiuslt,
        b.radiuslb, b.strokeColor)
      drawRoundedRect(b.x, b.y, b.w, b.h,
        b.radiusrt, b.radiusrb, b.radiuslt,
        b.radiuslb, b.bgColor)
      ctx.font = '15px Microsoft YaHei'
      ctx.fillStyle = '#fff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(b.text, b.x + b.w / 2, b.y + b.h / 2)
    })
    // 画线在这里 
    const level0 = boxes[0]
    const level1 = boxes[1]
    level1.children.forEach(n1 => {
      const p0 = level0.children.filter(n0 => n1.parent.includes(n0.id))
      // console.log(p0)
      for (const p of p0) {
        if (!p || !p.lineWidth) continue
        // if (!p) continue
        const y1 = p.y + p.h / 2 - level0.scrollY
        const y2 = n1.y + n1.h / 2 - level1.scrollY
        drawCurvedLine(p.x + p.w, y1, n1.x, y2)
      }
    })
    // const level1 = boxes[1]
    const level2 = boxes[2]
    level2.children.forEach(n2 => {
      const p1 = level1.children.filter(n1 => n2.parent.includes(n1.id))
      // console.log(p1)
      // if (!p1 || !p1.lineWidth) return
      // if (!p1) return
      // const y1 = p1.y + p1.h / 2 - level1.scrollY
      // const y2 = n2.y + n2.h / 2 - level2.scrollY
      // drawCurvedLine(p1.x + p1.w, y1, n2.x, y2)
      for (const p of p1) {
        if (!p || !p.lineWidth) continue
        // if (!p) continue
        const y1 = p.y + p.h / 2 - level1.scrollY
        const y2 = n2.y + n2.h / 2 - level2.scrollY
        drawCurvedLine(p.x + p.w, y1, n2.x, y2)
      }
    })

    // 绘制连线：二级 -> 三级
    const level3 = boxes[3]
    level3.children.forEach(n3 => {
      const p2 = level2.children.filter(n2 => n3.parent.includes(n2.id))
      // if (!p2 || !p2.lineWidth) return
      // const y1 = p2.y + p2.h / 2 - level2.scrollY
      // const y2 = n3.y + n3.h / 2 - level3.scrollY
      // drawCurvedLine(p2.x + p2.w, y1, n3.x, y2)
      for (const p of p2) {
        if (!p || !p.lineWidth) continue
        // if (!p) continue
        const y1 = p.y + p.h / 2 - level2.scrollY
        const y2 = n3.y + n3.h / 2 - level3.scrollY
        drawCurvedLine(p.x + p.w, y1, n3.x, y2)
      }
    })




    if (startNode) {
      // 我现在在修改这个地方
      // 我现在需要知道我点击的是哪一个栏目，这个我可以根据startX来获取
      // if(startNode.x){

      // }
      const sy = boxes.find(n => n.x === startNode.x - 15)?.scrollY
      console.log(sy)
      const startX = startNode.x + startNode.w;
      const startY = startNode.y - sy + startNode.h / 2;

      const cpX = (startX + mouseX) / 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(cpX, startY, cpX, mouseY, mouseX, mouseY);
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);
    }
    // requestAnimationFrame(drawAll);
  }


  function handleWheel(e) {
    // console.log('滚动', e.offsetX)
    const mouseX = e.offsetX
    const targetCol = boxes.find(c => mouseX >= c.x && mouseX <= c.x + c.w)
    // console.log(targetCol)
    if (targetCol) {
      targetCol.scrollY += e.deltaY * 0.5 // 滚动速度

      // 获取该列的最大内容高度（最后一个矩形的底部）
      const lastItem = targetCol.children[targetCol.children.length - 1]
      const contentHeight = lastItem.y + 100 // 每个矩形高度100

      // 限制滚动范围
      const maxScroll = Math.max(0, contentHeight - 400)
      if (targetCol.scrollY < 0) targetCol.scrollY = 0
      if (targetCol.scrollY > maxScroll) targetCol.scrollY = maxScroll

      drawAll()
    }
  }

  // 绘制贝塞尔虚线连接
  function drawCurvedLine(x1, y1, x2, y2) {
    if (isFinite.value) {
      return
    }
    // 箭头大小
    const arrowLength = 12
    const arrowWidth = 12
    // 计算末端方向角度（线的斜率）
    const angle = Math.atan2(y2 - y1, x2 - x1)
    const center = getArrowBaseMid(x2, y2, angle, arrowLength)
    ctx.beginPath()
    ctx.setLineDash([2, 3])
    ctx.strokeStyle = link.lineColor
    ctx.moveTo(x1, y1)
    const midX = (x1 + center.x) / 2
    ctx.bezierCurveTo(midX, y1, midX, center.y, center.x, center.y)
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.setLineDash([]) // 重置虚线

    // 绘制箭头
    ctx.save()
    ctx.translate(x2, y2)    // 把原点移动到线的终点
    ctx.rotate(angle)        // 旋转坐标系，使箭头对准线的方向
    ctx.beginPath()
    ctx.moveTo(0, 0)             // 尖端
    ctx.lineTo(-arrowLength, arrowWidth / 2)  // 左下
    ctx.lineTo(-arrowLength, -arrowWidth / 2) // 左上
    ctx.closePath()
    ctx.fillStyle = link.cornerColor
    ctx.fill()
    ctx.restore()

  }

  function getArrowBaseMid(tipX, tipY, angle, arrowLength) {
    // 底边中点相对尖端的坐标（未旋转）
    const midDx = -arrowLength
    const midDy = 0

    // 旋转坐标系
    const bottomMidX = tipX + midDx * Math.cos(angle) - midDy * Math.sin(angle)
    const bottomMidY = tipY + midDx * Math.sin(angle) + midDy * Math.cos(angle)

    return { x: bottomMidX, y: bottomMidY }
  }
  let mouseX = 0;
  let mouseY = 0;

  const findNodeAt = (x, y) => {

    for (const box of boxes) {
      const target = box.children.find(
        n => x >= n.x && x <= n.x + n.w && y >= n.y - box.scrollY && y <= n.y - box.scrollY + n.h
      )
      if (target) return target
    }
    return null

  };

  const handleMouseDown = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const node = findNodeAt(x, y);
    if (node) {

      boxes.forEach(b => {
        b.children.forEach(c => {
          c.strokeColor = '#fff'
          c.lineWidth = 0
        })
      })
      console.log('node', node)
      getAllRelatedNodesWithLevel(boxes, node)
      node.strokeColor = blockSelected.borderColor
      node.color = blockSelected.color;
      node.lineWidth = 1
      startNode = node;
    }
  };

  const handleMouseMove = (e) => {
    if (!startNode) {
      return
    }
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    drawAll()
  };

  const handleMouseUp = (e) => {
    if (!startNode) return;
    // console.log(e)
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const target = findNodeAt(x, y);
    if (target && target.id !== startNode.id) {
      if (target.id > startNode.id) {
        target.parent.push(startNode.id)
      }
    }
    startNode = null;
    drawAll()
  };

  function getAllRelatedNodesWithLevel(boxes, targetNode) {
    const allNodes = [];
    boxes.forEach((level, levelIndex) => {
      level.children.forEach(child => {
        child.levelIndex = levelIndex;
        allNodes.push(child);
      });
    });

    const updateNodeStyle = (node, color = '#000', width = 1) => {
      node.strokeColor = blockSelected.borderColor;
      node.color = blockSelected.color;
      node.lineWidth = width;
    };

    const findById = id => allNodes.find(n => n.id === id);

    // 支持节点 parent 是数组的情况
    const findChildren = parentId =>
      allNodes.filter(n =>
        Array.isArray(n.parent)
          ? n.parent.includes(parentId)
          : n.parent === parentId
      );

    // 递归获取所有后代节点（防止循环引用）
    const collectAllDescendants = (nodeId, parentLevel, acc = [], visited = new Set()) => {
      if (visited.has(nodeId)) return acc;
      visited.add(nodeId);

      const children = findChildren(nodeId);
      for (const child of children) {
        if (!acc.includes(child)) {
          child.relativeLevel = parentLevel + 1;
          acc.push(child);
          collectAllDescendants(child.id, parentLevel + 1, acc, visited);
        }
      }
      return acc;
    };

    const currentNode = findById(targetNode.id);
    if (!currentNode) return null;

    currentNode.relativeLevel = 0;

    // 多父节点的向上递归
    const parents = [];
    const visited = new Set();

    const collectParents = (node, level = 0) => {
      if (!node || visited.has(node.id)) return;
      visited.add(node.id);

      const parentsArr = Array.isArray(node.parent) ? node.parent : [node.parent];
      for (const pid of parentsArr) {
        const pNode = findById(pid);
        if (pNode) {
          pNode.relativeLevel = level - 1;
          parents.push(pNode);
          updateNodeStyle(pNode);
          collectParents(pNode, level - 1);
        }
      }
    };

    collectParents(currentNode);

    const topParent = parents.length > 0 ? parents[parents.length - 1] : null;

    // 同级兄弟节点
    const siblings = allNodes.filter(n => {
      if (n.id === currentNode.id) return false;
      if (Array.isArray(n.parent) && Array.isArray(currentNode.parent)) {
        return n.parent.some(pid => currentNode.parent.includes(pid));
      }
      return n.parent === currentNode.parent;
    });
    siblings.forEach(n => {
      n.relativeLevel = 0;
      updateNodeStyle(n);
    });

    // 所有后代节点
    const descendants = collectAllDescendants(currentNode.id, 0);
    descendants.forEach(d => updateNodeStyle(d));

    return {
      target: currentNode,
      parents,
      siblings,
      descendants,
      topParent
    };
  }


  // 鼠标按下
  canvas.addEventListener("mousedown", handleMouseDown);
  // 鼠标移动
  canvas.addEventListener("mousemove", handleMouseMove);
  // 鼠标松开
  canvas.addEventListener("mouseup", handleMouseUp);
  drawAll()

  watch(isFinite, () => {
    drawAll() // 当 isFinite 改变时重新绘制
  })
})
</script>
<style scoped>
.canvas-box {
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 220px; */
  background: #f5f7fa;

  canvas {
    border: 1px solid #ccc;
    background-color: #fff;
    border-radius: 8px;
  }
}
</style>
