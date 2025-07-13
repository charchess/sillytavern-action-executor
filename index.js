// On ne met plus l'enveloppe (function($){...})(jQuery);

// S'assurer que SillyTavern est prêt
if (!SillyTavern) {
    console.error('SillyTavern n\'est pas prêt, impossible de charger l\'extension Action Executor.');
} else {

    const context = SillyTavern.getContext();
    const INTENT_ROUTER_URL = 'https://intent-router.truxonline.com/route';

    // Notre fonction pour appeler l'Intent Router (ne change pas)
    async function callIntentRouter(payload) {
        try {
            const response = await fetch(INTENT_ROUTER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Intent Router a répondu avec une erreur ${response.status}: ${errorData.detail || 'Erreur inconnue'}`);
            }
            
            const result = await response.json();
            console.log('Réponse de l\'Intent Router :', result);
            toastr.success(`Action ${payload.tool} exécutée.`);
            return `Action ${payload.tool} exécutée avec succès.`;

        } catch (error) {
            console.error('Erreur lors de l\'appel de l\'Intent Router :', error);
            toastr.error(error.message, 'Action Executor Error');
            return `Échec de l'exécution de l'action : ${error.message}`;
        }
    }

    // Notre fonction de traitement des messages (ne change pas)
    function onNewMessage(data) {
        // ... (la logique de cette fonction avec tous les console.log reste exactement la même) ...
        if (data.is_user) { return; }
        const messageText = data.mes;
        const actionRegex = /<\|ACTION\|>([\s\S]*?)<\|\/ACTION\|>/;
        const match = messageText.match(actionRegex);
        if (match && match[1]) {
            const jsonContent = match[1].trim();
            try {
                const payload = JSON.parse(jsonContent);
                toastr.info('Bloc d\'action détecté. Envoi en cours...', 'Action Executor');
                callIntentRouter(payload);
                const newMessage = messageText.replace(actionRegex, '*(Action exécutée en arrière-plan)*');
                context.chat.splice(-1, 1, { ...data, mes: newMessage });
                context.forceRedraw();
            } catch (error) {
                console.error('Action Executor: Erreur de parsing du JSON', error);
                toastr.error('Le bloc d\'action contenait un JSON invalide.', 'Action Executor');
            }
        }
    }

    // La fonction d'initialisation de l'extension
    function initialize() {
        // On attache notre écouteur d'événement ici.
        context.eventSource.on(context.eventSource.EV_NEW_MESSAGE, onNewMessage);
        
        console.log('Action Executor: Prêt et à l\'écoute des nouveaux messages.');
        toastr.success('Extension Action Executor chargée.', 'Info');
    }

    // Enregistrer le point d'entrée de notre extension (la méthode officielle)
    SillyTavern.extension_entrypoints.push({
        name: 'Action Executor',
        init: initialize
    });
}