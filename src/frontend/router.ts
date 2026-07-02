export const navigateTo = (targetViewId: string) : void => {
    
    const allViews = document.querySelectorAll('.view');
    allViews.forEach((view) => {
        view.classList.remove('active');
        view.classList.add('hidden');
    });

    const targetView = document.getElementById(targetViewId);

    if(targetView){
        targetView.classList.remove('hidden');
        targetView.classList.add('active');

        updateNavBar(targetViewId);
    } else {
        console.log(`[FRONTEND:ROUTING]: targetViewID: ${targetViewId} not found`);
    }
}

const updateNavBar = (currentViewId: string) : void => {
    const homeBtn = document.getElementById('nav-btn-home');
    const dashboardBtn = document.getElementById('nav-btn-dashboard');

    if(!homeBtn || !dashboardBtn) return;

    if(currentViewId === 'view-home'){
        homeBtn.classList.add('nav-active');
        dashboardBtn.classList.remove('nav-active');
    } else {
        homeBtn.classList.remove('nav-active');
        dashboardBtn.classList.add('nav-active');
        dashboardBtn.classList.remove('hidden');
    }
}
