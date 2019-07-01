console.log('Hello WebGL month');

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

function fillRect(top, left, width, height) {
    const pixelStore = new Uint8ClampedArray(canvas.width * canvas.height * 4);

    for (let i = 0; i < pixelStore.length; i += 4) {
        pixelStore[i] = 0; // r
        pixelStore[i + 1] = 0; // g
        pixelStore[i + 2] = 0; // b
        pixelStore[i + 3] = 255; // alpha
    }
}
