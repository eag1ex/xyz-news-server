
// valid users, unless no longer exist
exports.users = [
    { user: 'pseudolus', inx: 1 },
    { user: 'Black101', inx: 2 },
    { user: 'signa11', inx: 3 },
    { user: 'todsacerdoti', inx: 4 },
    { user: 'pseudolus', inx: 4 },
    // fail one user
    { user: 'invalid234sdf34', inx: 4 },
]

exports.testURLS = [
    { value: 'https://nodejs.medium.com/introducing-undici-4-1e321243e007', inx: 0 },
    { value: 'https://invalidurl.com', inx: 1 },
  //  { value: 'https://www.reddit.com/r/Windows10/comments/o1x183/the_famous_windows_31_dialogue_is_again_in/', inx: 2 },
    { value: 'https://arstechnica.com/gadgets/2021/06/', inx: 3 },
    { value: 'https://en.wikipedia.org/wiki/Juneteenth', inx: 4 },
    { value: 'invalurl', inx: 5 }, // fail
    { value: 'https://google.com/somepdf.pdf', inx: 6 }, // fail
    { value: 'https://github.com', inx: 7 }, //  fail
]