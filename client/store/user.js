import { defineStore } from "pinia";
import http, { unwrapResponse } from "../services/http";

export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo: null,
    loginState: 0,
    userFetchedAt: 0,
    userFetchPromise: null,
  }),

  getters: {
    username: (state) => state.userInfo?.username || "",
    uid: (state) => state.userInfo?.uid || null,
    email: (state) => state.userInfo?.email || "",
    role: (state) => state.userInfo?.role || "",
  },

  actions: {
    setUser(userData) {
      this.userInfo = userData;
      this.loginState = userData && userData.uid ? 1 : 0;
      this.userFetchedAt = this.loginState ? Date.now() : 0;
    },

    clearUser() {
      this.userInfo = null;
      this.loginState = 0;
      this.userFetchedAt = 0;
      this.userFetchPromise = null;
    },

    async login(email, password) {
      const res = await http.post("/api/user/login", { email, password });
      const data = unwrapResponse(res, "登录失败");
      this.setUser(data);
      return res.data;
    },

    async logout() {
      try {
        await http.post("/api/user/logout");
      } catch (e) {
        console.error("登出请求失败", e);
      }
      this.clearUser();
    },

    async fetchUserInfo(options = {}) {
      const { force = false, maxAgeMs = 5 * 60 * 1000 } = options;
      if (!force && this.userInfo && Date.now() - this.userFetchedAt < maxAgeMs) {
        return this.userInfo;
      }
      if (!force && this.userFetchPromise) {
        return this.userFetchPromise;
      }

      this.userFetchPromise = (async () => {
        try {
          // 使用 /api/user/status 接口获取当前用户信息
          const res = await http.get("/api/user/status");
          const data = unwrapResponse(res, "获取用户信息失败");
          this.setUser(data);
          return data;
        } catch (e) {
          console.error("获取用户信息失败", e);
          this.clearUser();
          return null;
        } finally {
          this.userFetchPromise = null;
        }
      })();

      try {
        return await this.userFetchPromise;
      } catch (e) {
        return null;
      }
    },

    async updateUserInfo(data) {
      const res = await http.put("/api/user/update", data);
      unwrapResponse(res, "更新失败");
      this.setUser({ ...this.userInfo, ...data });
      return res.data;
    },

    isAdmin() {
      return this.role === "admin";
    },
  },
});
