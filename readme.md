## XYZ NEWS SERVER
An api interpretation of the existing HackerNews/api, for the purpouse of integration with aungular/mvc client. 


### Base api from HackerNews
Refer to https://github.com/HackerNews/API


### API
Available server routes:

```sh
# returns user detail response via HackerNews API
(GET) http://localhost:5000/api/user/:userName 

# available story types: [topstories,beststories,newstories]
# optional query ?paged={number} to return results from forward index, up to available {pagedTotal}
(GET) http://localhost:5000/api/stories/:type


```
