import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/about",
      name: "about",
      component: () => import("../views/View.vue"),
    },
    {
      path: "/ces",
      name: "ces",
      component: () => import("../views/ces.vue"),
    },
    {
      path: "/positionSpectrum",
      name: "PositionSpectrum",
      component: () => import("../views/positionSpectrum.vue"),
    },
    {
      path: "/issueKnowledge",
      name: "IssueKnowledge",
      component: () => import("../views/IssueKnowledge.vue"),
    },
        {
      path: "/issueKnowledgeHot",
      name: "IssueKnowledgeHot",
      component: () => import("../views/IssueKnowledgeHot.vue"),
    },
  ],
});

export default router;
