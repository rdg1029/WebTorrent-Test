const iceConfig = {
    iceServers : [
        {
            urls: 'stun:stun1.l.google.com:19302'
        }
    ]
};
function main() {
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    fileInput.oninput = async () => {
        const file = fileInput.files?.[0]
        if (!file) return
        const buffer = await file.arrayBuffer()
        console.log(new Uint8Array(buffer))
    }
    // const peer = new RTCPeerConnection(iceConfig)

}
window.onload = () => main()