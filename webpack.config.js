const path = require('path');

module.exports = {
    entry: {
        'week-1': './src/week-1.js',
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },

    mode: 'development',
};
