
const {encrypt,decrypt} = require('./libs/utils')

// 
const enc = encrypt('https://blog.codinghorror.com/all-programming-is-web-programming/')
console.log(decrypt(enc))
