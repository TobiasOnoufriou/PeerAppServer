export class login{
    private db: any;
    private username: String;
    private password: String;

    constructor(db:any, user: String, pass: String){
        this.username = user;
        this.password = pass;
        this.db = db;
    }
    async loginUser(): Promise<string>{
        let pass = this.password;
        return await this.checkUserExists().then((doc:any)=>{
            if(doc != null){
                console.log(pass);
                if(doc.password == this.password){
                    return doc._id;
                }else{
                    return "NULL";
                }
            }else{
                return "NULL";
            }
        });
    }
    private async checkUserExists(): Promise<any>{
        return await this.db.collection("UserData").findOne({username: this.username}, {"_id": 1});
    }
}