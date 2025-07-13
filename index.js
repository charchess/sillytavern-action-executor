(function ($) {
    if (!SillyTavern) { return; }

    const context = SillyTavern.getContext();
    const INTENT_ROUTER_URL = 'https://intent-router.truxonline.com/route';

    async function callIntentRouter(payload) {
        // ... (cette fonction ne change pas) ...
    }

    // ---- Notre fonction de débogage ----
    function onNewMessage(data) {
        console.log('Action Executor: EV_NEW_MESSAGE détecté.', data); // LOG 1: L'événement a-t-il été reçu ?

        if (data.is_user) {
            console.log('Action Executor: Message de l\'utilisateur, ignoré.'); // LOG 2: Est-ce qu'on ignore bien l'utilisateur ?
            return;
        }

        const messageText = data.mes;
        console.log('Action Executor: Traitement du message de l\'IA :', messageText); // LOG 3: Quel est le texte du message ?

        const actionRegex = /<\|ACTION\|>([\s\S]*?)<\|\/ACTION\|>/;
        const match = messageText.match(actionRegex);

        if (match && match[1]) {
            console.log('Action Executor: Balise <|ACTION|> trouvée !'); // LOG 4: La Regex a-t-elle fonctionné ?
            const jsonContent = match[1].trim();
            console.log('Action Executor: Contenu JSON extrait :', jsonContent); // LOG 5: Quel JSON avons-nous ?

            try {
                const payload = JSON.parse(jsonContent);
                toastr.info('Bloc d\'action détecté. Envoi en cours...', 'Action Executor');
                
                console.log('Action Executor: Envoi du payload à l\'Intent Router :', payload); // LOG 6: Qu'est-ce qu'on envoie ?
                callIntentRouter(payload);

                const newMessage = messageText.replace(actionRegex, '*(Action exécutée en arrière-plan)*');
                context.chat.splice(-1, 1, { ...data, mes: newMessage });
                context.forceRedraw();
            } catch (error) {
                console.error('Action Executor: Erreur de parsing du JSON', error);
                toastr.error('Le bloc d\'action contenait un JSON invalide.', 'Action Executor');
            }
        } else {
            console.log('Action Executor: Aucune balise <|ACTION|> trouvée dans le message.'); // LOG 7: Si la Regex échoue
        }
    }

    $(document).ready(function () {
        // On s'assure de bien retirer l'ancien écouteur avant d'en ajouter un nouveau pour éviter les doublons
        context.eventSource.removeListener(context.eventSource.EV_NEW_MESSAGE, onNewMessage);
        context.eventSource.on(context.eventSource.EV_NEW_MESSAGE, onNewMessage);
        
        console.log('Action Executor: Prêt et à l'écoute des nouveaux messages.');
        toastr.success('Extension Action Executor chargée.', 'Info');
    });

})(jQuery);
