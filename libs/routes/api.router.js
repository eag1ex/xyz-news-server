
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
    const apiRouter = express.Router()
    const messages = require('../messages')
    
    // -------- Initialize our controllers
    const controllers = require('../controllers/api.controllers')(db, mongo, jwt, DEBUG)
    
    /* istanbul ignore next */ 
    apiRouter.use(function timeLog(req, res, next) {
        log('Time: ', Date.now())
        next()
    })

    // app static routes
    // TODO move xyz/api to seperate route
    // ---------- set server routes
    apiRouter.get('/stories/:type', controllers.stories.bind(controllers))
    apiRouter.get('/metadata/:url', controllers.metadata.bind(controllers))
    apiRouter.get('/user/:name', controllers.user.bind(controllers))
    // catch all other routes
    apiRouter.all('/*', function(req, res) {
        res.status(400).json({ ...messages['001'], error: true })
    })

    return apiRouter
}
