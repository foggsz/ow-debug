const os = require('os')
const QRCode = require("./lib/qrcode/lib/index")
const fs = require("fs-extra")
const path = require('path')
const webpack = require('webpack')

const { merge } = require('webpack-merge')
const { execSync } = require('child_process')

const openQrcode = (dataString, cb) => {
    QRCode.toString(dataString, {
        type: 'terminal',
        small: true,
    }).then((qr) => {
        cb && cb(qr)
    })
}

const getMypcip = (family = 'IPv4') => {
    let nets = os.networkInterfaces()
    for (let key in nets) {
        let net = nets[key]
        for (let item of net) {
            if (item.family === family && !item.internal) {
                return item.address
            }
        }
    }
}

const isVue = () => {
    try {
        execSync('vue')
        return true
    } catch (error) {
        return false
    }
}
// 合并热更新
const mergeHotWebackConfig = (webpackConfigPath) => {
    let dir = path.resolve(process.cwd(), webpackConfigPath)
    let hotConfig = {
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ],
        stats: "none"
    }

    let baseConfig = require(dir)
    let entry = baseConfig.entry
    let hotMiddlewareScript = `${path.resolve(require.resolve('webpack-hot-middleware'), '../client')}?path=/__webpack_hmr&timeout=20000&reload=true`;

    if (typeof entry === 'string') {
        entry = [].concat(entry)
    }

    if (Array.isArray(entry)) {
        entry.push(hotMiddlewareScript)
    }

    if (Object.prototype.toString.call(entry) === "[object Object]") {
        for (let key in entry) {
            entry[key] = [].concat(entry[key])
            entry[key].push(hotMiddlewareScript)
        }
    }

    baseConfig.entry = entry
    baseConfig = merge(baseConfig, hotConfig)
    return baseConfig
}

const getWebpackConfig = (webpackConfigPath) => {
    return mergeHotWebackConfig(webpackConfigPath)
}

module.exports = {
    getMypcip,
    openQrcode,
    isVue,
    getWebpackConfig
}

