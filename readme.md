## XYZ NEWS SERVER
An api interpretation of the existing [HackerNews/api](https://github.com/HackerNews/API), for the purpose of integration with angular/mvc XYZ News project. 

Features:
* With good separation of concerns 
* Linted
* Documented
* jsDocs typed
* Tests/coverage support
* Error codes
* Express sub/routing


### Demo
Full featured demo includes production xyz-news app, can be accessed on: 
`https://immense-ocean-43660.herokuapp.com/xyz`

- *limited session time, hosted on free dyno, initial load may take bit longer*


#### Install
Build in `Node.js 12.0.0` and `NPM 6.9.0` in strict mode, maybe supported on higher but not tested

```sh
/$ npm i 
```


#### Start
Server starts on `http://localhost:5000/` 
- XYZ News app *(production)* can be accessed from `http://localhost:5000/xyz`

```sh
/$ npm start 
```



#### Config
Configuration defaults at `./config.js`



### Base api from HackerNews
Refer to https://github.com/HackerNews/API


### API
Available server routes:

```sh
# returns user detail response via HackerNews API
(GET) http://localhost:5000/api/user/:userName  # /api/user/pseudolus

# available story types: [topstories,beststories,newstories]
# optional query ?paged={number} to return results from forward index, up to available {pagedTotal}
(GET) http://localhost:5000/api/stories/:type # /api/stories/topstories

# provide base64.encode url, will try to scrape it for metadata
(GET) http://localhost:5000/api/metadata/:url # /api/metadata/aHR0cHM6Ly9hcnN0ZWNobmljYS5jb20vZ2FkZ2V0cy8yMDIxLzA2Lw== 

```


#### Stack
Application stack: Express.js, REST/API, Javascript, LINT, HackerNews/API, html/scrape.



#### Client
For client app visit: `https://bitbucket.org/eag1ex/bucket-list-app-client`



#### Tests
Tests provided, just run `npm run coverage`
*tests depend on live api to work, if you get a fail, try extending timeout inside test files, or update `./tests/user-test.data.js` variables*



##### LICENSE
* LICENCE: CC-BY-NC-ND
* SOURCE: _(https://creativecommons.org/licenses/by-nc-nd/4.0/)_

#### Thank you