const webpack = require('webpack')
const { openQrcode, getMypcip } = require('../utils')
const { getWebpackConfig } = require('../utils')
const webpackHot = require('webpack-hot-middleware')
const webpackDev = require('webpack-dev-middleware')


let isInit = true
const createHotServer = async (app, webpackConfigPath, port) => {

    const webpackConfig = getWebpackConfig(webpackConfigPath)

    let compiler = webpack(webpackConfig)
    let _webpackDev = webpackDev(compiler, {
        publicPath: compiler.options.output.publicPath
    })
    
    let httpLoc = `http://${getMypcip()}:${port}${compiler.options.output.publicPath}` 
    app.use(_webpackDev)
    app.use(webpackHot(compiler, {
        log: (message) => {
            
            console.log(message)
            openQrcode(httpLoc, (qrcord) => {
                console.log(qrcord)
                console.log(`server runing at  \x1B[34m ${httpLoc} \x1B[0m`)
            })           
            if (!isInit) {
                console.log('gengxinle')
            }
            isInit = false
        },
        path: '/__webpack_hmr'
    }))
    _webpackDev.waitUntilValid(() => {
        app.listen(port)
    })

}


module.exports = createHotServer