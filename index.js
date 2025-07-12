(function ($) {
    if (!SillyTavern) { return; }

    const context = SillyTavern.getContext();
    const INTENT_ROUTER_URL = 'https://intent-router.truxonline.com/route';

    async function callIntentRouter(payload) {
        // ... (cette fonction ne change pas) ...
    }

    function onNewMessage(data) {
        // On vérifie que le message vient bien de l'IA
        if (data.is_user) {
            return;
        }

        const messageText = data.mes;
        const actionRegex = /<\|ACTION\|>([\s\S]*?)<\|\/ACTION\|>/;
        const match = messageText.match(actionRegex);

        if (match && match[1]) {
            const jsonContent = match[1].trim();
            try {
                const payload = JSON.parse(jsonContent);
                toastr.info('Bloc d\'action détecté. Envoi en cours...', 'Action Executor');
                
                // On envoie l'action au routeur
                callIntentRouter(payload);

                // On modifie le message affiché pour qu'il soit plus propre
                const newMessage = messageText.replace(actionRegex, '*(Action exécutée en arrière-plan)*');
                context.chat.splice(-1, 1, { ...data, mes: newMessage });
                context.forceRedraw(); // Force le rafraîchissement de l'affichage du chat
            } catch (error) {
                console.error('Action Executor: Erreur de parsing du JSON', error);
                toastr.error('Le bloc d\'action contenait un JSON invalide.', 'Action Executor');
            }
        }
    }

    // On attend que tout soit prêt, puis on écoute les nouveaux messages
    $(document).ready(function () {
        context.eventSource.on(context.eventSource.EV_NEW_MESSAGE, onNewMessage);
        console.log('Action Executor: Prêt et à l\'écoute des nouveaux messages.');
        toastr.success('Extension Action Executor chargée.', 'Info');
    });

})(jQuery);
