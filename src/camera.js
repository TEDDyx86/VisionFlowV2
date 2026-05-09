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
                document.getElementById('status-cam').className = 'status-badge';
                document.getElementById('status-cam').innerText = 'Câmera On';
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
