const path = require('path');

module.exports = {
    entry: {
        'week-1': './src/week-1.js',
        texture: './src/texture.js',
        'rotating-square': './src/rotating-square.js',
        '3d': './src/3d.js',
        'minecraft-terrain': './src/minecraft-terrain.js',
        skybox: './src/skybox.js',
        minecraft: './src/minecraft.js',
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },

    devtool: 'sourcemap',

    module: {
        rules: [
            {
                test: /\.(glsl|obj)$/,
                use: 'raw-loader',
            },

            {
                test: /\.(jpg|png)$/i,
                use: 'url-loader',
            },
        ],
    },

    mode: 'development',
};
