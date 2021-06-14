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
    //pagedLimit = 10
    perPageLimit = 15
    constructor() {
        super()
    }

    /**
     * This method implements fetch, making subsequent api calls
     * - For initial `/{storyType}` results we fetch again by story item id up to paged limit
     * @param {object} o
     * @param {number} o.perPage  // default is {perPageLimit}
     * @param {number} o.paged // total (results/perPage)[paged] zero is first item
     * @param {APIstoryTypes} o.value
     * @returns {Promise<APIitem[]>}
     */
    async storiesPaged({ perPage = 15, paged = 0, value }) {
        if (!value) return Promise.reject('Must provide value for storiesPaged')
        if (!paged) paged = 0 // alwasy return first page if not set

        if (!perPage) perPage = this.perPageLimit
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
            } catch (err) {
                onerror('[fetchItem]', err)
                // NOTE so it wont kill pending calls
                return Promise.resolve(null)
            }
        }

        try {

            /** @type {Promise<APIstories>} */
            let r = await this.fetch({ type: 'story', value })
            let resp = await r

            let results = chunks(resp, perPage) //> [ [],[],[] ] etc

            /** @type {APIstories} */
            let pagedResults = results[paged] ||[]

            if(!pagedResults.length){
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
            if (!asyncResults.length) return []
            return Promise.all(asyncResults).then((n) => n.filter((nn) => !!nn))
        } catch (err) {
            onerror('[storiesPaged]', err)
            return Promise.reject('storiesPaged error, check the service')
        }
    }
}


module.exports = Libs