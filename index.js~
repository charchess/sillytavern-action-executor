(function () {
    console.log('--- ACTION EXECUTOR: SCRIPT CHARGÉ (v2) ---');

    if (!SillyTavern) {
        console.error('ACTION EXECUTOR: SillyTavern n\'est pas trouvé.');
        return;
    }

    // La fonction qui sera appelée à chaque nouveau message
    function onNewMessage(data) {
        // Pour l'instant, on se contente de logger le message reçu
        console.log('--- ACTION EXECUTOR: NOUVEAU MESSAGE DÉTECTÉ ---');
        console.log(data); // On affiche tout l'objet de données pour inspection
    }

    // La fonction d'initialisation de l'extension
    function initialize() {
        console.log('--- ACTION EXECUTOR: FONCTION INIT APPELÉE (v2) ---');
        
        try {
            const context = SillyTavern.getContext();

            if (context && context.eventSource) {
                // On attache notre fonction "onNewMessage" à l'événement EV_NEW_MESSAGE
                context.eventSource.on(context.eventSource.EV_NEW_MESSAGE, onNewMessage);

                console.log('--- ACTION EXECUTOR: Écouteur d\'événement attaché avec succès. ---');
                toastr.success('Action Executor [ÉCOUTE ACTIVE]', 'Extension');
            } else {
                console.error('--- ACTION EXECUTOR: Contexte ou EventSource non disponible.');
                toastr.error('Action Executor [ERREUR INIT]', 'Extension');
            }
        } catch (error) {
            console.error('--- ACTION EXECUTOR: Erreur dans la fonction initialize ---', error);
            toastr.error('Action Executor [ERREUR CRITIQUE]', 'Extension');
        }
    }

    // Enregistrer le point d'entrée de notre extension
    SillyTavern.extension_entrypoints.push({
        name: 'Action Executor',
        init: initialize
    });

})();