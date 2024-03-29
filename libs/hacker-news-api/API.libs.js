/**
 * @typedef {import("../../types").types.APIQuery} APIQuery
 * @typedef {import("../../types").types.APIitem} APIitem
 * @typedef {import("../../types").types.ApiParams} ApiParams
 * @typedef {import("../../types").types.APIstories} APIstories
 * @typedef {import("../../types").types.APIuser} APIuser
 * @typedef {import("../../types").types.APIstoryTypes} APIstoryTypes
 */

const { warn, onerror, log, chunks } = require('x-utils-es/umd')
const HackerNewsAPI = require('./API')

/**
 * Extend Hacker new api
 */
class Libs extends HackerNewsAPI {

    perPageLimit = 15
    constructor() {
        super()
    }

    /**
     * This method implements fetch, making subsequent item api calls 
     * - For initial `/{storyType}` results we fetch again by story>item>id up to perPageLimit limit
     * @param {object} o
     * @param {number} o.perPage  // default is {perPageLimit}
     * @param {number} o.paged // total (results/perPage)[paged] zero is first item
     * @param {APIstoryTypes} o.value
     * @returns {Promise< {data:APIitem[],pagedTotal:number} >}
     */
    async storiesPaged({ perPage = 15, paged = 0, value }) {
        /* istanbul ignore next */ 
        if (!value) return Promise.reject('Must provide value for storiesPaged')
        if (!paged) paged = 0 // alwasy return first page if not set

        /* istanbul ignore next */ 
        if (!perPage) perPage = this.perPageLimit
        /* istanbul ignore next */ 
        if (perPage > this.perPageLimit) {
            perPage = this.perPageLimit
            warn('[storiesPaged]', 'paged offset to great, max is: 10')
        }

        /**
         *
         * @returns {Promise<APIitem>}
         */
        const fetchItem = async (_value, index) => {
            try {
                log('[fetchItem][index]', index)
                return await this.fetch({ type: 'item', value: _value })
          
            }       
            catch  (err) {
                onerror('[fetchItem]', err)
                // NOTE so it wont kill pending calls
                return Promise.resolve(null)
            }
        }

        try {

            /** @type {Promise<APIstories>} */
            let r = this.fetch({ type: 'story', value })
            let resp = await r

            let results = chunks(resp, perPage) // > [ [],[],[] ] etc
            let pagedTotal = results.length - 1

            /** @type {APIstories} */
            let pagedResults = results[paged] || []

            /* istanbul ignore next */ 
            if (!pagedResults.length) {
                let lastAvail = results.length - 1
                return Promise.reject(`No results found for paged:${paged}, last available was paged:${lastAvail}`)
            }
            // fetch each item up to paged limit
            // NOTE the paged count not guaranteed due to any api limits
            let asyncResults = []
            for (let inx = 0; inx < pagedResults.length; inx++) {
                let item = pagedResults[inx]
                if (!item) continue

                /** @type {Promise<APIitem>} */
                let r = fetchItem(item.toString(), inx)
                asyncResults.push(r)
            }
            /* istanbul ignore next */ 
            if (!asyncResults.length) return { data: [], pagedTotal }

            return Promise.all(asyncResults)
                .then((n) => n.filter((nn) => !!nn)
                    // sort by time                
                    .sort((a, b) => {
                        if (b.time && a.time) return b.time - a.time
                        else return -1
                    }) 
                )
                .then(n => {
                    return { data: n, pagedTotal }
                })
        } 
 
        catch (err) {
            onerror('[storiesPaged]', err)
            return Promise.reject('storiesPaged error, check the service')
        }
    }
}

module.exports = Libs
