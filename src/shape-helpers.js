const Pi_4 = Math.PI / 4;

export function createRect(top, left, width, height, angle = 0) {
    const centerX = width / 2;
    const centerY = height / 2;

    const diagonalLength = Math.sqrt(centerX ** 2 + centerY ** 2);

    const x1 = centerX + diagonalLength * Math.cos(angle + Pi_4);
    const y1 = centerY + diagonalLength * Math.sin(angle + Pi_4);

    const x2 = centerX + diagonalLength * Math.cos(angle + Pi_4 * 3);
    const y2 = centerY + diagonalLength * Math.sin(angle + Pi_4 * 3);

    const x3 = centerX + diagonalLength * Math.cos(angle - Pi_4);
    const y3 = centerY + diagonalLength * Math.sin(angle - Pi_4);

    const x4 = centerX + diagonalLength * Math.cos(angle - Pi_4 * 3);
    const y4 = centerY + diagonalLength * Math.sin(angle - Pi_4 * 3);

    return [
        x1 + left, y1 + top,
        x2 + left, y2 + top,
        x3 + left, y3 + top,
        x4 + left, y4 + top,
    ];
}

export function createHexagon(centerX, centerY, radius, segmentsCount) {
    const vertexData = [];
    const segmentAngle =  Math.PI * 2 / (segmentsCount - 1);

    for (let i = 0; i < Math.PI * 2; i += segmentAngle) {
        const from = i;
        const to = i + segmentAngle;

        const color = rainbowColors[i / segmentAngle];

        vertexData.push(centerX, centerY);
        vertexData.push(...color);

        vertexData.push(centerX + Math.cos(from) * radius, centerY + Math.sin(from) * radius);
        vertexData.push(...color);

        vertexData.push(centerX + Math.cos(to) * radius, centerY + Math.sin(to) * radius);
        vertexData.push(...color);
    }

    return vertexData;
}
