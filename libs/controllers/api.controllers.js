
/**
 * @typedef {import("../../types").types.TReq} Req
 * @typedef {import("../../types").types.TResp} Resp
 * @typedef {import("../../types").types.APIstoryTypes} APIstoryTypes
 */

const API = require('../hacker-news-api')
const htmlScrape = require('../html-scrape')
const messages = require('../messages')
const { decrypt } = require('../utils')

class ServerController {
    constructor(opts, debug) {
        this.debug = debug
        this.API = new API()
    }

    /**
     * (GET) REST/api => /stories/:type
     * 
     * - Accepting: {paged}
     * @param {Req} req
     * @param {Resp} res
     * @returns 'paged results including each item detail'
     */
    async stories(req, res) {
        // per page limit
        const perPage = 15

        /** @type {APIstoryTypes} */
        const type = req.params.type
        let q = req.query
        let paged = Number(q.paged || 0)

        if (paged < 0) {
            return res.status(400).json(...messages['002'])
        }

        return this.API.storiesPaged({ paged, perPage, value: type })
          
            .then((n) => {
                res.status(200).json({
                    response: n.data,
                    paged: paged,
                    pagedTotal: n.pagedTotal,
                    code: 200
                })
            })
            .catch((err) => {
                res.status(400).json({
                    error: err,
                    code: 400
                })
            })
    }

    /**
     * (GET) REST/api => /metadata/:url
     * 
     * @param {Req} req
     * @param {Resp} res
     * @returns 'return metadata parsed by htmlScrape plugin'
     */
    async metadata(req, res) {

        /** @type {string} */
        const url = decrypt((req.params.url || ''))
        if (!url) {
            return res.status(400).json(...messages['003'])
        }

        return htmlScrape(url)
            .then((n) => {
                res.status(200).json({
                    response: n,
                    code: 200
                })
            })
            .catch((err) => {
                res.status(400).json({
                    error: err,
                    code: 400
                })
            })
    }

    /**
     * (GET) REST/api => /user/:name
     * @param {Req} req
     * @param {Resp} res
     */
    async user(req, res) {
        const name = req.params.name
        return this.API.fetch({ type: 'user', value: name })
            .then((n) => {
                if (!n) return {}
                else return n
            })
            .then((n) => {
                return res.status(200).json({
                    response: n,
                    code: 200
                })
            }).catch(err => {
                return res.status(400).json({
                    error: err,
                    code: 400
                })
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
