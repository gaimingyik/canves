<template>
    <div class="container">
        <canvas ref="canvas" class="canvas"></canvas>

        <!-- 父节点 -->
        <div class="node parent" :style="{ left: parent.x + 'px', top: parent.y + 'px' }"
            @pointerdown.prevent="startDrag($event, 'parent')">
            <div>父节点</div>
            <div>这是左侧卡片内容。这是左侧卡片内容。这是左侧卡片内这是左侧卡片内容。这是左侧卡片内容。这是左侧卡片内容。这是左侧卡片内容。</div>
        </div>

        <!-- 子节点 A -->
        <div class="node child" :style="{ left: childA.x + 'px', top: childA.y + 'px' }"
            @pointerdown.prevent="startDrag($event, 'childA')">
            <div class="">子节点</div>
            <div>
                子节点A子节点A子节点A子节点A子节点A子节点A子节点A子节点A子节点A子节点A子节点A子节点A子节点A子节点A子节点A子节点A子节点A子节点A子节点A子节点A子节点A子节点A子节点A子节点A子节点A子节点A
            </div>
        </div>

        <!-- 子节点 B -->
        <div class="node child" :style="{ left: childB.x + 'px', top: childB.y + 'px' }"
            @pointerdown.prevent="startDrag($event, 'childB')">
            <div>子节点</div>
            <div>子节点B子节点B子节点B子节点B子节点B子节点B子节点B子节点B子节点B子节点B子节点B子节点B子节点B子节点B子节点B子节点B子节点B子节点B</div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const canvas = ref(null);

// 三个节点的位置
const parent = ref({ x: 300, y: 200 });
const childA = ref({ x: 700, y: 150 });
const childB = ref({ x: 700, y: 400 });

let dragging = null;
let offsetX = 0;
let offsetY = 0;

const nodes = { parent, childA, childB };

// 画连线函数（用二次贝塞尔曲线，稍微弯一点）
function drawConnections() {
    const ctx = canvas.value.getContext("2d");
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

    drawCurve(ctx, parent.value, childA.value);
    drawCurve(ctx, parent.value, childB.value);
}

// 绘制曲线函数（下弧线）
function drawCurve(ctx, from, to) {
    const fromX = from.x + 50;
    const fromY = from.y + 25;
    const toX = to.x + 50;
    const toY = to.y + 25;

    const midX = (fromX + toX) / 2;
    const midY = Math.max(fromY, toY) + 40; // 控制弯曲程度

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.quadraticCurveTo(midX, midY, toX, toY);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#6b46c1";
    ctx.lineCap = "round";
    ctx.stroke();
}

// 拖拽逻辑
function startDrag(e, key) {
    dragging = key;
    offsetX = e.clientX - nodes[key].value.x;
    offsetY = e.clientY - nodes[key].value.y;
    window.addEventListener("pointermove", onDrag);
    window.addEventListener("pointerup", stopDrag);
}

function onDrag(e) {
    if (!dragging) return;
    const node = nodes[dragging].value;
    node.x = e.clientX - offsetX;
    node.y = e.clientY - offsetY;
    drawConnections();
}

function stopDrag() {
    dragging = null;
    window.removeEventListener("pointermove", onDrag);
    window.removeEventListener("pointerup", stopDrag);
}

onMounted(() => {
    const ctx = canvas.value.getContext("2d");
    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight;
    drawConnections();
    window.addEventListener("resize", () => {
        canvas.value.width = window.innerWidth;
        canvas.value.height = window.innerHeight;
        drawConnections();
    });
});

onBeforeUnmount(() => {
    window.removeEventListener("pointermove", onDrag);
    window.removeEventListener("pointerup", stopDrag);
});
</script>

<style>
.container {
    position: relative;
    width: 100vw;
    height: 100vh;
    background: #f5f3ff;
    overflow: hidden;
}

.canvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}

.node {
    position: absolute;
    width: 300px;
    padding: 15px;
    background: white;
    /* border: 2px solid #6b46c1; */
    border-radius: 10px;
    color: #fff;
    /* display: flex; */
    align-items: center;
    justify-content: center;
    user-select: none;
    z-index: 2;
    cursor: grab;
    box-shadow: 0 4px 10px rgba(107, 70, 193, 0.3);
}

.node:active {
    cursor: grabbing;
}

.parent {
    background: #0037a1;
}

.child {
    background: #00a167;
}
</style>
