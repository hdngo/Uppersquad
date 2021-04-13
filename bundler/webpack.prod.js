const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const newCssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require('dotenv-webpack');

module.exports = merge(
    common,
    {
        mode: 'production',
        devtool: 'source-map',
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[id].css',
            }),
            // new CopyPlugin({
            //     patterns: [
            //       { from: '_redirects' }
            //     ]
            // })
            new Dotenv({
                systemvars: true
            })    
        ],
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: [MiniCssExtractPlugin.loader, 'css-loader']
                }
            ]
        },
        optimization: {
            minimizer: [
                new newCssMinimizerPlugin()
            ]
        }
    }
);