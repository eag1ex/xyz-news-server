/**
 *  XYZ application route server via Router.app
 */

/**
 * @typedef {import("../../types").types.TReq} Req
 * @typedef {import("../../types").types.TResp} Resp
 */

class App{
    constructor(){}

     /**
         * /xyz/app
         * render our app here
         * @param {Req} req
         * @param {Resp} res
         */
        app(req, res, next) {
           return res.render('../xyz/index')
        }
}


/**
 * 
 * @returns {App}
 */
module.exports = () => {
    return new App()
}


