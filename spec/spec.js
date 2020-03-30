import { MongoClient } from "mongodb";

//import { TimeManagement } from "../TimeManagement";
//import {login} from "../login";

var TimeManagement = require("../TimeManagement");

beforeEach(function(){
    TimeManagement = new TimeManagement();
});

it("Should get user id",function(){
   const TimeManagement = new TimeManagement("asd",); 
   expect()
});


describe("Joining a session", function(){
    it('add', function(){
        let result = TimeManagement.addUser("hi")
        expect(result).toBe(!null);
    })

})