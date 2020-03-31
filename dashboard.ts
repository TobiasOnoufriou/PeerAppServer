import { MongoClient, BSONType, Timestamp, ObjectId } from "mongodb";

export class dashboard
{ 
    private db : any;
    private _id : string;

    constructor(db : any, _id:string)
    {
        this.db = db;
        this._id = _id;
    };
    //Gets the group information like the time of the meeting and who's in the group.
    async getGroupInfo():Promise<any>
    {

        this._id = this._id.substring(1, this._id.length - 1);
        
        //This will also need to check what groups they are in.
        //This will store all of the sessions which the user is in.
        let adminDocs = [];
        adminDocs = await this.db.collection("Sessions").find({"CreatorID": new ObjectId(this._id)}).toArray().then((doc:any)=>{ 
           
            return doc; 
        });
        adminDocs["Creator"] = true;
        for(var i = 0; i < adminDocs.length; i++){

            adminDocs[i]['Creator']= true;
        }
        let documents = [];
        documents = await this.db.collection("Sessions").find({Requested:{$elemMatch:{$eq: new ObjectId(this._id)}}}).toArray().then((doc:any)=>{
            return doc;
        });
        let acceptedDoc = [];
        acceptedDoc = await this.db.collection("Sessions").find({GroupAccepted:{$elemMatch:{$eq: new ObjectId(this._id)}}}).toArray().then((doc:any)=>{
            console.log(doc);
            return doc;
        });

        for(var i = 0; i < documents.length; i++){
            var temp = documents[i];
            temp["Creator"] = false;
            documents[i] = temp;
        }
        
        adminDocs = adminDocs.concat(documents).concat(acceptedDoc);
        let jsonIndex = {'Sessions': adminDocs};
        console.log(jsonIndex)
        return jsonIndex;
    }
    ///Will change this when the group requested actually has real users within them.
    async convertIdToUsername(doc:any[]): Promise<string[]>{
        let usernames: string[];
        for(var i = 0; i < doc.length; i++){
            await usernames.push(await this.db.collection("UserData").findOne({_id: doc[i]._id}).then((err:Error,doc:any)=>{
                if(err) throw err;
                
            }));
        }
        return usernames;
    }
}