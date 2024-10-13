const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    target: 'web',
    externals: {
        'node-module-using-global': 'global',
    },
    module: {
        rules: [
            {
                test: /\.ts|\.tsx$/, use: 'ts-loader',
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/env",
                            "@babel/preset-typescript",
                        ]
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: [
            '.tsx', '.ts', '.js',
        ],
        fallback: {
            "./lib/conn-pool.js": false,
            "./lib/utp.cjs": false,
            "@silentbot1/nat-api": false,
            "bittorrent-dht": false,
            "crypto": false,
            "fs": false,
            "fs-chunk-store": "hybrid-chunk-store",
            "http": false,
            "load-ip-set": false,
            "net": false,
            "os": false,
            "ut_pex": false,
            "dgram": false,
            "dns": false,
        }
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            // favicon: './public/favicon.png',
        }),
        new CleanWebpackPlugin(),
        new NodePolyfillPlugin({
            // https://www.npmjs.com/package/node-polyfill-webpack-plugin
            additionalAliases: ['process', 'punycode'],
        }),
        new webpack.DefinePlugin({
            global: 'globalThis'
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, "./public"),
        },
        compress: true,
        port: process.env.PORT,
    }
};