<template>
  <div class="canvas-container" ref="container">
    <canvas ref="canvas" width="900" height="500"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const canvas = ref<HTMLCanvasElement | null>(null);
const container = ref<HTMLDivElement | null>(null);

interface Node {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  column: number;
  parentId?: string;
}

let nodes: Node[] = [];
let draggingLine = false;
let startNode: Node | null = null;
let mouseX = 0;
let mouseY = 0;
let ctx: CanvasRenderingContext2D | null = null;

const createNodes = () => {
  const cols = 3;
  const spacing = 140;
  for (let c = 0; c < cols; c++) {
    for (let i = 0; i < 5; i++) {
      nodes.push({
        id: `${c}-${i}`,
        x: 100 + c * spacing,
        y: 50 + i * 80,
        width: 100,
        height: 40,
        column: c
      });
    }
  }
};

const drawNode = (node: Node) => {
  if (!ctx) return;
  ctx.fillStyle = "#f0f0f0";
  ctx.strokeStyle = "#666";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.rect(node.x, node.y, node.width, node.height);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#000";
  ctx.font = "14px sans-serif";
  ctx.fillText(node.id, node.x + 10, node.y + 25);
};

const drawConnection = (from: Node, to: Node) => {
  if (!ctx) return;
  const startX = from.x + from.width;
  const startY = from.y + from.height / 2;
  const endX = to.x;
  const endY = to.y + to.height / 2;
  const cp1X = startX + (endX - startX) / 2;
  const cp1Y = startY;
  const cp2X = startX + (endX - startX) / 2;
  const cp2Y = endY;

  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
  ctx.strokeStyle = "#00aaff";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.setLineDash([]);
};

const drawAll = () => {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height);

  // Draw connections first
  nodes.forEach(n => {
    if (n.parentId) {
      const parent = nodes.find(p => p.id === n.parentId);
      if (parent) drawConnection(parent, n);
    }
  });

  // Draw all nodes
  nodes.forEach(drawNode);

  // Draw dragging line
  if (draggingLine && startNode) {
    const startX = startNode.x + startNode.width;
    const startY = startNode.y + startNode.height / 2;
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

  requestAnimationFrame(drawAll);
};

const findNodeAt = (x: number, y: number): Node | null => {
  return nodes.find(
    n => x >= n.x && x <= n.x + n.width && y >= n.y && y <= n.y + n.height
  ) || null;
};

const handleMouseDown = (e: MouseEvent) => {
  const rect = canvas.value!.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const node = findNodeAt(x, y);
  if (node) {
    startNode = node;
    draggingLine = true;
  }
};

const handleMouseMove = (e: MouseEvent) => {
  const rect = canvas.value!.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
};

const handleMouseUp = (e: MouseEvent) => {
  if (!draggingLine || !startNode) return;
  const rect = canvas.value!.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const target = findNodeAt(x, y);
  if (target && target.id !== startNode.id) {
    target.parentId = startNode.id;
  }
  draggingLine = false;
  startNode = null;
};

onMounted(() => {
  ctx = canvas.value!.getContext("2d");
  createNodes();
  drawAll();

  canvas.value!.addEventListener("mousedown", handleMouseDown);
  canvas.value!.addEventListener("mousemove", handleMouseMove);
  canvas.value!.addEventListener("mouseup", handleMouseUp);
});
</script>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #fff;
  border: 1px solid #ddd;
}
canvas {
  cursor: crosshair;
}
</style>
