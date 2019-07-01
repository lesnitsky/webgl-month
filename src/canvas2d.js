console.log('Hello WebGL month');

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

function calculatePixelIndices(top, left, width, height) {
    const pixelIndices = [];

    for (let x = left; x < left + width; x++) {
        for (let y = top; y < top + height; y++) {
            const i =
                y * canvas.width * 4 + // pixels to skip from top
                x * 4; // pixels to skip from left

            pixelIndices.push(i);
        }
    }

    return pixelIndices;
}

function fillRect(top, left, width, height) {
    const pixelStore = new Uint8ClampedArray(canvas.width * canvas.height * 4);
    
    const pixelIndices = calculatePixelIndices(top, left, width, height);

    pixelIndices.forEach((i) => {
        pixelStore[i] = 0; // r
        pixelStore[i + 1] = 0; // g
        pixelStore[i + 2] = 0; // b
        pixelStore[i + 3] = 255; // alpha
    });

    const imageData = new ImageData(pixelStore, canvas.width, canvas.height);
    ctx.putImageData(imageData, 0, 0);
}

fillRect(10, 10, 100, 50);
