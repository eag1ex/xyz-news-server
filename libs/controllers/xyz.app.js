/**
 *  XYZ application route
 */

/**
 * @typedef {import("../../types").types.TReq} Req
 * @typedef {import("../../types").types.TResp} Resp
 */

class App {
    constructor() {}

    /**
     * /xyz/*
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
