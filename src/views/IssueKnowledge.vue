<template>
    <div class="container">
        <div ref="containerRef" class="canvas-container">
            <canvas ref="canvasRef" class="canvas"></canvas>
            <div class="cardSuperior">
                <div class="questionCardTitle">
                    <div>
                        <img width="15px" src="@/assets/view/eye.png" alt="">
                        全局层问题
                        <img @click="dialogVisible = true" width="15px" src="@/assets/view/edit.png" alt="">
                    </div>
                    <span>与课程层面对应问题</span>
                </div>
                <div ref="leftRef" class="card left" @click="toHot" v-for="item in leftData" :key="item">
                    <h3>{{ item.problem }}</h3>
                    <p>{{ item.text }}</p>
                    <div>
                        <img width="20px" src="@/assets/view/eyebai.png" alt="">
                        <img @click="dialogVisible = true" width="20px" src="@/assets/view/editbai.png" alt="">
                        <img width="20px" @click="handleDelet(1)" src="@/assets/view/deletebai.png" alt="">
                    </div>
                </div>
                <div class="cardAdd" @click="handleAdd(1)">
                    <img width="10" src="@/assets/view/add.png" alt="">
                    添加
                </div>
            </div>
            <div class="cardSuperior">
                <div class="questionCardTitle">
                    <div>
                        <img width="15px" src="@/assets/view/eye.png" alt="">
                        要素层问题
                        <img @click="dialogVisible = true" width="15px" src="@/assets/view/edit.png" alt="">
                    </div>
                    <span>以 “要素” 为核心，将课程教学内容分解为关键组成要素</span>
                </div>
                <div ref="centerRef" class="card center" v-for="item in centerData">
                    <h3>{{ item.problem }}</h3>
                    <p>{{ item.text }}</p>
                    <div>
                        <img width="20px" src="@/assets/view/eyebai.png" alt="">
                        <img @click="dialogVisible = true" width="20px" src="@/assets/view/editbai.png" alt="">
                        <img width="20px" @click="handleDelet(2)" src="@/assets/view/deletebai.png" alt="">
                    </div>
                </div>
                <div class="cardAdd" @click="handleAdd(2)">
                    <img width="10" src="@/assets/view/add.png" alt="">
                    添加
                </div>
            </div>

            <div class="cardSuperior">
                <div class="questionCardTitle">
                    <div>
                        <img width="15px" src="@/assets/view/eye.png" alt="">
                        应用层问题
                        <img @click="dialogVisible = true" width="15px" src="@/assets/view/edit.png" alt="">
                    </div>
                    <span>以 “应用” 为核心，将课程教学内容分解为实际场景中的运用环节</span>
                </div>
                <div ref="rightRef" class="card right" v-for="item in rightData">
                    <h3>{{ item.problem }}</h3>
                    <p>{{ item.text }}</p>
                    <div>
                        <img width="20px" src="@/assets/view/eyebai.png" alt="">
                        <img @click="dialogVisible = true" width="20px" src="@/assets/view/editbai.png" alt="">
                        <img width="20px" @click="handleDelet(3)" src="@/assets/view/deletebai.png" alt="">
                    </div>
                </div>
                <div class="cardAdd" @click="handleAdd(3)">
                    <img width="10" src="@/assets/view/add.png" alt="">
                    添加
                </div>
            </div>


            <div v-for="(anchor, key) in anchors" :key="key" @pointerdown.prevent="startLink($event, key)"
                :style="{ left: anchor.x - 8 + 'px', top: anchor.y - 8 + 'px' }" class="anchor"
                :title="`从此处拖动以创建连接 (${key})`"></div>

        </div>
        <el-dialog v-model="dialogVisible" title="编辑" width="500" :before-close="handleClose">
            <div>
                名称： <el-input placeholder="请输入名称"></el-input>
            </div>
            <div>
                描述： <el-input placeholder="请输入描述"></el-input>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import router from '@/router'
