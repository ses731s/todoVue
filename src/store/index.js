import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("user-token") || "",
    userType: localStorage.getItem("user-type") || ""
  },
  mutations: {
    assignToken(state, token) {
      state.token = token;
    },

    assignUser(state, userType) {
      state.userType = userType;
    }
  },
  actions: {
    assignToken({ commit }, token) {
      commit("assignToken", token);
    },
    assignUser({ commit }, userType) {
      commit("assignUser", userType);
    }
  },
  modules: {}
});
