var path = require('path');

module.exports = {
    entry: {
        app : [path.resolve(__dirname, './src/App.js')]
    },
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname,'public/build') ,
        publicPath: 'public/build',
        filename: '[name].bundle.js'
    },
    module: {
        rules : [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-react','@babel/env',{
                        'plugins': ['@babel/plugin-proposal-class-properties']}]
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader'
            }, 
            {
                test: /\.css$/,
                loader: 'css-loader',
                query: {
                  modules: true
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                  {
                    loader: 'file-loader'
                  },
                ],
            }
        ]
    },
    devServer: {
        port: 8000,
        contentBase: 'public'
    }
}
