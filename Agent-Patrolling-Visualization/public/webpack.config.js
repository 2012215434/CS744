module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        rules: [
            { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
            { test: /\.js$/,use: ['babel-loader',],exclude: /node_modules/ },
        ]
    },
    devServer: {
        inline:true,
        proxy: {
            '/': {
                target: 'http://localhost:3000/',
                secure: false
            }
        }
    }
};