const { merge } = require('webpack-merge');
const common = require('./webpack.base.config');

//Configure prod enviroment by using common configuration and adding some more options
module.exports = merge(common, {
    mode: 'production',
    devtool: false
    //we can add many of optimizations configurations as minification, compression and so on, 
    //but to be a minumal project exemple so its needs to have only minimal configuration
})