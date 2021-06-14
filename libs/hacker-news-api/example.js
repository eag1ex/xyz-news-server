/**
 * @typedef {import("../../types").types.APIQuery} APIQuery
 * @typedef {import("../../types").types.APIitem} APIitem
 * @typedef {import("../../types").types.ApiParams} ApiParams
 * @typedef {import("../../types").types.APIstories} APIstories
 * @typedef {import("../../types").types.APIuser} APIuser
 */

const { onerror,log } = require("x-utils-es/umd")
const HackerNewsAPI = require('.')
const hn = new HackerNewsAPI()

// valid examples 
// hn.fetch({type:'item','value':'27476207'})
// hn.fetch({type:'user','value':'sizzle'})
// hn.fetch({type:'story','value':'beststories'})

function fetch() {
    hn.fetch({ type: 'user', value: 'sizzle' })
        .then((n) => {
            /**
             * @type {APIuser}
             */
            let item = n

           log(item)
        })
        .catch((err) => {
            onerror(err)
        })
}; //fetch()

function storiesPaged(){
    hn.storiesPaged({paged:13,value:'beststories',perPage:15}).then(n=>{
        log(n)
    }).catch(err=>{
        onerror(err)
    })
}; storiesPaged()