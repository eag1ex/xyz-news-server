Object.assign = require('object-assign')
module.exports = (DEBUG = true) => {
    /**
     * @type {import("../types").types.Iconfig}
     */
    const config = require('../config')
    const path = require('path')
    const session = require('./express-sess')
    const { listRoutes } = require('./utils')
    const messages = require('./messages')
    //const fs = require('fs')
    const { log, onerror } = require('x-utils-es/umd')
    const express = require('express')
    const app = express()
    const morgan = require('morgan')
    const bodyParser = require('body-parser')
    const jwt = require('jsonwebtoken')
    const cors = require('cors')
    const ejs = require('ejs')

    app.set('trust proxy', 1) // trust first proxy
    app.use(morgan('dev'))
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(cors())




    // for rendering html
    // @ts-ignore
    app.engine('html', ejs.__express) // ejs.renderFile
    app.set('view engine', 'html') // if we want to set default file extention, for example: .html, .md
    // static routes
    app.set('views',path.join(config.viewsDir, './xyz'));
    app.use('/xyx/', express.static(path.join(config.viewsDir, './xyz')))
    app.use(express.static('views/xyz'))
    // save logged in session and manage expiry
    session(app)

    // initialize and wait for init to resolve
    // ---------- Initialize auth check controllers
    try {
        const serverAuth = require('./auth.controller')(app, undefined, jwt, DEBUG)

        // validate login to ./app with post/auth credentials
        // app.post('/auth', serverAuth.postAuth.bind(serverAuth))
        serverAuth.AppUseAuth()
    } catch (err) {
        onerror('[ServerAuth]', err)
        return
    }

    // ----- load our app routes
    let apiRouter
    try {
        apiRouter = require('./routes/api.router')(config, /** dbc */ undefined, /** mongo */ undefined, jwt, DEBUG)
        app.use('/api', apiRouter)
    } catch (err) {
        onerror('[apiApp]', err)
    }

    let xyzRouter
    try {
        xyzRouter = require('./routes/xyz.router')(config, /** dbc */ undefined, /** mongo */ undefined, jwt, DEBUG)
        app.use('/xyz', xyzRouter)
    } catch (err) {
        onerror('[xyzApp]', err)
    }

    // -- add session validation to master app

    app.use('/welcome', function (req, res) {
        return res.status(200).json({ success: true, message: 'works fine', url: req.url, available_routes: listRoutes(apiRouter.stack, '/user'), status: 200 })
    })

    // catch all other routes
    // @ts-ignore
    app.all('*', function (req, res) {
        res.status(400).json({ ...messages['001'], error: true })
    })

    // -------- handle errors
    // @ts-ignore
    app.use(function (error, req, res, next) {
        onerror(error)
        res.status(500).json({ error: true, ...messages['500'] })
    })

    // ---
    // Initialize server
    const server = app.listen(config.port, function () {
        // @ts-ignore
        const host = (server.address().address || '').replace(/::/, config.HOST)
        // @ts-ignore
        const port = server.address().port
        log(`xyz-news server running on: ${host}`)
        log(`port: ${port}`) // in case different
    })

    return { server, app }
}
