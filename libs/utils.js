const { reduce } = require('lodash')
const { onerror, isFalsy, objectSize, matched } = require('x-utils-es/umd')
const q = require('q')

const base64 = require('base-64')
const utf8 = require('utf8')
const config = require('../config')

/* istanbul ignore next */ 
exports.listRoutes = (stack, appNameRoute) => {
    return reduce(stack, (n, el, k) => {
        if (el.route) {
            if (((el.route || {}).path || '').indexOf('/') !== -1) {
                n.push({ route: appNameRoute ? `${appNameRoute}${el.route.path}` : el.route.path })
            }
        }
        return n
    }, [])
}

/**
 * Decrypt string from btoa
 * @param {string} encoded 
 * @returns {string}
 */
/* istanbul ignore next */ 
const decrypt = (encoded) => {
    if (!encoded) return ''
    const bytes = base64.decode(encoded)
    const text = utf8.decode(bytes)
    return text
}

/**
 * Encrypt string with btoa, can be decrypted with atob
 * @param {string} str 
 * @returns {string}
 */
const encrypt = (str) => {
    if (!str) return ''
    const bytes = utf8.encode(str)
    const encoded = base64.encode(bytes)
    return encoded
}


/**
 * test string is beond max allowed number
 * @param {string} str 
 * @param {number} max 
 * @returns {boolean}
 */
exports.longString = (str = '', max) => {
    if (!str) return false
    if (str.split(' ').length > max) return false
    else return true
}


/**
 * check if mongo _id is valid format
 * @param {*} id
 */
/* istanbul ignore next */ 
exports.validID = (id) => {
    try {
        let rgx = new RegExp('^[0-9a-fA-F]{24}$')
        return rgx.test(id)
    } catch (err) {
        return false
    }
}

/**
 * - accepting object of messages, example: `{'001':['SimpleOrder listStore is empty',001],...}`
 * - returns : {'001':{message,code},...}
 */
exports.onMessages = (messages) => {
    const msgs = {}

    for (let [k, v] of Object.entries(messages)) {
        msgs[k] = { message: v[0], code: v[1] }
    }
    return msgs
}

/**
 * Grab tokep from headers
 * @param {*} headers {}
 */
/* istanbul ignore next */ 
exports.getToken = (headers = {}) => {
    if (headers && headers.authorization) {
        const parted = headers.authorization.split(' ')
        if (parted.length === 2) return parted[1]
        else return null
    }
    return null
}
/* istanbul ignore next */ 
exports.JWTverifyAccess = (jwt, req, token) => {
    const defer = q.defer()
    if (!token) {
        return Promise.reject('NO_TOKEN')
    } else {
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                onerror('[JWTverifyAccess]', err.toString())
                defer.reject('NOT_AUTHENTICATED')
            } else {
                req.token = decoded // [1]
                defer.resolve(true)
            }
        })
    }

    return defer.promise
}

/**
 * check allowed url routes to skipp authentication
 * @param {*} url
 * @param {*} allowed
 */
/* istanbul ignore next */ 
exports.validate = (url, allowed) => {
    const validate = allowed.filter((val) => {
        if (url === val && val === '/') return true // for base route
        else if (val !== '/') return url.indexOf(val) !== -1
    }).length >= 1
    return validate
}

exports.decrypt = decrypt
exports.encrypt = encrypt