const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: {
        index: './src/index.js',
    },
    output: {
        path: path.join(__dirname, "dist", "js"),
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {}
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
            },
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.min.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};
