const path = require('path');

module.exports = {
    entry: {
        'week-1': './src/week-1.js',
        'texture': './src/texture.js',
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },

    module: {
        rules: [
            {
                test: /\.glsl$/,
                use: 'raw-loader',
            },

            {
                test: /\.jpg$/,
                use: 'url-loader',
            },
        ],
    },

    mode: 'development',
};
