console.log('--- ACTION EXECUTOR: SCRIPT CHARGÉ (v5 - Final) ---');

// =================================================================================
// FONCTION PRINCIPALE D'INITIALISATION
// =================================================================================

function initializeExtension() {
    console.log('--- ACTION EXECUTOR: FONCTION INIT APPELÉE ---');

    // 1. Obtenir le contexte sécurisé de SillyTavern
    const context = SillyTavern.getContext();
    const INTENT_ROUTER_URL = 'https://intent-router.truxonline.com/route';

    if (!context || !context.eventSource) {
        console.error('ACTION EXECUTOR: Contexte ou EventSource non disponible au moment de l\'init.');
        toastr.error('Action Executor [ERREUR INIT]', 'Extension');
        return;
    }

    // =================================================================================
    // LOGIQUE DE L'EXTENSION
    // =================================================================================

    // Fonction pour appeler notre service externe (Intent Router)
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
            console.log('ACTION EXECUTOR: Réponse de l\'Intent Router :', result);
            toastr.success(`Action ${payload.tool} exécutée.`);

        } catch (error) {
            console.error('ACTION EXECUTOR: Erreur lors de l\'appel de l\'Intent Router :', error);
            toastr.error(error.message, 'Action Executor Error');
        }
    }

    // Fonction qui s'exécute à chaque nouveau message dans le chat
    function onNewMessage(data) {
        // On ignore les messages de l'utilisateur, on ne traite que ceux de l'IA
        if (data.is_user) {
            return;
        }

        const messageText = data.mes;
        const actionRegex = /<\|ACTION\|>([\s\S]*?)<\|\/ACTION\|>/;
        const match = messageText.match(actionRegex);

        // Si on trouve une balise <|ACTION|>
        if (match && match[1]) {
            console.log('ACTION EXECUTOR: Balise <|ACTION|> détectée !');
            const jsonContent = match[1].trim();
            
            try {
                // On essaie de parser le JSON
                const payload = JSON.parse(jsonContent);
                toastr.info('Bloc d\'action détecté. Envoi en cours...', 'Action Executor');
                
                // On envoie le payload à notre service externe
                callIntentRouter(payload);

                // On nettoie le message affiché dans le chat
                const newMessage = messageText.replace(actionRegex, '*(Action exécutée en arrière-plan)*');
                context.chat.splice(-1, 1, { ...data, mes: newMessage });
                context.forceRedraw(); // Force le rafraîchissement de l'affichage du chat

            } catch (error) {
                console.error('ACTION EXECUTOR: Erreur de parsing du JSON', error);
                toastr.error('Le bloc d\'action contenait un JSON invalide.', 'Action Executor');
            }
        }
    }

    // =================================================================================
    // ATTACHEMENT DE L'ÉVÉNEMENT
    // =================================================================================

    // On attache notre fonction "onNewMessage" à l'événement de nouveau message
    context.eventSource.on(context.eventSource.EV_NEW_MESSAGE, onNewMessage);

    console.log('--- ACTION EXECUTOR: Prêt et à l\'écoute des nouveaux messages. ---');
    toastr.success('Action Executor [ÉCOUTE ACTIVE]', 'Extension');
}


// =================================================================================
// LOGIQUE DE CHARGEMENT SÉCURISÉE (Polling)
// =================================================================================

function waitForSillyTavern() {
    // On vérifie si la fonction d'enregistrement existe déjà
    if (SillyTavern && SillyTavern.extension_entrypoints) {
        SillyTavern.extension_entrypoints.push({ name: 'Action Executor', init: initializeExtension });
        return;
    }

    // Si elle n'existe pas, on attend en la vérifiant régulièrement
    const interval = setInterval(() => {
        if (SillyTavern && SillyTavern.extension_entrypoints) {
            clearInterval(interval); // On arrête la vérification
            
            // On enregistre notre extension
            SillyTavern.extension_entrypoints.push({
                name: 'Action Executor',
                init: initializeExtension
            });
        }
    }, 100);
}

// On lance le processus de chargement sécurisé
waitForSillyTavern();
