import { MongoClient, BSONType, Timestamp, ObjectId } from "mongodb";
import { Session } from "inspector";
import { UserSearch } from "./UserSearch";

export class TimeManagement{
    user: string;
    db: any;

    constructor(user: string, db: any){
        this.user = user;
        this.db = db;        
    }
    //Time and Date will need to be parsed to the setTime will need to send the BSON id back to user.
    //Need to fix Promises to return in server.js file before commiting.
    async setTimeSlot(GroupName: string, users: string, startTime: string,endTime:string, meetingDate: string){
        var sessionSetup;
        this.user = this.user.substring(1, this.user.length -1);
        console.log("User "+ this.user);
        //Will need an array of users that are in the session.
        let SessionsJSON = {
            "CreatorID": new ObjectId(this.user),
            "GroupName": GroupName,
            "Date":meetingDate,
            "startTime":startTime,
            "endTime":endTime,
            "Requested":[],
            "GroupAccepted":[],
            "SessionActive": false
        };
        //This function will try and find a user with this specific username, since we will be using _id of the user, this will be removed.
        /*this.db.collection("UserData").findOne({username:this.user}).then((doc)=>{
            SessionsJSON.CreatorID = doc._id;
        })*/
        users = users.substring(1, users.length -1);
        let formattedUsers = users.split(',');
        console.log(formattedUsers);
        //For loop to assign all the users that will be in session group.
        for(var i of formattedUsers){
            let tempObj:ObjectId;
            i = i.replace(' ', '');
            tempObj = await this.addUsers(i).then((doc:any)=>{
                return doc;
            });
            console.log(tempObj);
            SessionsJSON.Requested.push(tempObj);
        }
        this.db.collection("Sessions").insertOne(SessionsJSON, (err, BSONid)=>{
            if(err){sessionSetup = false;}
        });
    }
    userDeniedTime(id:string){
        this.user = this.user.substring(1, this.user.length -1);
        this.user = this.user.replace('"', '');
        id = id.replace('"', '');
        console.log(id);
        this.db.collection("Sessions").updateOne({_id: new ObjectId(id)},{$pull: {Requested: new ObjectId(this.user)}}, (err:any, collection:any)=>{
            if(err) throw err;
        }); 
    }
    //Function will be used to accept that the user wants to go along with the meeting.
    async userAcceptedTime(id:string):Promise<boolean>{
        this.user = this.user.substring(1, this.user.length -1);
        //id = id.substring(1, id.length -1)
        this.user = this.user.replace('"', '');
        id = id.replace('"', '');
        console.log(id);
        
        var queryDelete:any = {}
        //_id = "5e31956f345b173618fc3ec1" TEST _id
        //This will delete the value within the JSON array.
        queryDelete["Requested."+new ObjectId(this.user)] = null;
        this.db.collection("Sessions").updateOne({_id: new ObjectId(id)},{$pull: {Requested: new ObjectId(this.user)}}, (err:any, collection:any)=>{
            if(err) throw err;
        }); 
        this.db.collection("Sessions").updateOne({_id:new ObjectId(id)},{$push:{"GroupAccepted":new ObjectId(this.user)}}, (err:any, collection:any)=>{
            if(err) throw err;
            console.log("Updating");
        });
        let determine = await this.checkGroupSuccessful(id).then((determine) =>{

        });
        return true;
    }
    //Adds a user to the session collection in mongo also allow for adding multiple users at once.
    async addUsers(username:String): Promise<ObjectId>{
        let query = this.db.collection("UserData").findOne({username: username});
        let exists;
        exists = await query.then((doc:any)=>{
            if(doc == null){
                return null;
            }else{
                return doc;
            }
        });
        return new ObjectId(exists._id);
    }
    async getUserId(friendUser:string[]):Promise<ObjectId[]>{
        let _ids:ObjectId[] = new Array();
        for(var u of friendUser){
            await _ids.push(await this.db.collection("UserData").findOne({"username": u}).then((_id:ObjectId)=>{
                return _id;
            }));
        }
        return _ids;
    }
    async formatFriendInfo(users: any[]): Promise<string[]>{
        let usernames:string[] = new Array();
        console.log(users);
        for(var user of users){
            console.log(user);
            await usernames.push(await this.db.collection("UserData").findOne({"_id": new ObjectId(user._id)}).then((user:any) =>{  
                return user.username;
            }));
        }
        // var user = this.db.collection("UserData").find({"_id":new ObjectId(users.stringify())});
        return await usernames;
    }
    //This function will be used to add new users to a group sessions.
    joinTimeSlot(SessionID: number): number{
        return null;
    }   
    
    //This looks through the users friends list to see if they can be added.
    async possibleUsersToAdd(): Promise<any>{
        let users:any[];
        let usernames: string[];
        let jsonIndex;
        //console.log(this.user);
        this.user = this.user.substring(1, this.user.length -1);
        //console.log(new ObjectId(this.user));
        //console.log(this.user);
        users = await this.db.collection("UserData").findOne({"_id": new ObjectId(this.user)}).then(async(doc:any)=>{
                //console.log("Users");
                return doc.friend_id;
            });
            usernames = await this.formatFriendInfo(users).then(async(doc:any)=>{
                return doc;
            });
        console.log(usernames);
        jsonIndex = {'usernames': usernames};
        return jsonIndex;
        //Will need to return _id and username.
        //this.formatFriendInfo(users);
    } 
    async retrieveAllUsers():Promise<any>{
        let jsonFormatUsernames;
        var documents:String[] = await this.db.collection("UserData").find({}).toArray().then(doc =>{
            let username:String[] =[];
            for(var i of doc){
                username.push(i.username);
            }
            return username;
        });
        jsonFormatUsernames = {'usernames': documents}
        return jsonFormatUsernames;
    }
    //When home page has started up it will check if the user has been requeseted for any groups.
    async CheckUserJoinedSession(){
        this.user = this.user.substring(1, this.user.length -1);
        let sessions = await this.db.collection("Sessions").find({Requested:{$elemMatch:{$eq: new ObjectId(this.user)}}}).toArray()
        .then(doc=>{
            console.log(doc);
            return doc;
        });
        let jsonIndex = {'Sessions': sessions};
        return jsonIndex    ;
    }
    async checkGroupSuccessful(sessionId){
        console.log(sessionId);
        let determine = await this.db.collection("Sessions").findOne({_id:new ObjectId(sessionId)}).then((doc:any) =>{
            console.log(doc);
            if(doc.Requested.length <= 0){
                this.db.collection("Sessions").updateOne({_id:new ObjectId(sessionId)},{$set:{SessionActive: true}}, (err, collection)=>{
                    if(err)throw err;
                    console.log("Session now active");
                });
                return true;
            }else{
                return false;
            }
        });
        return determine;
    }
    

}
