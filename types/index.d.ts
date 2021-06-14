import { Router } from "express"
import {Express} from "express"
import JWT  from 'jsonwebtoken'
declare namespace types {

    // example: https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty
    declare type APIQuery = "topstories" | "beststories" | "newstories" | "user"
    declare type APIstoryTypes = "topstories" | "beststories" | "newstories"

    declare interface APIuser{
        about:string;
        created:number;
        delay:number;
        id:string;
        karma:number;
        submitted:Array<number>
    }

    declare type APIstories = Array<number>

    declare interface APIitem{
        id:number; // The item's unique id.
        deleted?:boolean; //true if the item is deleted.
        type?: 'job' | 'story' | 'comment' |  'poll' | 'pollopt';
        by?:string; // The username of the item's author.
        time?: number; // Creation date of the item, in Unix Time.
        text?:string; // The comment, story or poll text. HTML.
        dead?:boolean // true if the item is dead.
        parent?:number; // The comment's parent: either another comment or the relevant story.
        poll?:number // The pollopt's associated poll.
        kids?:Array<number> // kids	The ids of the item's comments, in ranked display order.
        url?:string; // The URL of the story.
        score?:number; // The story's score, or the votes for a pollopt.
        title?:string; // The title of the story, poll or job. HTML.
        parts?:Array<number>; // A list of related pollopts, in display order.
        descendants?:number; // In the case of stories or polls, the total comment count.
    }

    declare interface ApiParams{
        type:'user'| 'story' |'item'
        value:APIQuery | string
    }


    type Tenv =  'development' | 'production'
    declare interface IRouter extends Router {}
    declare interface IJWT extends JWT{}
    declare type TReq  = Request
    declare type TResp = Response
    declare type TExpress = Express

    declare interface IExpressHandler{
        (req:TReq,res:TResp):void
    }

    declare interface Iconfig {
        env?: Tenv;
        HOST:string;
        port:number;
        secret:string
        viewsDir?:string;
        timeout?:number;
        mongo?:{
            remote?:boolean;
            database?:string;
            defaultUser?:string;
        };
        API?:{
            base:string;
        },
    }

}

export as namespace types

export { types }


