<template>
  <div class="canvas-container">
    <canvas ref="canvas" width="900" height="500"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const canvas = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  column: number;
  color: string;
}

let boxes: Box[] = [];
let connections: [Box, Box][] = [];
let activeBox: Box | null = null;

function drawBox(box: Box) {
  ctx!.fillStyle = box.color;
  ctx!.fillRect(box.x, box.y, box.width, box.height);
  ctx!.strokeStyle = "black";
  ctx!.strokeRect(box.x, box.y, box.width, box.height);
  ctx!.fillStyle = "black";
  ctx!.font = "14px sans-serif";
  ctx!.fillText(box.label, box.x + 10, box.y + 25);
}

function drawArrow(from: Box, to: Box, highlighted: boolean) {
  const startX = from.x + from.width;
  const startY = from.y + from.height / 2;
  const endX = to.x;
  const endY = to.y + to.height / 2;

  ctx!.beginPath();
  ctx!.strokeStyle = highlighted ? "#ff6600" : "#ccc";
  ctx!.lineWidth = highlighted ? 3 : 1.5;

  // 贝塞尔曲线
  ctx!.moveTo(startX, startY);
  const midX = (startX + endX) / 2;
  ctx!.bezierCurveTo(midX, startY, midX, endY, endX, endY);
  ctx!.stroke();

  // 箭头
  const angle = Math.atan2(endY - startY, endX - startX);
  ctx!.fillStyle = highlighted ? "#ff6600" : "#ccc";
  ctx!.beginPath();
  ctx!.moveTo(endX, endY);
  ctx!.lineTo(endX - 8 * Math.cos(angle - 0.3), endY - 8 * Math.sin(angle - 0.3));
  ctx!.lineTo(endX - 8 * Math.cos(angle + 0.3), endY - 8 * Math.sin(angle + 0.3));
  ctx!.closePath();
  ctx!.fill();
}

function render() {
  ctx!.clearRect(0, 0, canvas.value!.width, canvas.value!.height);

  // 绘制连线
  connections.forEach(([from, to]) => {
    const highlighted = activeBox && (from === activeBox || to === activeBox);
    drawArrow(from, to, !!highlighted);
  });

  // 绘制方块
  boxes.forEach((box) => {
    if (activeBox && box !== activeBox) {
      box.color = "#ddd";
    } else if (box === activeBox) {
      box.color = "#ffebcc";
    } else {
      box.color = "#aaddff";
    }
    drawBox(box);
  });
}

function handleClick(e: MouseEvent) {
  const rect = canvas.value!.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  activeBox = null;
  for (const box of boxes) {
    if (x > box.x && x < box.x + box.width && y > box.y && y < box.y + box.height) {
      activeBox = box;
      break;
    }
  }
  render();
}

onMounted(() => {
  ctx = canvas.value!.getContext("2d");

  const colWidth = 250;
  const boxHeight = 60;

  // 三列矩形
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      boxes.push({
        x: 80 + i * colWidth,
        y: 80 + j * 100,
        width: 120,
        height: boxHeight,
        label: `Box ${i + 1}-${j + 1}`,
        column: i,
        color: "#aaddff",
      });
    }
  }

  // 建立简单连线关系
  connections = [
    [boxes[0], boxes[3]],
    [boxes[3], boxes[6]],
    [boxes[1], boxes[4]],
    [boxes[4], boxes[7]],
    [boxes[2], boxes[5]],
    [boxes[5], boxes[8]],
  ];

  render();
  canvas.value!.addEventListener("click", handleClick);
});
</script>

<style scoped>
.canvas-container {
  width: 100%;
  overflow-x: auto;
  overflow-y: auto;
  border: 1px solid #ccc;
}
canvas {
  background-color: #fff;
}
</style>
