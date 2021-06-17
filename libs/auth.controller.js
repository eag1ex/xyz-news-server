/**
 * - ServerAuth extension
 */

const config = require('../config')
//const { validate, getToken, JWTverifyAccess } = require('./utils')
// const ENV = config.env // development,production

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

    async authCheck(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Methods', 'GET')
        // res.header('Access-Control-Allow-Methods', 'POST')
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, token-expiry')
        res.header('Referrer-Policy', 'no-referrer') // for google external assets
        //
        return next()
    }

    AppUseAuth() {
        this.expressApp.use(this.authCheck.bind(this))
    }
}

module.exports = function (expressApp, dbc, jwt, debug) {
    return new ServerAuth(expressApp, debug)
}
