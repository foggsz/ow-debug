const path = require('path')
const { getMypcip, openQrcode } = require('../utils')
const createHotServer = require('./hotServer')

const createServer = (webpackConfigPath, staticDir, port) => {
    staticDir = path.resolve(process.cwd(), staticDir || './dist')
    port =  port || 9528
    const express = require('express')
    const app = express();

    // 读取描述文件
    createHotServer(app,
        webpackConfigPath,
        port,
        express
    )   
}

module.exports = createServer

