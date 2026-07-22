import { logger } from "./util/logger";

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
        logger.error('ROUTER', `TargetViewId: ${targetViewId} not found`);
    }
}

