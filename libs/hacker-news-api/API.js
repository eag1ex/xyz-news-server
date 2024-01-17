/**
 * @typedef {import("../../types").types.APIQuery} APIQuery
 * @typedef {import("../../types").types.APIitem} APIitem
 * @typedef {import("../../types").types.ApiParams} ApiParams
 * @typedef {import("../../types").types.APIstories} APIstories
 * @typedef {import("../../types").types.APIuser} APIuser
 */

const request = require('request')
const { isFalsy, sq, onerror, log } = require('x-utils-es/umd')
const config = require('../../config')
const url = require('url')
const qstring = require('query-string')

/**
 * Example usage provided in `./example.js`
 */
class HackerNewsAPI {
    base = config.API.base
    options = {
        url: '', 
        method: 'GET',
        // headers: {},
        timeout: config.timeout,
        json: true
    }

    constructor() {}

    /**
     * (GET) response for `{stories}[topstories,beststories,newstories]`, {user} and {item}
     * @param {ApiParams?} params
     * @returns {Promise<any>}
     */
    fetch(params) {
        /* istanbul ignore next */ 
        if (isFalsy(params)) return Promise.reject('No params supplied')

        if (['story', 'user', 'item'].indexOf(params.type) === -1) {
            return Promise.reject('Invalid params supplied')
        }

        if (params.type === 'user') {
            // example output : https://hacker-news.firebaseio.com/v0/user/jl.json?print=pretty
             /* istanbul ignore next */ 
            if (!params.value) return Promise.reject(`No value for type:${params.type} provided`)
            let uri = url.resolve(this.base, `user/${params.value}.json`)
            let q = qstring.stringify(
                { print: 'pretty' },
                {
                    skipEmptyString: true
                }
            )

            this.options.url = uri + '?' + q
        }

        if (params.type === 'story') {
            // all available stories (top cats) have same format
            // example output : https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty
             /* istanbul ignore next */ 
            if (!params.value) return Promise.reject(`No value for type:${params.type} provided`)

            let uri = url.resolve(this.base, `${params.value}.json`)
            let q = qstring.stringify(
                { print: 'pretty' },
                {
                    skipEmptyString: true
                }
            )
            this.options.url = uri + '?' + q
        }
    
        if (params.type === 'item') {
            let val = Number(params.value)
            // all available stories (top cats) have same format
            // example output : https://hacker-news.firebaseio.com/v0/item/27476207.json?print=pretty
             /* istanbul ignore next */ 
            if (val < 1) return Promise.reject(`No value for type:${params.type} provided`)
            let uri = url.resolve(this.base, `item/${params.value}.json`)
            let q = qstring.stringify(
                { print: 'pretty' },
                {
                    skipEmptyString: true
                }
            )
            this.options.url = uri + '?' + q
        }

        let defer = sq()
        log('[HackerNewsAPI][fetch]', 'calling >> ', this.options.url)

        request(this.options, (err, res, body) => {
             /* istanbul ignore next */ 
            if (err) {
                onerror(err)
                return defer.reject('hacker-news request error, or api changed')
            }

            /* istanbul ignore next */ 
            if (Number(res.statusCode) >= 400) {
                let msg = `Status error, ${res.statusCode}`
                onerror(body || msg)
                return defer.reject(msg)
            } else {
                if (isFalsy(body)) defer.reject(`No results found for url:${this.options.url}`)
                else defer.resolve(body)
               
            }
        })

        return defer
    }
}

module.exports = HackerNewsAPI
