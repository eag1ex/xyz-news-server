/**
 * @typedef {import("../../types").types.APIQuery} APIQuery
 * @typedef {import("../../types").types.APIitem} APIitem
 * @typedef {import("../../types").types.ApiParams} ApiParams
 * @typedef {import("../../types").types.APIstories} APIstories
 * @typedef {import("../../types").types.APIuser} APIuser
 */

const HackerNewsAPI = require('.')
const hn = new HackerNewsAPI()

// valid examples 
// hn.fetch({type:'item','value':'27476207'})
// hn.fetch({type:'user','value':'sizzle'})
// hn.fetch({type:'story','value':'beststories'})

hn.fetch({type:'user','value':'sizzle'}).then(n=>{

    /**
     * @type {APIuser}
     */
    let item = n
    
    console.log(item)
}).catch(err=>{
    console.error(err)
})