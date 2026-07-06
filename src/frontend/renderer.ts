import { loadDashboard } from "./components/dashboard";
import { changeToCreateTable } from "./components/createTable";
import { navigateTo } from "./router";

document.addEventListener('DOMContentLoaded', () => {
  
  // App Components Initialization
  console.log('[ROUTER/INFO]: App Initialised');

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