import { loadDashboard } from "./components/dashboard";
import { changeToCreateTable } from "./components/createTable";
import { navigateTo } from "./router";
import { logger } from "./util/logger";

document.addEventListener('DOMContentLoaded', () => {
  
  // App Components Initialization
  logger.info('RENDERER', 'App Initialised');

  loadDashboard();

  const homeBtn = document.getElementById('nav-btn-create-table');
  const dashboardBtn = document.getElementById('nav-btn-dashboard');

  if(homeBtn) {
    homeBtn.addEventListener('click', () => {
      navigateTo('view-create-table');
      changeToCreateTable();
    });
  }

  if(dashboardBtn) {
    dashboardBtn.addEventListener('click', () => {
      navigateTo('view-dashboard');
      loadDashboard();
    });
  }

})