import { ref, reactive, onMounted, onUnmounted, nextTick, computed } from 'vue'
const dialogVisible = ref(false)
const containerRef = ref(null)
const canvasRef = ref(null)
const leftRef = ref(null)
const centerRef = ref(null)
const rightRef = ref(null)
const isLinking = ref(false)
const linkStart = ref(null)
const isRelease = ref(false)
const pointerPos = ref({ x: 0, y: 0 })
let rafId
const handleClose = () => {
    dialogVisible.value = false
}
const leftData = ref([
    {
        problem: '问题1',
        text: '这是左侧卡片内容。这是左侧卡片内容。这是左侧卡片内这是左侧卡片内容。这是左侧卡片内容。这是左侧卡片内容。这是左侧卡片内容。'
    },
])
const centerData = ref([
    {
        problem: '问题2',
        text: '这是左侧卡片内容。这是左侧卡片内容。这是左侧卡片内这是左侧卡片内容。这是左侧卡片内容。这是左侧卡片内容。这是左侧卡片内容。'
    },
])
const rightData = ref([
    {
        problem: '问题3',
        text: '这是左侧卡片内容。这是左侧卡片内容。这是左侧卡片内这是左侧卡片内容。这是左侧卡片内容。这是左侧卡片内容。这是左侧卡片内容。'
    },
])
const length = computed(() => leftData.value.length + centerData.value.length + rightData.value.length)
let anchors = reactive(
    Array.from({ length: length.value }, () => ({ x: 0, y: 0 }))
)
console.log(anchors)
const handleAdd = (item) => {
    if (item === 1) {
        leftData.value.push({
            problem: '问题1',
            text: '这是左侧卡片内容。这是左侧卡片内容。这是左侧卡片内这是左侧卡片内容。这是左侧卡片内容。这是左侧卡片内容。这是左侧卡片内容。'
        })
    } else if (item === 2) {
        centerData.value.push({
            problem: '问题2',
            text: '这是左侧卡片内容。这是左侧卡片内容。这是左侧卡片内这是左侧卡片内容。这是左侧卡片内容。这是左侧卡片内容。这是左侧卡片内容。'
        })
    } else if (item === 3) {
        rightData.value.push({
            problem: '问题3',
            text: '这是左侧卡片内容。这是左侧卡片内容。这是左侧卡片内这是左侧卡片内容。这是左侧卡片内容。这是左侧卡片内容。这是左侧卡片内容。'
        })
    }

    count = 0
    nextTick(() => {
        resetAnchors()
        resizeCanvas()
    })
}

const handleDelet = (item) => {
    if (item === 1) {
        leftData.value.pop()
    } else if (item === 2) {
        centerData.value.pop()
    } else if (item === 3) {
        rightData.value.pop()
    }

    count = 0
    setTimeout(() => {
        resetAnchors()
        resizeCanvas()
    })
}
// 存储已建立的连线，每项 {from: 'a', to: 'b'}
const connections = reactive([])

function getOffset(el) {
    const r = el.getBoundingClientRect()
    return { left: r.left + window.scrollX, top: r.top + window.scrollY }
}

function toLocalCoord(pageX, pageY) {
    const container = containerRef.value
    const off = getOffset(container)
    return { x: pageX - off.left, y: pageY - off.top }
}
const toHot = () => {
    router.push('/IssueKnowledgeHot')
}
let count = 0

