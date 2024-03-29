/**
 * Decided to opt-in for existing npm package
 * (source) https://www.npmjs.com/package/html-metadata
 */
const { sq, isFalsy, isObject, isString, log, inIndex, warn,matched, objectSize } = require('x-utils-es/umd')
const scrape = require('html-metadata')
const request = require('request')
const { longString,encrypt,stripHTML } = require('../utils')

// NOTE do not parse urls from ignore list
const ignoreList = [/heroku/i,/google./i,/github.com/i, /.pdf/i, /.jpg/i, /.xml/i, /.json/i, /.cn/i,/.ru/i, /.gov/i ]
// how much text is allowed
const strLimit = 1000


/**
 * Format scraper output to nice/readable 1/to 2 level array format,
 * so we can parse it to html ul/li list.
 * @param {object} obj
 * @returns {Array<{name:string,value:[]| string}?>}
 */
const formatMetadata = (obj = {}) => {
    let o = {}
    o = Object.entries(obj).reduce((n, [k, el], i, all) => {
        if (!isObject(el)) return n
        const levelObj = Object.entries(el).reduce((nn, [kk, val]) => {
            if (isString(val) && val) {
                let value = (val || '').trim() || ''
              
                // limit string
                /* istanbul ignore next */ 
                if (value.length > strLimit) {
                    value = value.substr(0, strLimit) + ' [...]'
                }

                // make it safe    
                value = stripHTML(value)
                let _kk = encodeURIComponent(kk || '').trim()
                if (value && _kk && !longString(value, 1)) nn[_kk] = value
            }
            return nn
        }, {})
        n[k] = { ...n[k], ...levelObj }
        if (isFalsy(n[k])) delete n[k]
        return n
    }, {})

    // NOTE {general}, {openGraph}, {jsonLd} >  [description/title] may have same content, lets limit that
    // this is limited out of scope, we could make better dynamic implementation if needed!

     /* istanbul ignore next */  // we can implement test when this feature is fully completed
    if (!isFalsy(o)) {
        if ((o.general || {}).description && (o.openGraph || {}).description) {
            // using encrypt for better matching
            if (matched(encrypt(o.general.description), new RegExp(encrypt(o.openGraph.description), 'gi'))) {
                delete o.openGraph.description
                if(!objectSize(o.openGraph)) delete o.openGraph
            }
        }
        if((o.general || {}).description && (o.jsonLd || {}).description ){
            if (matched(encrypt(o.general.description), new RegExp(encrypt(o.jsonLd.description), 'gi'))) {
                delete o.jsonLd.description
                if(!objectSize(o.jsonLd)) delete o.jsonLd
            } 
        }
    }

    let list = []
    for (let key in o) {
        let l = { name: key, value: o[key] }
        if (isObject(l.value)) {
            let ll = Object.entries(l.value).map(([k, val]) => ({ name: k, value: val }))
            l.value = ll
        }
        list.push(l)
    }
    return list
}

/**
 *
 * @param {string} url // url from story
 * @param {number?} id  // id of the story
 * @returns {Promise<{metadata:Array<any>,id:number}>} // returns mixed object, since each page is different
 */
const htmlScrape = (url = '', id = undefined) => {
    if (!url) return Promise.reject('url not provided')
    
    // test if url is valid
    try {
        new URL(url)
    } catch (err) {
        return Promise.reject(`Invalid url provided: ${url}`)
    }

    // @ts-ignore
    if (inIndex(url, ignoreList)) {
        let msg = 'This url is not permitted'
        warn(msg)
        return Promise.reject(msg)
    }

    log('[htmlScrape][calling]', url)
    let defer = sq()
    const options = {
        url,
        jar: request.jar(),
        headers: {
            // to be friendly :)
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.7113.93 Safari/537.36'
        }
    }

    scrape(options, function (error, metadata) {
        if (error || isFalsy(metadata)) {
            warn('[htmlScrape]', `no metadata for url:${url} `)
            return defer.reject('No metadata available.')
        } else {
            const meta = formatMetadata(metadata)
            if (isFalsy(meta)) {
                warn('[htmlScrape]', `No suitable metadata for url:${url} `)
                return defer.reject('No metadata available.')
            } else defer.resolve({ metadata: meta, id })
        }
    })
    return defer
}

// NOTE example:
// htmlScrape('https://github.com',123)
//     .then(n=>{
//        log(n)
//     }).catch(err=>{
//         onerror(err)
//     })

module.exports = htmlScrape
