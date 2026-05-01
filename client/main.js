import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import naive from "naive-ui";

// 导入全局样式
import "./styles/common.scss";
import "./styles/theme.less";

const app = createApp(App);

// 使用 Pinia 状态管理
app.use(createPinia());

// 使用 Vue Router
app.use(router);

// 使用 Naive UI
app.use(naive);

// 挂载应用
app.mount("#app");

console.log("YAPI Plus - Vue 3 版本启动成功");
