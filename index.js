// Nous n'utilisons plus la fonction anonyme (function() { ... })();
// pour rendre le script encore plus simple.

console.log('--- ACTION EXECUTOR: SCRIPT CHARGÉ (v3) ---');

function initializeExtension() {
    console.log('--- ACTION EXECUTOR: FONCTION INIT APPELÉE (v3) ---');

    // Vérification de sécurité
    if (!SillyTavern || !SillyTavern.getContext) {
        console.error('ACTION EXECUTOR: SillyTavern ou son contexte ne sont pas disponibles.');
        return;
    }

    const context = SillyTavern.getContext();

    function onNewMessage(data) {
        console.log('--- ACTION EXECUTOR: NOUVEAU MESSAGE DÉTECTÉ ---', data);
    }

    try {
        context.eventSource.on(context.eventSource.EV_NEW_MESSAGE, onNewMessage);
        console.log('--- ACTION EXECUTOR: Écouteur d\'événement attaché avec succès. ---');
        toastr.success('Action Executor [ÉCOUTE ACTIVE]', 'Extension');
    } catch (error) {
        console.error('--- ACTION EXECUTOR: Erreur lors de l\'attachement de l\'écouteur.', error);
        toastr.error('Action Executor [ERREUR INIT]', 'Extension');
    }
}

// C'est la méthode de l'extension "Dice".
// On demande à jQuery d'attendre que la page soit prête avant de lancer notre initialisation.
// C'est la manière la plus robuste de gérer le timing.
$(document).ready(function () {
    // On vérifie que la fonction pour s'enregistrer existe
    if (SillyTavern && SillyTavern.extension_entrypoints) {
        console.log('--- ACTION EXECUTOR: Document prêt. Enregistrement du point d\'entrée. ---');
        SillyTavern.extension_entrypoints.push({
            name: 'Action Executor',
            init: initializeExtension
        });
    } else {
        console.error('--- ACTION EXECUTOR: Impossible d\'enregistrer l\'extension, SillyTavern.extension_entrypoints n\'existe pas.');
    }
});