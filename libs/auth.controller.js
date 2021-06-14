
/**
 * - ServerAuth extension
 */

// const { log, warn, delay, attention, onerror } = require('x-utils-es/umd')
const config = require('../config')
const { validate, getToken, JWTverifyAccess } = require('./utils')
const ENV = config.env // development,production

class ServerAuth {

    /**
     * 
     * @param {import("../types").types.TExpress} expressApp 
     * @param {*} debug 
     */
    constructor(expressApp, debug) {
        this.debug = debug
        this.expressApp = expressApp


    }


    /**
     * allowed access without credentials
     *
     * @readonly
     */
    get allowed() {
        return ['/auth', '/login', '/signout', '/welcome', '/']
    }

    // async login(req, res, next) {
    //     // check still in valid session then re/route
    //     const token = (req.session || {}).accessToken || getToken(req.headers)
    //     try {
    //         await JWTverifyAccess(jwt, req, token)
    //         log('[login][session]', 'still valid')
    //         return res.redirect(config.HOST + '/bucket/')
    //     } catch (err) {
    //         //
    //     }

    //     res.setHeader('Content-Type', 'text/html')
    //     return res.render('login', {
    //     })
    // }

    /**
     *authenticate your routes and generate new {token}
     *
     * @param {*} req
     * @param {*} res
     * @returns
     */
    // async postAuth(req, res) {
    //     const auth = req.body
    //     // console.log('what is the auth.body',req.body);

    //     if (!auth) {
    //         warn('[postAuth]', 'wrong auth provided!')
    //         return res.status(400).json({ error: true, message: 'wrong auth provided!' })
    //     }

    //     // NOTE using fixed credentials, server session timeout
    //     if (auth.username.indexOf('johndoe') === -1 || auth.password.indexOf('johndoe') === -1) {
    //         return res.status(400).json({ error: true, message: 'wrong auth combination provided!' })
    //     }

    //     const authentication = {
    //         username: auth.username,
    //         password: auth.password,
    //         date: new Date()
    //     }

    //     // we are sending the profile in the token
    //     const token = jwt.sign(authentication, config.secret, { expiresIn: '30m' })
    //     req.session.accessToken = token

    //     // ----------- for every new login we reset our demo database
    //     // await this.resetDB()
    //     // ------------------------

    //     // your "Authorization: Bearer {token}"
    //     attention('[header][authorization][token]', token)

    //     log('[postAuth][success]')
    //     return res.redirect(config.HOST + '/bucket/')
    // }

    async authCheck(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Methods', 'GET')
       // res.header('Access-Control-Allow-Methods', 'POST')
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, token-expiry')
        res.header('Referrer-Policy', 'no-referrer') // for google external assets
        //

        // allowed routes without auth
        if (ENV === 'production') {
            const valid = validate(req.url, this.allowed)

            if (valid) return next()
            else {
                // check if token exists from server session or client supplied!
                const token = (req.session || {}).accessToken || getToken(req.headers)
                try {
                    await JWTverifyAccess(jwt, req, token)
                    return next()
                } catch (err) {
                    return res.status(400).send({ error: err, message: 'try loging again' })
                }
            }
        } else {
            // in development
            return next()
        }
    }

    AppUseAuth() {
        this.expressApp.use(this.authCheck.bind(this))
    }
}

module.exports = function(expressApp, dbc, jwt, debug) {
    return new ServerAuth(expressApp, debug)
}
