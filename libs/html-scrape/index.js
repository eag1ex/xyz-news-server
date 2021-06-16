/**
 * Decided to opt-in for existing npm package
 * (source) https://www.npmjs.com/package/html-metadata
 */
const { sq, log, isFalsy, onerror, isObject, isString } = require('x-utils-es/umd')
const scrape = require('html-metadata')
const request = require('request')
const {longString} = require('../utils')
/**
 * Format scraper output to nice/readable 1 level object format, 
 * so we can parse it to html ul/li list.
 * @param {object} obj
 * @returns {object}
 */
const formatMetadata = (obj = {}) => {
    return Object.entries(obj).reduce((n, [k, el], i, all) => {
        if (!isObject(el)) return n
        const levelObj = Object.entries(el).reduce((nn, [kk, val]) => {
            if (isString(val) && val) {
                let value = (val || '').trim()
                // make it safe
                let _kk = encodeURIComponent(kk || '').trim()
                if (value && _kk && !longString(value,1)) nn[_kk] = value
            }
            return nn
        }, {})
        n[k] = { ...n[k], ...levelObj }
        if(isFalsy( n[k])) delete n[k]
        return n
    }, {})
}

/**
 *
 * @param {string} url // url from story
 * @param {number?} id  // id of the story
 * @returns {Promise<{metadata:object,id:number}>} // returns mixed object, since each page is different
 */
const htmlScrape = (url = '', id=undefined) => {
    if(!url) return Promise.reject('url not provided')

    // test if url is valid
    try{
        new URL(url)
    }catch(err){
        return Promise.reject(`Invalid url provided: ${url}`)
    }

    let defer = sq()
    const options = {
        url,
        jar: request.jar(),
        headers: {
            // to be friendly :)
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.7113.93 Safari/537.36',
        },
    }

    scrape(options, function (error, metadata) {
        if (error || isFalsy(metadata)) {
            return defer.reject('No metadata available.')
        } else {
            const meta = formatMetadata(metadata)
            if (isFalsy(meta)) return defer.reject('No metadata available.')
            else defer.resolve({ metadata: meta, id })
        }
    })
    return defer
}

// NOTE example:
// htmlScrape('https://firstpartysimulator.org/',123)
//     .then(n=>{
//        log(n)
//     }).catch(err=>{
//         onerror(err)
//     })

module.exports = htmlScrape
