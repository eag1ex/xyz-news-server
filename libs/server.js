
Object.assign = require('object-assign')
module.exports = (DEBUG = true) => {
    /**
     * @type {import("../types").types.Iconfig}
     */
    let config

    try {
        // @ts-ignore
        config = require('../config')
    } catch (err) {
        console.error('make sure to rename ./config-example.js to ./config.js')
        return
    }
  
    // const path = require('path')
    const session = require('./express-sess')
    const { listRoutes } = require('./utils')
    const messages = require('./messages')
    const fs = require('fs')
    const { log, onerror } = require('x-utils-es/umd')
    const express = require('express')
    const app = express()
    const morgan = require('morgan')
    const bodyParser = require('body-parser')

    const jwt = require('jsonwebtoken')

    const cors = require('cors')
    const ejs = require('ejs')

    // add markdown support
    const escapeHtml = require('escape-html')
    const marked = require('marked')

    app.set('trust proxy', 1) // trust first proxy
    app.use(morgan('dev'))
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(cors())

    // register markdown
    app.engine('md', function(path, options, fn) {
        fs.readFile(path, 'utf8', function(err, str) {
            if (err) return fn(err)
            var html = marked.parse(str).replace(/\{([^}]+)\}/g, function(_, name) {
                return escapeHtml(options[name] || '')
            })
            fn(null, html)
        })
    })

    // for rendering html
    // @ts-ignore
    app.engine('html', ejs.__express) // ejs.renderFile
    // app.set('view engine', 'html') // if we want to set default file extention, for example: .html, .md
    app.set('views', config.viewsDir)
    // app.set('views', path.join(config.viewsDir, 'admin'))
    // static routes
    // app.use('/login/', express.static(path.join(config.viewsDir, './admin')))
    // app.use('/user/', express.static(path.join(config.viewsDir, './user-app')))
    // save logged in session and manage expiry
    session(app)

    // ------------ init mongo DB
    // const { mongoDB, DBControllers } = require('../mongoDB')

    // const MongoDB = mongoDB()
    // const mongo = new MongoDB(DEBUG)
    // const dbc = new DBControllers(mongo, /* debug: */false)

    // initialize and wait for init to resolve

    // ---------- Initialize auth check controllers
    try {
        const serverAuth = require('./auth.controller')(app, undefined, jwt, DEBUG)

        // validate login to ./app with post/auth credentials
        //  app.post('/auth', serverAuth.postAuth.bind(serverAuth))
        serverAuth.AppUseAuth()
        // app.get('/login', serverAuth.login.bind(serverAuth))
    } catch (err) {
        onerror('[ServerAuth]', err)
        return
    }

    // ----- load our apps routes
    let userRouter
    try {
        userRouter = require('./routes/user.router')(config, /** dbc */ undefined, /** mongo */undefined, jwt, DEBUG)
        app.use('/user', userRouter)
    } catch (err) {
        onerror('[userApp]', err)
    }

    app.get('/', function(req, res) {
        res.render('index.md', { title: 'Markdown Example' })
    })

    // -- add session validation to master app

    app.use('/welcome', function(req, res) {
        return res.status(200).json({ success: true, message: 'works fine', url: req.url, available_routes: listRoutes(userRouter.stack, '/user'), status: 200 })
    })

    // catch all other routes
    // @ts-ignore
    app.all('*', function(req, res) {
        res.status(400).json({ ...messages['001'], error: true })
    })

    // -------- handle errors
    // @ts-ignore
    app.use(function(error, req, res, next) {
        onerror(error)
        res.status(500).json({ error: true, ...messages['500'] })
    })

    // ---
    // Initialize server
    const server = app.listen(config.port, function () {

        // @ts-ignore
        const host = (server.address().address || '').replace(/::/, 'localhost')
        // @ts-ignore
        const port = server.address().port
        log(`server running on http://${host}:${port}`)
    })

    return { server, app }

    // mongo.init().then(n => {
    //     // ------ run server
    //     app.listen(config.port)
    //     if (config.mongo.remote) attention('[remote][server]', 'running on port:', config.port)
    //     else attention('[localhost][server]', 'running on port:', config.port)
    // }).catch(err => {
    //     onerror('[mongo]', err)
    //     onerror('[mongo]', 'server did not start')
    // })
}
