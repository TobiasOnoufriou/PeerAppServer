'use strict'
import { MongoClient, BSONType, Timestamp, ObjectId } from "mongodb";
//Class will be used to search for username.
//Thinking of adding so it looks for email or username.
interface Users{
    name: String;
    friendID: String;

}
export class UserSearch{
    private name: string;
    private _id: string;
    private db: any;

    constructor(name:string, db: any, _id: string){
        this.name = name;
        this.db = db;
        this._id = _id;
    }
    //This will return it to the user to confirm the usernames.
    //May return the _id.
    async searchUsername(): Promise<string[]>{
        let user:string = this.name;
        let users;
        console.log(user);
        this._id = this._id.substring(1, this._id.length -1);
        var rgx = new RegExp("^" + user);
        //Problem here with the searching of users.
       users = await this.db.collection("UserData").find({$and:[{username: rgx}, {_id:{$ne: new ObjectId(this._id)}}]}).toArray()
        .then(doc =>{
            return doc;
        });
        return users;
    }
    async addFriend(friendusername:string, usernameNew:string):Promise<Boolean>{
        console.log(usernameNew);
        usernameNew = usernameNew.substring(1, usernameNew.length -1);
        let added:Boolean
        console.log(friendusername);
        added = await this.db.collection("UserData").findOne({username:friendusername}).then((doc:any)=>{
            let _id = doc._id;
            console.log(_id);
            this.db.collection("UserData").findOne({_id: new ObjectId(usernameNew)}).then((doc:any)=>{
                if(doc.friend_id.length > 0){
                for(var key in doc.friend_id){
                    if(doc.friend_id.hasOwnProperty(key)){
                        console.log("Has key");
                        return false;
                        break;
                    }else{
                        console.log(_id);
                        this.db.collection("UserData").updateOne({_id: new ObjectId(usernameNew)},{$push:{friend_id:_id}},function(err,res){
                            if(err) throw err;
                            console.log("uploaded");
                            return true;
                        });
                        break;
                    }
                }
            }
            else{
                this.db.collection("UserData").updateOne({_id: new ObjectId(usernameNew)},{$push:{friend_id:{_id}}},function(err,res){
                    if(err) throw err;
                    console.log("uploaded");
                    return true;
                }); 
            }
            });
        });
        return added;
    }
    async currentFriends(): Promise<string[]>{
        let friends:string[];
        await this.db.collection("UserData").findOne({_id: this._id}, async (doc:any)=>{
            //Will need to go through all the values within friend_id.
            await this.db.collection("UserData").find({"_id":{"$in":doc.friend_id}}).then((users:any)=>{
                friends = users;
            });
        });
        return friends;
    }

}