import { loadDashboard } from "./components/dashboard";
import { changeToCreateTable } from "./components/createTable";
import { navigateTo } from "./router";
import { logger } from "./util/logger";
import { clearTableSession, confirmDiscardChanges } from "./components/tableDetails";

document.addEventListener('DOMContentLoaded', () => {
  
  

  // App Components Initialization
  logger.info('RENDERER', 'App Initialised');

  loadDashboard();

  const homeBtn = document.getElementById('nav-btn-create-table');
  const dashboardBtn = document.getElementById('nav-btn-dashboard');
  // ClearTableSession is called when we exit the table details tab 
  if(homeBtn) {
    homeBtn.addEventListener('click', async () => {
      const canNavigate = await confirmDiscardChanges();
      if(!canNavigate) {
        return;
      }
      clearTableSession();
      navigateTo('view-create-table');
      changeToCreateTable();
    });
  }

  if(dashboardBtn) {
    dashboardBtn.addEventListener('click', async () => {
      const canNavigate = await confirmDiscardChanges();
      if(!canNavigate) {
        return;
      }
        
      clearTableSession();
      navigateTo('view-dashboard');
      loadDashboard();
    });
  }

})