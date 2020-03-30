import { ObjectId } from "./node_modules/@types/bson";


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
    async getGroupInfo():Promise<any[]>
    {

        //This will also need to check what groups they are in.
        //This will store all of the sessions which the user is in.
        let adminDocs:JSON[] = [];
        await this.db.collection("Sessions").find({"CreatorID": this._id}).forEach(function(doc:any) {
           adminDocs.push(doc); 
        });
        adminDocs["Creator"] = true;
        for(var i = 0; i < adminDocs.length; i++){

            adminDocs[i]['Creator']= true;
        }
        let documents:JSON[] = [];
        await this.db.collection("Sessions").find({},{_id:0, requested:{$elemMatch:{$eq:this._id}} }).forEach(function(doc:any){
            documents.push(doc);
        });
        for(var i = 0; i < documents.length; i++){
            var temp = documents[i];
            temp["Creator"] = false;
            documents[i] = temp;
        }
        adminDocs.concat(documents);  
        return adminDocs;
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