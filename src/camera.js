let stream = null;
const videoElement = document.getElementById('input-video');

export async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720, facingMode: 'user' }
        });
        videoElement.srcObject = stream;
        
        return new Promise((resolve) => {
            videoElement.onloadedmetadata = () => {
                videoElement.play();
                const camBadge = document.getElementById('status-cam');
                if (camBadge) {
                    camBadge.className = 'px-4 py-1.5 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30 font-bold whitespace-nowrap';
                    camBadge.innerText = 'Câmera On';
                }
                resolve(videoElement);
            };
        });
    } catch (err) {
        console.error("Erro ao acessar a câmera: ", err);
        throw err;
    }
}

export function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        videoElement.srcObject = null;
    }
}
