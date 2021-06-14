const { onMessages } = require('./utils')

/**
 * - errors and messages
 * returns example :message[500]=> `{message,code}`
 */
module.exports = onMessages({
    '500': ['Server error', '500'],
    '600': ['Mongo connection error', '600'],
    '001': ['Route is no available', '001'],
    '002': ['Issue with creating new bucket', '002'], // createBucket
    '003': ['No Results for Bucket', '003'], // bucketList
    '004': ['Bucket not updated', '004'], // updateBucketStatus
    '005': ['Subtask not created', '005'], // createSubtask
    '006': ['Subtask not updated', '006'] // updateSubtaskStatus
})
