import adapter from "webrtc-adapter";
import WebTorrent from "webtorrent";

const client = new WebTorrent()

client.on('error', err => {
    log('ERROR: ' + err)
    console.error('ERROR: ' + err)
})

document.querySelector('form')?.addEventListener('submit', e => {
    e.preventDefault() // Prevent page refresh

    const torrentId = document.querySelector('form input[name=torrentId]') as HTMLInputElement
    log('Adding ' + torrentId.value)
    client.add(torrentId.value, onTorrent)
})

async function onTorrent(torrent) {
    console.log(torrent);
    log('Got torrent metadata!')
    log(`metadata: ${torrent.metadata}`)
    log(`magnetURI: ${torrent.magnetURI}`)
    log(`announce: ${torrent.announce}`)
    log(
        'Torrent info hash: ' + torrent.infoHash + ' ' +
        '<a href="' + torrent.magnetURI + '" target="_blank">[Magnet URI]</a> ' +
        '<a href="' + URL.createObjectURL(torrent.torrentFileBlob) + '" target="_blank" download="' + torrent.name + '.torrent">[Download .torrent]</a>'
    )

    // Print out progress every 5 seconds
    // const interval = setInterval(() => {
    //     log('Progress: ' + (torrent.progress * 100).toFixed(1) + '%')
    // }, 5000)

    torrent.on('download', (bytes) => {
        console.log('just downloaded: ' + bytes)
        console.log('total downloaded: ' + torrent.downloaded)
        console.log('download speed: ' + torrent.downloadSpeed)
        console.log('progress: ' + torrent.progress)
      })

    torrent.on('done', () => {
        log('done')
        // clearInterval(interval)
    })

    // Render all files into to the page
    for (const file of torrent.files) {
        try {
            const blob = await file.blob()
            document.querySelector('.log')?.append(file.name)
            log('(Blob URLs only work if the file is loaded from a server. "http//localhost" works. "file://" does not.)')
            log('File done.')
            log('<a href="' + URL.createObjectURL(blob) + '">Download full file: ' + file.name + '</a>')
        } catch (err) {
            if (err) log(err.message)
        }
    }
}

const fileInput = document.getElementById('file-input') as HTMLInputElement
fileInput.addEventListener('input', () => {
    const files = fileInput.files;
    if (!files) return;
    log('file uploaded!')
    client.seed(files, onTorrent)
})

function log(str) {
    const p = document.createElement('p')
    p.innerHTML = str
    document.querySelector('.log')?.appendChild(p)
}

// const iceConfig = {
//     iceServers : [
//         {
//             urls: 'stun:stun1.l.google.com:19302'
//         }
//     ]
// };
// function main() {
//     const fileInput = document.getElementById('file-input') as HTMLInputElement
//     fileInput.oninput = async () => {
//         const file = fileInput.files?.[0]
//         if (!file) return
//         const buffer = await file.arrayBuffer()
//         console.log(new Uint8Array(buffer))
//     }
//     // const peer = new RTCPeerConnection(iceConfig)

// }
// window.onload = () => main()

// https://github.com/webtorrent/webtorrent/issues/2206