const { reduce } = require('lodash')
const { copy, onerror, isEmpty } = require('x-utils-es/umd')
const q = require('q')

const config = require('../config')
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
 * check if mongo _id is valid format
 * @param {*} id
 */
exports.validID = (id) => {
    try {
        let rgx = new RegExp('^[0-9a-fA-F]{24}$')
        return rgx.test(id)
    } catch (err) {
        return false
    }
}

exports.validStatus = (status = '') => ['pending', 'completed'].indexOf(status || '') !== -1

/**
 * - remove unwanted props from output
 * @param {*} o
 * @param {*} modelType bucket/subtask
 */
exports.cleanOut = (o = {}, modelType = 'user') => {
    try {
        o = copy(o)
        if (isEmpty(o)) return {}

        if (!modelType || modelType === 'user') {
            delete o.__v
            // REVIEW  delete o.updatedAt just keep it for now
            o.id = o._id
            delete o._id
            delete o.user
            if ((o.subtasks || []).length) {
                o.subtasks = o.subtasks.map(n => {
                    n.todo_id = n._id
                    // REVIEW  delete n.updatedAt just keep it for now
                    delete n.__v
                    delete n._id

                    return n
                })
            }
        } else {
            delete o.__v
            // REVIEW  delete o.updatedAt just keep it for now
            o.todo_id = o._id
            delete o._id
        }

        return o
    } catch (err) {
        onerror('[cleanOut]', err)
        return { error: 'output error' }
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
exports.getToken = (headers = {}) => {
    if (headers && headers.authorization) {
        const parted = headers.authorization.split(' ')
        if (parted.length === 2) return parted[1]
        else return null
    }
    return null
}

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
exports.validate = (url, allowed) => {
    const validate = allowed.filter((val) => {
        if (url === val && val === '/') return true // for base route
        else if (val !== '/') return url.indexOf(val) !== -1
    }).length >= 1
    return validate
}
