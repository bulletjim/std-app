import { initHome } from "./components/home";
import { navigateTo } from "./router";

document.addEventListener('DOMContentLoaded', () => {
  
  // App Components Initialization
  console.log('[ROUTER/INFO]: App Initialised');

  initHome();

  const homeBtn = document.getElementById('nav-btn-home');
  const dashboardBtn = document.getElementById('na-btn-dashboard');

  if(homeBtn) {
    homeBtn.addEventListener('click', () => {
      navigateTo('view-home');
    });
  }

  if(dashboardBtn) {
    dashboardBtn.addEventListener('click', () => {
      navigateTo('view-dashboard');
    });
  }

  navigateTo('view-home');

})