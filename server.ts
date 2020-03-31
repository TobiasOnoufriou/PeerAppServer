'use strict'
var app = require('express')();
var http = require('http').Server(app);
const mongo = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const port = 3000;

import {TimeManagement} from "./TimeManagement";
import * as dotenv from 'dotenv';
import { Register } from "./Register";
import {UserSearch} from "./UserSearch";
import {dashboard} from "./dashboard";
import { login } from "./login";
//const client = new MongoClient(uri, {useNewUrlParser: true});
//Dotenv is used so it hides the the contents of the login information for mongodb.
dotenv.config();
//This is so the JSON data being parsed through can be read by the express api.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
let db;
//This part is used to connect to the mongo server and constantly be connected.
mongo.connect(process.env.MONGO_URI, {
    useNewUrlParser:true,
    useUnifiedTopology:true
},(err, client)=>{
    //This is the database on MongoDB atlas which the server is connected.
    db = client.db('GroupProject');
    if(err){
        console.error(err);
        return
    }
})
//This JSON information which will be stored on the Mongo database.
var userdata = {
    "username":"",
    "password":"",
    "DOB": "",
    "TimeZone": "",
    "Friends":[]
};
//Test app.get function will be removed.
app.get('/', function(req, res){
	console.log("Server works");    
});
//When creating client side will need parse through the req Time, Date and all the users
app.post('/sessions/setSlot', async (req:any, res:any)=>{
    console.log(req.body._id);
    let timeSlot = new TimeManagement(req.body._id, db);
    console.log(req.body);
    //The user will send the user ids which they want to  to the group.
    //let users:string[] = ["812738718231","2131231","1231231232131"];
    timeSlot.setTimeSlot(req.body.GroupName,req.body.users,req.body.startTime,req.body.endTime, req.body.Date);
    res.send("Craeted");
    res.end();
});
//This is a request to setup a session.
app.post('/sessions/init', async (req:any, res:any)=>{
    let init = new TimeManagement(req.body._id, db);
    /*let data = await init.possibleUsersToAdd().then((doc:any)=>{
       return doc;
    });*/
    let data = await init.possibleUsersToAdd().then((doc:any) =>{
        return doc;
    });
    res.send(data);
    res.end();
});

app.post('/login/setupHome',async (req:any, res:any)=>{
    
    //This will need to check if users have been added to a sessions or requested
    let log = new login(db, req.body.username, req.body.password);

    let _id:string = await log.loginUser().then((_id:any)=>{
            return _id;
    });
    console.log(_id);
    res.send(_id);
    res.end();
});

app.post('/register', (req:any, res: any)=>{
    console.log(req.query);
    let reg = new Register(db, req, res);
    let created = reg.sendData();
    console.log(created);
    //Validation for the user to know that an account has been created.
    if(created){
        res.send("true");
    }else{
        //Temporary till app is fully set up
        res.send("false");
    }
    res.end();

});
app.post('/home/Requests', async (req:any, res:any)=>{
    console.log(req.body._id)
    let time = new TimeManagement(req.body._id, db);
    
    let data = await time.CheckUserJoinedSession().then((doc:any)=>{
        return doc;
    });
    res.send(data);
    res.end();
});
app.post('/sessions/acceptRequest', async (req:any, res: any)=>{
    console.log(req.body);
    let acceptTime = new TimeManagement(req.body._id, db);
    acceptTime.userAcceptedTime(req.body.sessionId);
    res.send("session accepted");
    res.end();
});
app.post('/sessions/denyRequest',async (req:any, res: any)=>{
    let denyTime = new TimeManagement(req.body._id, db);
    denyTime.userDeniedTime(req.body.sessionId);
    res.send("session denied");
    res.end();
});
//Need to send the page the user is on.
//or could have a button for view more results
app.post('/friend/searchFriend', async (req:any, res:any)=>{
    let search = new UserSearch(req.body.search, db, req.body._id);
    let promise = await search.searchUsername().then((promise:string[])=>{
        return promise;
     });
     res.send(promise);
     res.end();
});
//Have a click based system or add new database

//Client side will need to send the username and their personal username. This will be called on button click.
app.post('/friend/addFriend', async (req:any, res:any)=>{
    let user = new UserSearch(req.body.user /*Same here, Might change to _id if they recieve _id from searchFriend request*/, db,req.body._id);
    //user.addFriend(req.query.json.friendusername.toString(), req.query.json.username.toString());
    console.log(req.body);
    let updated = await user.addFriend(req.body.user, req.body._id);
    res.send(updated);
    res.end();
});

app.post('/dashboard/accessGroupInfo', async (req:any, res:any)=>
{
    //let dash = new dashboard(db, req._id);
    let dash = new dashboard(db, req.body._id);
    //This will send the dashboard information to the client.
    let data = await dash.getGroupInfo()
    res.send(data);
    res.end();
});
app.listen(process.env.PORT || 3000, function(){
    console.log("listening on *: 3000");
});

