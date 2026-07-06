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

    } else {
        console.log(`[FRONTEND:ROUTING]: targetViewID: ${targetViewId} not found`);
    }
}

