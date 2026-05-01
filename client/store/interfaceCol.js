import { defineStore } from "pinia";
import http, { unwrapResponse } from "../services/http";

export const useInterfaceColStore = defineStore("interfaceCol", {
  state: () => ({
    colList: [],
    currentCol: null,
    caseList: [],
    isShowCol: false,
  }),

  getters: {
    currentColId: (state) => state.currentCol?._id,
  },

  actions: {
    setColData(data) {
      if (data.isShowCol !== undefined) {
        this.isShowCol = data.isShowCol;
      }
      if (data.colList) {
        this.colList = data.colList;
      }
      if (data.currentCol) {
        this.currentCol = data.currentCol;
      }
      if (data.caseList) {
        this.caseList = data.caseList;
      }
    },

    async fetchColList(projectId) {
      try {
        const res = await http.get("/api/interfaceCol/list", { params: { project_id: projectId } });
        const data = unwrapResponse(res, "获取集合列表失败");
        this.colList = data;
        return data;
      } catch (e) {
        console.error("获取集合列表失败", e);
      }
      return [];
    },

    async fetchCaseList(colId) {
      try {
        const res = await http.get("/api/interfaceCol/getCaseList", { params: { col_id: colId } });
        const data = unwrapResponse(res, "获取用例列表失败");
        this.caseList = data;
        return data;
      } catch (e) {
        console.error("获取用例列表失败", e);
      }
      return [];
    },

    async addCol(projectId, data) {
      const res = await http.post("/api/interfaceCol/add", {
        project_id: projectId,
        ...data,
      });
      unwrapResponse(res, "添加集合失败");
      await this.fetchColList(projectId);
      return res.data;
    },

    async updateCol(colId, data) {
      const res = await http.put("/api/interfaceCol/up", { id: colId, ...data });
      unwrapResponse(res, "更新集合失败");
      const index = this.colList.findIndex((c) => c._id === colId);
      if (index !== -1) {
        this.colList[index] = { ...this.colList[index], ...data };
      }
      return res.data;
    },

    async deleteCol(colId, projectId) {
      const res = await http.delete("/api/interfaceCol/del", { data: { id: colId } });
      unwrapResponse(res, "删除集合失败");
      await this.fetchColList(projectId);
      return res.data;
    },

    async addCase(colId, data) {
      const res = await http.post("/api/interfaceCase/add", {
        col_id: colId,
        ...data,
      });
      unwrapResponse(res, "添加用例失败");
      await this.fetchCaseList(colId);
      return res.data;
    },

    async updateCase(caseId, data) {
      const res = await http.put("/api/interfaceCase/up", { id: caseId, ...data });
      unwrapResponse(res, "更新用例失败");
      const index = this.caseList.findIndex((c) => c._id === caseId);
      if (index !== -1) {
        this.caseList[index] = { ...this.caseList[index], ...data };
      }
      return res.data;
    },

    async deleteCase(caseId, colId) {
      const res = await http.delete("/api/interfaceCase/del", { data: { id: caseId } });
      unwrapResponse(res, "删除用例失败");
      await this.fetchCaseList(colId);
      return res.data;
    },

    async runCases(colId) {
      const res = await http.post("/api/interfaceCol/run", { col_id: colId });
      return unwrapResponse(res, "运行失败");
    },

    setCurrentCol(col) {
      this.currentCol = col;
    },
  },
});