function resetAnchors() {
    
    const container = containerRef.value
    if (!container || !leftRef.value || !centerRef.value || !rightRef.value) return
    const cOff = getOffset(container)
    const leftRect = leftRef.value
    const centerRect = centerRef.value
    const rightRect = rightRef.value
    console.log({leftRect,centerRect,rightRect,anchors})
    const len = Math.max(leftRect.length, centerRect.length, rightRect.length)

    for (let i = 0; i < len; i++) {

        if (leftRect[i]) {
            const left = leftRect[i].getBoundingClientRect()
            anchors[count++] = { x: left.right - cOff.left, y: left.top + left.height / 2 - cOff.top }
        }

        if (centerRect[i]) {
            const center = centerRect[i].getBoundingClientRect()
            anchors[count++] = { x: center.right - cOff.left, y: center.top + center.height / 2 - cOff.top }
            anchors[count++] = { x: center.left - cOff.left, y: center.top + center.height / 2 - cOff.top }
        }

        if (rightRect[i]) {
            const right = rightRect[i].getBoundingClientRect()
            anchors[count++] = { x: right.left - cOff.left, y: right.top + right.height / 2 - cOff.top }
        }
    }
    // for (let left of leftRect) {
    //     left = left.getBoundingClientRect()
    //     anchors[count++] = { x: left.right - cOff.left, y: left.top + left.height / 2 - cOff.top }
    // }

    // for (let center of centerRect) {
    //     center = center.getBoundingClientRect()
    //     anchors[count++] = { x: center.right - cOff.left, y: center.top + center.height / 2 - cOff.top }
    //     anchors[count++] = { x: center.left - cOff.left, y: center.top + center.height / 2 - cOff.top }
    // }

    // for (let right of rightRect) {
    //     right = right.getBoundingClientRect()
    //     anchors[count++] = { x: right.left - cOff.left, y: right.top + right.height / 2 - cOff.top }
    // }

    //     anchors.b = { x: leftRect.right - cOff.left, y: leftRect.top + leftRect.height / 2 - cOff.top }
    //     anchors.a = { x: centerRect.left - cOff.left, y: centerRect.top + centerRect.height / 2 - cOff.top }
    //     anchors.c = { x: centerRect.right - cOff.left, y: centerRect.top + centerRect.height / 2 - cOff.top }
    //     anchors.d = { x: rightRect.left - cOff.left, y: rightRect.top + rightRect.height / 2 - cOff.top }
}

//画线
function drawCurve(ctx, from, to) {
    // 计算中点
    const midX = (from.x + to.x) / 2
    const midY = (from.y + to.y) / 2

    // 控制弧度（弯曲程度），值越大弧越大
    const offset = Math.abs(to.x - from.x) * 0.2

    // --- 画箭头 ---
    const arrowLength = 12  // 箭头长度
    const arrowAngle = Math.PI / 6  // 箭头角度 30°

    // 对二次贝塞尔曲线，切线公式：B'(t) = 2*(1-t)*(P1-P0) + 2*t*(P2-P1)
    const t = 1  // 终点
    const dx = 2 * (1 - t) * (midX - from.x) + 2 * t * (to.x - midX)
    const dy = 2 * (1 - t) * (midY + offset - from.y) + 2 * t * (to.y - (midY + offset))
    const angle = Math.atan2(dy, dx)

    // 箭头两条边
    const x1 = to.x - arrowLength * Math.cos(angle - arrowAngle)
    const y1 = to.y - arrowLength * Math.sin(angle - arrowAngle)
    const x2 = to.x - arrowLength * Math.cos(angle + arrowAngle)
    const y2 = to.y - arrowLength * Math.sin(angle + arrowAngle)

    const midArrowX = (x1 + x2) / 2
    const midArrowY = (y1 + y2) / 2

    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.quadraticCurveTo(midX, midY + offset, midArrowX - 10, midArrowY)
    ctx.lineWidth = 3
    ctx.strokeStyle = '#6b46c1'
    ctx.lineCap = 'round'
    ctx.stroke()


    ctx.beginPath()
    ctx.moveTo(to.x - 10, to.y)
    ctx.lineTo(x1 - 10, y1)
    ctx.lineTo(x2 - 10, y2)
    ctx.lineTo(to.x - 10, to.y)
    ctx.fillStyle = '#6b46c1'
    ctx.fill()
}

function draw() {
    const canvas = canvasRef.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 画已有的连线
    for (const conn of connections) {
        const from = anchors[conn.from]
        const to = anchors[conn.to]
        if (from && to) drawCurve(ctx, from, to)
    }

    // 如果正在拖拽，画一条临时线从起点到指针位置
    // if (isLinking.value && linkStart.value) {
    const from = anchors[linkStart.value]
    const to = pointerPos.value
    if (from && to) {
        // 半透明样式用于临时线
        const distX = Math.abs(to.x - from.x)
        const cpOffset = Math.max(40, distX * 0.5)
        const cp1 = { x: from.x + cpOffset, y: from.y }
        const cp2 = { x: to.x - cpOffset, y: to.y }

        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, to.x, to.y)
        ctx.lineWidth = 2
        ctx.strokeStyle = 'rgba(107,70,193,0.6)'
        ctx.setLineDash([6, 6])
        ctx.stroke()
        ctx.setLineDash([])
    }
    // }
}

