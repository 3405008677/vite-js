import { defineStore } from "pinia";
import variables from "@/style/element-variables.scss";
import defaultSettings from "@/settings";

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings;

export default defineStore("settings", {
  state: () => {
    return {
      theme: variables.theme,
      showSettings,
      tagsView,
      fixedHeader,
      sidebarLogo,
    };
  },
  actions: {},
});
