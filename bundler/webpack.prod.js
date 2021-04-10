const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const newCssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

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