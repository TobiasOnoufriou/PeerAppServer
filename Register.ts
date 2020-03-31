import { json } from "body-parser";

export class Register {
    private MongoClient: any;
    private userdata: any;
    private res:any
    private registerStatus = {
        "email": false as Boolean,
        "username": false as Boolean,
        "password": false as Boolean,
        "name": false as Boolean,
    };


    constructor(MongoClient:any, userdata:any, res:any){
      /*this.req = req;
      this.res = res;*/
      this.userdata = userdata.body;
      this.MongoClient = MongoClient;
      console.log(this.userdata);
      
    }
    private checkConfirmEmail(email:string, confirmEmail: string): void{
        if(email == confirmEmail){
            this.registerStatus.email = true;
            this.userdata.email = email;
        }
    }
    private checkPassword(password:string, confirmPassword: string): void{
        if(password.length > 0 && password == confirmPassword){
            this.registerStatus.password = true;
            this.userdata.password = password;
        }
    }
    private checkName(firstname:string, secondname:string): void{
        if(firstname.length > 0 && secondname.length > 0){
            this.registerStatus.name = true;
        }
    }
    //Needs to be changed towards not being websocket.
    async sendData(): Promise<Boolean>{
        let data = false;
        console.log("Sending data");
        //this.checkConfirmEmail(this.userdata.email, this.userdata.confirmEmail);
        this.registerStatus.email = true;
        this.checkPassword(this.userdata.password, this.userdata.confirmPassword);
        this.checkName(this.userdata.firstname, this.userdata.secondname);
        await this.checkIfUsernameExists(this.userdata.username).then((doc)=>{
            return doc;
        });
        this.userdata["friend_id"] = [];
        var giveData;
        var temp:any = this.registerStatus;
        console.log(this.registerStatus);
        giveData = Object.keys(temp).every(function(k){
            return temp[k];
        });
        
        if(giveData){
            //User was registered.  
            this.MongoClient.collection("UserData").insertOne(this.userdata);
            data = true;
        }else{
            data = false;
        }
        
        return data;
    } 

    //May not be used but for future developments.
    encryptPassword(password:any){
        console.log(password);
        return password;
    }
    private async checkIfUsernameExists(usernameReg:any){
        let query = this.MongoClient.collection("UserData").findOne({username:usernameReg});
        let tempQuery = this.registerStatus.username;
        this.registerStatus.username = await query.then((doc:any) => {
            if(doc){
                console.log("User Exists already");
                return false;  
            }else{
                console.log("Username has been sent to database");
                return true;
            }
        });
        this.userdata.username = usernameReg; 
        
    }
}
//module.exports = Register;