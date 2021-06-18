
/**
 * 
 * @param {import("../../types").types.Iconfig?} config 
 * @param {*} db 
 * @param {*} mongo 
 * @param {import("../../types").types.IJWT} jwt 
 * @param {*} DEBUG 
 * @returns {import("../../types").types.IRouter} 
 */
module.exports = (config = null, db, mongo, jwt, DEBUG) => {
    const { log } = require('x-utils-es/umd')
    const express = require('express')
    const xyzRouter = express.Router()
    // const messages = require('../messages')
    // -------- Initialize our controllers
    const controllers = require('../controllers/xyz.app')()

    xyzRouter.use(function timeLog(req, res, next) {
        log('Time: ', Date.now())
        next()
    })
    // app static routes
    xyzRouter.get('/*', controllers.app.bind(controllers))
    return xyzRouter
}
