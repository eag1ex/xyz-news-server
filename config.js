// NOTE KEEP this file secure, do not push to public repo
const port = Number(process.env.PORT || 5000)

/* dynamic variable, on local change to development*/
const env = 'production'
const path = require('path')

module.exports = {
    env, // development,production
    port: port,
    secret: '345df45657678dgf',
    // NOTE {MY_APP} is a custom var set on heroku to distinguish between environments
    // to run app on local host in production, you need to rebuild it with localhost api
    // @ts-ignore
    HOST: env === 'production' ? 'https://immense-ocean-43660.herokuapp.com' : `http://localhost:${port}`,
    viewsDir: path.join(__dirname, './views'),
    API: {
        base: 'https://hacker-news.firebaseio.com/v0/',
    },
    timeout: 5000,
}
