export function initConsent({ onAccept, onDeny, onRevoke }) {
    const btnAccept = document.getElementById('btn-accept-camera');
    const btnDeny = document.getElementById('btn-deny-camera');
    const btnRevoke = document.getElementById('btn-revoke');

    btnAccept.addEventListener('click', () => {
        document.getElementById('consent-modal').classList.remove('active');
        document.getElementById('consent-modal').classList.add('hidden');
        onAccept();
    });

    btnDeny.addEventListener('click', () => {
        document.getElementById('consent-modal').classList.remove('active');
        document.getElementById('consent-modal').classList.add('hidden');
        onDeny();
    });

    btnRevoke.addEventListener('click', () => {
        onRevoke();
    });
}
