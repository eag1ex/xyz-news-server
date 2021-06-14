
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
    const path = require('path')
    const { log } = require('x-utils-es/umd')
    const express = require('express')
    const userRouter = express.Router()
    const messages = require('../messages')

    const controllers = require('../controllers/user.controllers')(db, mongo, jwt, DEBUG)

    // -------- Initialize our controllers
    // const controllers = new ServerCtrs({}, DEBUG)

    userRouter.use(function timeLog(req, res, next) {
        log('Time: ', Date.now())
        next()
    })

    // app static routes
    // TODO move bucket/api to seperate route
    // ---------- set server routes
    userRouter.get('/api/list', controllers.list.bind(controllers))
    userRouter.post('/api/create', controllers.create.bind(controllers))
    userRouter.post('/api/:id/update', controllers.update.bind(controllers))

    // catch all other routes
    userRouter.all('/api/*', function(req, res) {
        res.status(400).json({ ...messages['001'], error: true })
    })

    return userRouter
}
