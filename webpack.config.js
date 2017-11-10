'use strict'

module.exports = {
    entry: './main',
    target: 'web',
    node: {
        fs: 'empty'
    },
    output: {
        filename: './dist/build.js'
    }
};