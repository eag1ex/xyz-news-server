const { onMessages } = require('./utils')

/**
 * - errors and messages
 * returns example :message[500]=> `{message,code}`
 */
module.exports = onMessages({
    '500': ['Server error', '500'],
    '001': ['Route is no available', '001'],
    '002': ['Must provide {paged} param', '002'], // stories
    '003': ['Url not provided', '003'] // metadata
})
