const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// https://vue-loader.vuejs.org/en/configurations/extract-css.html
const ExtractTextPlugin = require('extract-text-webpack-plugin')

let base = {
    entry: ['./src/main.js'],

    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].js'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader',
                options: {
                    name: 'assets/[name].[ext]?[hash]'
                }
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            favicon: './src/assets/favicon.ico'
        })
    ],

    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },

    devServer: {
        historyApiFallback: true,
        noInfo: true
    },

    performance: {
        hints: false
    }
}

let development = {
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },

    devtool: '#eval-source-map'
}

let production = {
    output: {
        filename: '[name].[chunkhash].js'
    },

    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: ExtractTextPlugin.extract({
                            loader: 'css-loader',
                            fallbackLoader: 'vue-style-loader'
                        })
                    }
                }
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    loader: 'css-loader',
                    fallbackLoader: 'style-loader'
                })
            }
        ]
    },

    // http://vue-loader.vuejs.org/en/workflow/production.html
    plugins: [
        new ExtractTextPlugin('[name].[contenthash].css'),

        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ],

    // devtool: '#source-map'
    devtool: false
}

let webpackConfig = ((env) => {
    if (env === 'development') {
        return webpackMerge(base, development)
    }

    if (env === 'production') {
        return webpackMerge(base, production)
    }
})(process.env.NODE_ENV)

module.exports = webpackConfig
