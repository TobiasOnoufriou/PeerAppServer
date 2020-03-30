'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var app = require('express')();
var http = require('http').Server(app);
var mongo = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var port = 3000;
var TimeManagement_1 = require("./TimeManagement");
var dotenv = require("dotenv");
var Register_1 = require("./Register");
var UserSearch_1 = require("./UserSearch");
var dashboard_1 = require("./dashboard");
var login_1 = require("./login");
//const client = new MongoClient(uri, {useNewUrlParser: true});
//Dotenv is used so it hides the the contents of the login information for mongodb.
dotenv.config();
//This is so the JSON data being parsed through can be read by the express api.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var db;
//This part is used to connect to the mongo server and constantly be connected.
mongo.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err, client) {
    //This is the database on MongoDB atlas which the server is connected.
    db = client.db('GroupProject');
    if (err) {
        console.error(err);
        return;
    }
});
//This JSON information which will be stored on the Mongo database.
var userdata = {
    "username": "",
    "password": "",
    "DOB": "",
    "TimeZone": "",
    "Friends": []
};
//Test app.get function will be removed.
app.get('/', function (req, res) {
    console.log("Server works");
});
//When creating client side will need parse through the req Time, Date and all the users
app.post('/sessions/setSlot', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var timeSlot, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                timeSlot = new TimeManagement_1.TimeManagement(req.body._id, db);
                console.log(req.body);
                return [4 /*yield*/, timeSlot.setTimeSlot(req.body.GroupName, req.body.users, req.body.startTime, req.body.endTime, req.body.Date).then(function (doc) {
                        return doc;
                    })];
            case 1:
                data = _a.sent();
                res.send(data);
                res.end();
                return [2 /*return*/];
        }
    });
}); });
//This is a request to setup a session.
app.post('/sessions/init', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var init, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                init = new TimeManagement_1.TimeManagement(req.body._id, db);
                return [4 /*yield*/, init.retrieveAllUsers().then(function (doc) {
                        return doc;
                    })];
            case 1:
                data = _a.sent();
                res.send(data);
                res.end();
                return [2 /*return*/];
        }
    });
}); });
app.post('/login/setupHome', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var log, _id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log = new login_1.login(db, req.body.username, req.body.password);
                return [4 /*yield*/, log.loginUser().then(function (_id) {
                        return _id;
                    })];
            case 1:
                _id = _a.sent();
                console.log(_id);
                res.send(_id);
                res.end();
                return [2 /*return*/];
        }
    });
}); });
app.post('/register', function (req, res) {
    console.log(req.query);
    var reg = new Register_1.Register(db, req, res);
    var created = reg.sendData();
    console.log(created);
    //Validation for the user to know that an account has been created.
    if (created) {
        res.send("true");
    }
    else {
        //Temporary till app is fully set up
        res.send("false");
    }
    res.end();
});
//-------- NEW REQUESTS WHICH ARE NEEED ----------////////
//post('/friend/newRequest') this will be called on the home page every time the user sets up the app. May put it in a new class call Home.
//post('/home/Requests) which will check for all requests.
///This will be done when the users accepts a request for a meeting
//post('/sessions/acceptRequest')
//post('/sessions/denyRequest')
//post('/sessions/checkSessionSuccessful')
//These to requests are a maybe due to not having request at the moment for friends.
//post('/friend/acceptRequest')
//post('/friend/denyRequest')
app.post('/home/Requests', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var time, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.body._id);
                time = new TimeManagement_1.TimeManagement(req.body._id, db);
                return [4 /*yield*/, time.CheckUserJoinedSession().then(function (doc) {
                        return doc;
                    })];
            case 1:
                data = _a.sent();
                res.send(data);
                res.end();
                return [2 /*return*/];
        }
    });
}); });
app.post('/sessions/acceptRequest', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var acceptTime;
    return __generator(this, function (_a) {
        console.log(req.body);
        acceptTime = new TimeManagement_1.TimeManagement(req.body._id, db);
        acceptTime.userAcceptedTime(req.body.sessionId);
        res.send("session accepted");
        res.end();
        return [2 /*return*/];
    });
}); });
app.post('/sessions/denyRequest', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var denyTime;
    return __generator(this, function (_a) {
        denyTime = new TimeManagement_1.TimeManagement(req.body._id, db);
        denyTime.userDeniedTime(req.body.sessionId);
        res.send("session denied");
        res.end();
        return [2 /*return*/];
    });
}); });
//Need to send the page the user is on.
//or could have a button for view more results
app.post('/friend/searchFriend', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var search, promise;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                search = new UserSearch_1.UserSearch(req.body.search /*This will need to replaced with req.search*/, db, req.body._id);
                return [4 /*yield*/, search.searchUsername().then(function (promise) {
                        return promise;
                    })];
            case 1:
                promise = _a.sent();
                res.send(promise);
                res.end();
                return [2 /*return*/];
        }
    });
}); });
//Have a click based system or add new database
//Client side will need to send the username and their personal username. This will be called on button click.
app.post('/friend/addFriend', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, updated;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = new UserSearch_1.UserSearch(req.body.user /*Same here, Might change to _id if they recieve _id from searchFriend request*/, db, req.body._id);
                //user.addFriend(req.query.json.friendusername.toString(), req.query.json.username.toString());
                console.log(req.body);
                return [4 /*yield*/, user.addFriend(req.body.user, req.body._id)];
            case 1:
                updated = _a.sent();
                res.send(updated);
                res.end();
                return [2 /*return*/];
        }
    });
}); });
app.post('/dashboard/accessGroupInfo', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var dash, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dash = new dashboard_1.dashboard(db, req.body._id);
                return [4 /*yield*/, dash.getGroupInfo()];
            case 1:
                data = _a.sent();
                res.send(data);
                res.end();
                return [2 /*return*/];
        }
    });
}); });
app.listen(process.env.PORT || 3000, function () {
    console.log("listening on *: 3000");
});
