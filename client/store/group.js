import { defineStore } from "pinia";
import http, { unwrapResponse } from "../services/http";

export const useGroupStore = defineStore("group", {
  state: () => ({
    currentGroup: null,
    groupList: [],
    memberList: [],
  }),

  getters: {
    groupId: (state) => state.currentGroup?._id,
    groupName: (state) => state.currentGroup?.group_name || "",
    roleInGroup: (state) => {
      // 从当前分组的成员列表中查找当前用户的角色
      if (!state.currentGroup || !state.memberList) return "";
      // 如果分组数据中直接包含 role 字段
      if (state.currentGroup.role) return state.currentGroup.role;
      return "";
    },
  },

  actions: {
    async fetchGroup(groupId) {
      try {
        const res = await http.get("/api/group/get", { params: { id: groupId } });
        const data = unwrapResponse(res, "获取组信息失败");
        this.currentGroup = data;
        return data;
      } catch (e) {
        console.error("获取组信息失败", e);
      }
      return null;
    },

    async fetchGroupList() {
      try {
        const res = await http.get("/api/group/list");
        const data = unwrapResponse(res, "获取组列表失败");
        this.groupList = data;
        return data;
      } catch (e) {
        console.error("获取组列表失败", e);
      }
      return [];
    },

    async addGroup(data) {
      const res = await http.post("/api/group/add", data);
      unwrapResponse(res, "添加组失败");
      await this.fetchGroupList();
      return res.data;
    },

    async updateGroup(groupId, data) {
      const res = await http.put("/api/group/up", { id: groupId, ...data });
      unwrapResponse(res, "更新组失败");
      if (this.currentGroup && this.currentGroup._id === groupId) {
        this.currentGroup = { ...this.currentGroup, ...data };
      }
      return res.data;
    },

    async addMember(groupId, memberData) {
      const res = await http.post("/api/group/add_member", {
        id: groupId,
        ...memberData,
      });
      unwrapResponse(res, "添加成员失败");
      await this.fetchGroup(groupId);
      return res.data;
    },

    async removeMember(groupId, uid) {
      const res = await http.post("/api/group/del_member", {
        id: groupId,
        uid,
      });
      unwrapResponse(res, "移除成员失败");
      await this.fetchGroup(groupId);
      return res.data;
    },

    async fetchMemberList(groupId) {
      try {
        const res = await http.get("/api/group/getMemberList", { params: { id: groupId } });
        const data = unwrapResponse(res, "获取成员列表失败");
        this.memberList = data;
        return data;
      } catch (e) {
        console.error("获取成员列表失败", e);
      }
      return [];
    },
  },
});
