// S'assurer que SillyTavern existe est la seule chose que nous faisons au niveau global.
if (!SillyTavern) {
    console.error('SillyTavern n\'est pas prêt, impossible de charger l\'extension Action Executor.');
} else {

    // On ne définit que des variables et des fonctions ici, on n'exécute rien.
    let context; // On déclare la variable context, mais on ne l'assigne pas encore.
    const INTENT_ROUTER_URL = 'https://intent-router.truxonline.com/route';

    async function callIntentRouter(payload) {
        // ... (cette fonction ne change pas)
    }

    function onNewMessage(data) {
        // ... (cette fonction ne change pas, elle utilisera la variable 'context' qui sera définie)
        if (!context || data.is_user) { return; } // Ajout d'une sécurité
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
        // C'EST ICI que nous obtenons le contexte et que nous attachons l'écouteur
        context = SillyTavern.getContext();
        
        context.eventSource.on(context.eventSource.EV_NEW_MESSAGE, onNewMessage);
        
        console.log('Action Executor: Prêt et à l\'écoute des nouveaux messages.');
        toastr.success('Extension Action Executor chargée.', 'Info');
    }

    // Enregistrer le point d'entrée de notre extension
    SillyTavern.extension_entrypoints.push({
        name: 'Action Executor',
        init: initialize
    });
}}