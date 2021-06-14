
// NOTE KEEP this file secure, do not push to public repo
const port = Number(process.env.PORT || 5000)

// NOTE you can host mongoDB on local environment also, just need to set it up
const dbRemote = true // process.env.MY_APP === 'bucketlist' // true/false
const path = require('path')

module.exports = {

    // in production the authentication is enabled
    env: 'development', // development,production
    port: port,
    'secret': '345df45657678dgf',
    // NOTE {MY_APP} is a custom var set on heroku to distinguish between environments
    // to run app on local host in production, you need to rebuild it with localhost api
    HOST: process.env.MY_APP === 'dbName' ? 'remote' : `http://localhost:${port}`,
    viewsDir: path.join(__dirname, './views'),
    API:{
        base:'https://hacker-news.firebaseio.com/v0/'
    },
    timeout:5000,
    mongo: {
        remote: dbRemote,
        database: dbRemote ? '' : `mongodb://localhost/dbName`,
        defaultUser: 'johndoe' // our database default user
    }
}
