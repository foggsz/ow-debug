#!/usr/bin/env node
const server = require('./lib/server')
const argv = process.argv

let _configIndex = argv.findIndex(i => i === '--config')
if(_configIndex === -1){
    throw new Error(`请传入webpack配置文件\n vue-cli-service配置文件地址 https://cli.vuejs.org/zh/guide/webpack.html#%E5%AE%A1%E6%9F%A5%E9%A1%B9%E7%9B%AE%E7%9A%84-webpack-%E9%85%8D%E7%BD%AE`)
}

let webpackConfigPath = argv[_configIndex + 1]
if (argv.length > 2) {
    let _pathIndex = argv.findIndex(i => i === '--path')
    let _portIndex = argv.findIndex(i => i === '--port')
    let _path = _pathIndex > -1 ? argv[_pathIndex + 1] : ''
    let _port = _portIndex > -1 ? argv[_portIndex + 1] : ''
    return server(webpackConfigPath, _path, _port)
}

server(webpackConfigPath)

