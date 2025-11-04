<template>
  <div class="mobile-container">
    <div class="course-section">
      <h1 class="course-title">课程名称课程名称</h1>
    </div>

    <div class="activity-section">
      <div class="activity-header">
        <span class="activity-title">活动</span>
            <img class="icon" src="@/assets/slices/activity.png" alt=""></img>
      </div>
    </div>

    <div class="activity-list">
      <div 
        v-for="(item,index) in activityItems" 
        :key="item.id"
        class="activity-item"
        @click="handleItemClick(item)"
      >
        <div class="item-icon">
          <img class="icon-img" :src="item.url" alt="">
        </div>
        <div class="item-content">
          <div class="item-title">{{ item.title }}</div>
          <div class="item-time">{{ item.time }}</div>
        </div>
        <div class="item-arrow">
          <svg v-if="index !== activityItems.length-1" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import regularCheck from '@/assets/slices/regular-check.png'
import codeCheck from '@/assets/slices/code-check.png'
import signCode from '@/assets/slices/sign-code.png'
import gesture from '@/assets/slices/gesture.png'
import vote from '@/assets/slices/vote.png'
import candidate from '@/assets/slices/candidate.png'
import discuss from '@/assets/slices/discuss.png'
import questionnaire from '@/assets/slices/questionnaire.png'
import timer from '@/assets/slices/timer.png'
import quickResponse from '@/assets/slices/quick-response.png'
import draw from '@/assets/slices/draw.png'

const activityItems = ref([
  { id: 1, title: '普通签到', time: '2025-03-01 09:12:21', url: regularCheck },
  { id: 2, title: '二维码签到', time: '2025-03-01 09:12:21', url: codeCheck },
  { id: 3, title: '签到码签到', time: '2025-03-01 09:12:21', url: signCode },
  { id: 4, title: '手势签到', time: '2025-03-01 09:12:21', url: gesture },
  { id: 5, title: '投票', time: '2025-03-01 09:12:21', url: vote },
  { id: 6, title: '选人', time: '2025-03-01 09:12:21', url: candidate },
  { id: 7, title: '主题讨论', time: '2025-03-01 09:12:21', url: discuss },
  { id: 8, title: '问卷', time: '2025-03-01 09:12:21', url: questionnaire },
  { id: 9, title: '计时器', time: '2025-03-01 09:12:21', url: timer },
  { id: 10, title: '抢答', time: '2025-03-01 09:12:21', url: quickResponse },
  { id: 11, title: '抽签', time: '2025-03-01 09:12:21', url: draw }
])



const handleItemClick = (item) => {
  console.log('Clicked item:', item.title)
}
</script>

<style scoped>
.mobile-container {
  width: 100vw;
  margin: 0;
  background-color: #f4fcff;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 5.33vw 0 0;
}

.course-section {
  margin: 5vh 4.27vw 2.67vw;
}

.course-title {
  font-size: 3.8vw;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.4;
}

.activity-section {
  padding: 3.27vw;
  padding-bottom: 1vw;
  margin: 0 4vw 1.67vw;
  border-radius: 2.13vw;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-title {
  font-size: 6.4vw;
  font-weight: 600;
  color: #333;
  position: relative;
  left: 4vw;
  z-index: 1;
}

.icon {
  width: 91vw;
  height: 13vw;
  position: absolute;
  left: 4vw;
}

.activity-list {
  margin: 2.67vw 4.27vw 0;
  border-radius: 2.13vw;
  overflow: hidden;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 4.27vw;
  border: 1px solid #edf1f2;
  border-radius: 4vw;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 5vw;
}

.activity-item:hover {
  background-color: #fafafa;
}

.activity-item:last-child {
  border-bottom: none;
}

.item-icon {
  width: 10.67vw;
  height: 10.67vw;
  border-radius: 2.13vw;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 3.2vw;
  flex-shrink: 0;
}

.icon-img {
  width: 11vw;
  height: 11vw;
  margin-right:2vw
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 4.27vw;
  font-weight: 500;
  color: #333;
  margin-bottom: 1.07vw;
  line-height: 1.3;
}

.item-time {
  font-size: 3.47vw;
  color: #999;
  line-height: 1.2;
}

.item-arrow {
  margin-left: 2.13vw;
  flex-shrink: 0;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}
</style>