function resizeCanvas() {
    const canvas = canvasRef.value
    const container = containerRef.value
    if (!canvas || !container) return
    const rect = container.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function loop() {
    draw()
    rafId = requestAnimationFrame(loop)
}

// 开始从某个锚点拖动（用于创建连接）
function startLink(e, id) {
    isLinking.value = true
    linkStart.value = id
    const p = toLocalCoord(e.pageX, e.pageY)
    pointerPos.value = p
}


onMounted(() => {
    resizeCanvas()
    resetAnchors()
    loop()

    // const onResize = () => {
    //     resizeCanvas()
    //     resetAnchors()
    // }
    // window.addEventListener('resize', onResize)

    const onPointerMove = (e) => {
        if (!isLinking.value) return
        const p = toLocalCoord(e.pageX, e.pageY)
        pointerPos.value = p
    }

    const onPointerUp = (e) => {
        if (!isLinking.value) return
        const p = toLocalCoord(e.pageX, e.pageY)
        console.log('22222222222222222222222222222', p)
        // 找到离释放点最近的锚点（排除自己
        const keys = Object.keys(anchors)
        console.log('11111111111111', keys)
        let nearest = null
        let minDist = Infinity
        for (const k of keys) {
            if (k === linkStart.value) continue
            const a = anchors[k]
            const dx = a.x - p.x
            const dy = a.y - p.y
            const d2 = dx * dx + dy * dy
            if (d2 < minDist) {
                minDist = d2
                nearest = k
            }
        }
        const threshold = 24 * 24 // 24px 距离内视为连接成功
        if (nearest && minDist <= threshold) {
            // 检查是否已存在相同连线（无向）
            const exist = connections.some(c => (c.from === linkStart.value && c.to === nearest) || (c.from === nearest && c.to === linkStart.value))
            if (!exist) {
                connections.push({ from: linkStart.value, to: nearest })
            }
        }

        isLinking.value = false
        linkStart.value = null
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    onUnmounted(() => {
        window.removeEventListener('resize', onResize)
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerup', onPointerUp)
        cancelAnimationFrame(rafId)
    })
})
</script>

<style scoped>
.container {
    width: 100%;
    padding: 24px;
}

.canvas-container {
    position: relative;
    height: 100%;
    width: 100%;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
}

.canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.cardSuperior {
    /* position: absolute; */
    margin: 0 100px;

    .cardAdd {
        margin-top: 10px;
        border: #5471ff 2px solid;
        color: #5471ff;
        text-align: center;
        width: 300px;
        border-radius: 5px;
        cursor: pointer;
    }

    .questionCardTitle {
        display: flex;
        flex-direction: column;
        /* position: absolute; */
        color: #000;
        /* bottom: 40px; */
        /* top: -50px; */

        img {
            margin-right: 5px;
            margin-top: 5px;
            cursor: pointer;
        }

        span {
            font-size: 12px;
            margin-bottom: 20px;
        }
    }

    .card {
        width: 300px;
        padding: 16px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        color: #fff;
        margin-bottom: 10px;

        div {
            text-align: end;
            cursor: pointer;

            img {
                margin: 0 8px;
            }
        }

        /* background: linear-gradient(to bottom right, #faf5ff, #ede9fe); */
    }
}

.card h3 {
    font-size: 16px;
    font-weight: bold;
}

.card p {
    font-size: 14px;
    margin-top: 8px;
}

.left {
    background-color: #0037a1;
}

.center {
    background-color: #00a167;
}

.right {
    background-color: #fa6da9;
}

.anchor {
    position: absolute;
    width: 16px;
    height: 16px;
    border: 2px solid #fff;
    border-radius: 50%;
    background: #6b46c1;
    cursor: grab;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}


.buttons button {
    padding: 6px 12px;
    background: #6b46c1;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
}

.buttons button:hover {
    background: #553c9a;
}
</style>
