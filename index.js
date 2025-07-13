(function () {
    console.log('--- ACTION EXECUTOR: SCRIPT CHARGÉ ---');

    if (!SillyTavern) {
        console.error('ACTION EXECUTOR: SillyTavern n\'est pas trouvé.');
        return;
    }

    function initialize() {
        console.log('--- ACTION EXECUTOR: FONCTION INIT APPELÉE ---');

        const context = SillyTavern.getContext();
        if (context && context.eventSource) {
            console.log('--- ACTION EXECUTOR: Contexte et EventSource trouvés. Attachement de l\'écouteur. ---');
            toastr.success('Action Executor [OK]', 'Extension');
        } else {
            console.error('--- ACTION EXECUTOR: Contexte ou EventSource non disponible au moment de l\'init.');
            toastr.error('Action Executor [ERREUR]', 'Extension');
        }
    }

    SillyTavern.extension_entrypoints.push({
        name: 'Action Executor',
        init: initialize
    });

})();
