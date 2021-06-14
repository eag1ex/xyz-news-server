
const CONFIG = require('../../config')

// const { onerror } = require('x-utils-es/umd')
const { cleanOut, validID, validStatus } = require('../utils')
//  const messages = require('../messages')
// const debug = true
// const DBControllers = require('../../mongoDB/db.controllers')
class ServerController {
      
    constructor(opts, debug) {
        this.debug = debug

        // adds intellisense support
        // this.dbc = undefined
        // if (dbc instanceof DBControllers) {
        //     // all good
        //     this.dbc = dbc
        // } else {
        //     throw ('db is not of DBControllers')
        // }
    }

    /**
       * - (GET) REST/api
       * - `example:  /user/list`
       * -  return all items in the /user/ for current user
       * @param {import("../../types").types.TReq} req
       */
    async list(req, res) {
        let limit = 50 // NOTE lets just set a static limit for now!
        return res.status(200).json({
            response: true,
            code: 200
        })
    }

    /**
       * - (POST) REST/api => /user/create
       * - Create new /user/
       * - Accepting: {title}
       */
    async create(req, res) {
        //  await this.onMongoReady(req, res)
        const body = req.body || {}

        if (!body.title) {
            return res.status(400).json({ error: 'missing title' })
        }

        const userData = {
            // NOTE assign static user to each request for now
            user: { name: CONFIG.mongo.defaultUser },
            title: body.title
        }
        return res.status(200).json({
            response: userData,
            code: 200
        })
    }

    /**
       * - (POST) REST/api
       * - update {status}
       * - Accepting {status}
       * - `example:  /user/:id/update`
       */
    async update(req, res) {
        //  await this.onMongoReady(req, res)
        const id = req.params.id
        const body = req.body || {}

        if (!validID(id)) return res.status(400).json({ error: 'Not a valid {id}' })
        // if (!validStatus(body.status || '')) return res.status(400).json({ error: 'Not a valid {status} provided' })

        return res.status(200).json({
            response: { id, ...body },
            code: 200
        })
    }
}

/**
 * 
 * @param {*} dbc 
 * @param {*} mongo 
 * @param {*} jwt 
 * @param {*} debug 
 * @returns {ServerController}
 */
module.exports = (dbc, mongo, jwt, debug) => {
    return new ServerController({}, debug)
}
