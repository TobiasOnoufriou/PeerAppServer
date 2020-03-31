"use strict";
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
var mongodb_1 = require("mongodb");
var TimeManagement = /** @class */ (function () {
    function TimeManagement(user, db) {
        this.user = user;
        this.db = db;
    }
    //Time and Date will need to be parsed to the setTime will need to send the BSON id back to user.
    //Need to fix Promises to return in server.js file before commiting.
    TimeManagement.prototype.setTimeSlot = function (GroupName, users, startTime, endTime, meetingDate) {
        return __awaiter(this, void 0, void 0, function () {
            var sessionSetup, SessionsJSON, formattedUsers, _i, formattedUsers_1, i, tempObj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.user = this.user.substring(1, this.user.length - 1);
                        console.log("User " + this.user);
                        SessionsJSON = {
                            "CreatorID": new mongodb_1.ObjectId(this.user),
                            "GroupName": GroupName,
                            "Date": meetingDate,
                            "startTime": startTime,
                            "endTime": endTime,
                            "Requested": [],
                            "GroupAccepted": [],
                            "SessionActive": false
                        };
                        //This function will try and find a user with this specific username, since we will be using _id of the user, this will be removed.
                        /*this.db.collection("UserData").findOne({username:this.user}).then((doc)=>{
                            SessionsJSON.CreatorID = doc._id;
                        })*/
                        users = users.substring(1, users.length - 1);
                        formattedUsers = users.split(',');
                        console.log(formattedUsers);
                        _i = 0, formattedUsers_1 = formattedUsers;
                        _a.label = 1;
                    case 1:
                        if (!(_i < formattedUsers_1.length)) return [3 /*break*/, 4];
                        i = formattedUsers_1[_i];
                        tempObj = void 0;
                        i = i.replace(' ', '');
                        return [4 /*yield*/, this.addUsers(i).then(function (doc) {
                                return doc;
                            })];
                    case 2:
                        tempObj = _a.sent();
                        console.log(tempObj);
                        SessionsJSON.Requested.push(tempObj);
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.db.collection("Sessions").insertOne(SessionsJSON, function (err, BSONid) {
                            if (err) {
                                sessionSetup = false;
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    TimeManagement.prototype.userDeniedTime = function (id) {
        this.user = this.user.substring(1, this.user.length - 1);
        this.user = this.user.replace('"', '');
        id = id.replace('"', '');
        console.log(id);
        this.db.collection("Sessions").updateOne({ _id: new mongodb_1.ObjectId(id) }, { $pull: { Requested: new mongodb_1.ObjectId(this.user) } }, function (err, collection) {
            if (err)
                throw err;
        });
    };
    //Function will be used to accept that the user wants to go along with the meeting.
    TimeManagement.prototype.userAcceptedTime = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var queryDelete, determine;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.user = this.user.substring(1, this.user.length - 1);
                        //id = id.substring(1, id.length -1)
                        this.user = this.user.replace('"', '');
                        id = id.replace('"', '');
                        console.log(id);
                        queryDelete = {};
                        //_id = "5e31956f345b173618fc3ec1" TEST _id
                        //This will delete the value within the JSON array.
                        queryDelete["Requested." + new mongodb_1.ObjectId(this.user)] = null;
                        this.db.collection("Sessions").updateOne({ _id: new mongodb_1.ObjectId(id) }, { $pull: { Requested: new mongodb_1.ObjectId(this.user) } }, function (err, collection) {
                            if (err)
                                throw err;
                        });
                        this.db.collection("Sessions").updateOne({ _id: new mongodb_1.ObjectId(id) }, { $push: { "GroupAccepted": new mongodb_1.ObjectId(this.user) } }, function (err, collection) {
                            if (err)
                                throw err;
                            console.log("Updating");
                        });
                        return [4 /*yield*/, this.checkGroupSuccessful(id).then(function (determine) {
                            })];
                    case 1:
                        determine = _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    //Adds a user to the session collection in mongo also allow for adding multiple users at once.
    TimeManagement.prototype.addUsers = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var query, exists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.db.collection("UserData").findOne({ username: username });
                        return [4 /*yield*/, query.then(function (doc) {
                                if (doc == null) {
                                    return null;
                                }
                                else {
                                    return doc;
                                }
                            })];
                    case 1:
                        exists = _a.sent();
                        return [2 /*return*/, new mongodb_1.ObjectId(exists._id)];
                }
            });
        });
    };
    TimeManagement.prototype.getUserId = function (friendUser) {
        return __awaiter(this, void 0, void 0, function () {
            var _ids, _i, friendUser_1, u, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _ids = new Array();
                        _i = 0, friendUser_1 = friendUser;
                        _c.label = 1;
                    case 1:
                        if (!(_i < friendUser_1.length)) return [3 /*break*/, 5];
                        u = friendUser_1[_i];
                        _b = (_a = _ids).push;
                        return [4 /*yield*/, this.db.collection("UserData").findOne({ "username": u }).then(function (_id) {
                                return _id;
                            })];
                    case 2: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/, _ids];
                }
            });
        });
    };
    TimeManagement.prototype.formatFriendInfo = function (users) {
        return __awaiter(this, void 0, void 0, function () {
            var usernames, _i, users_1, user, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        usernames = new Array();
                        console.log(users);
                        _i = 0, users_1 = users;
                        _c.label = 1;
                    case 1:
                        if (!(_i < users_1.length)) return [3 /*break*/, 5];
                        user = users_1[_i];
                        console.log(user);
                        _b = (_a = usernames).push;
                        return [4 /*yield*/, this.db.collection("UserData").findOne({ "_id": new mongodb_1.ObjectId(user._id) }).then(function (user) {
                                return user.username;
                            })];
                    case 2: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [4 /*yield*/, usernames];
                    case 6: 
                    // var user = this.db.collection("UserData").find({"_id":new ObjectId(users.stringify())});
                    return [2 /*return*/, _c.sent()];
                }
            });
        });
    };
    //This function will be used to add new users to a group sessions.
    TimeManagement.prototype.joinTimeSlot = function (SessionID) {
        return null;
    };
    //This looks through the users friends list to see if they can be added.
    TimeManagement.prototype.possibleUsersToAdd = function () {
        return __awaiter(this, void 0, void 0, function () {
            var users, usernames, jsonIndex;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //console.log(this.user);
                        this.user = this.user.substring(1, this.user.length - 1);
                        return [4 /*yield*/, this.db.collection("UserData").findOne({ "_id": new mongodb_1.ObjectId(this.user) }).then(function (doc) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    //console.log("Users");
                                    return [2 /*return*/, doc.friend_id];
                                });
                            }); })];
                    case 1:
                        //console.log(new ObjectId(this.user));
                        //console.log(this.user);
                        users = _a.sent();
                        return [4 /*yield*/, this.formatFriendInfo(users).then(function (doc) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, doc];
                                });
                            }); })];
                    case 2:
                        usernames = _a.sent();
                        console.log(usernames);
                        jsonIndex = { 'usernames': usernames };
                        return [2 /*return*/, jsonIndex];
                }
            });
        });
    };
    TimeManagement.prototype.retrieveAllUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var jsonFormatUsernames, documents;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.collection("UserData").find({}).toArray().then(function (doc) {
                            var username = [];
                            for (var _i = 0, doc_1 = doc; _i < doc_1.length; _i++) {
                                var i = doc_1[_i];
                                username.push(i.username);
                            }
                            return username;
                        })];
                    case 1:
                        documents = _a.sent();
                        jsonFormatUsernames = { 'usernames': documents };
                        return [2 /*return*/, jsonFormatUsernames];
                }
            });
        });
    };
    //When home page has started up it will check if the user has been requeseted for any groups.
    TimeManagement.prototype.CheckUserJoinedSession = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sessions, jsonIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.user = this.user.substring(1, this.user.length - 1);
                        return [4 /*yield*/, this.db.collection("Sessions").find({ Requested: { $elemMatch: { $eq: new mongodb_1.ObjectId(this.user) } } }).toArray()
                                .then(function (doc) {
                                console.log(doc);
                                return doc;
                            })];
                    case 1:
                        sessions = _a.sent();
                        jsonIndex = { 'Sessions': sessions };
                        return [2 /*return*/, jsonIndex];
                }
            });
        });
    };
    TimeManagement.prototype.checkGroupSuccessful = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            var determine;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(sessionId);
                        return [4 /*yield*/, this.db.collection("Sessions").findOne({ _id: new mongodb_1.ObjectId(sessionId) }).then(function (doc) {
                                console.log(doc);
                                if (doc.Requested.length <= 0) {
                                    _this.db.collection("Sessions").updateOne({ _id: new mongodb_1.ObjectId(sessionId) }, { $set: { SessionActive: true } }, function (err, collection) {
                                        if (err)
                                            throw err;
                                        console.log("Session now active");
                                    });
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            })];
                    case 1:
                        determine = _a.sent();
                        return [2 /*return*/, determine];
                }
            });
        });
    };
    return TimeManagement;
}());
exports.TimeManagement = TimeManagement;
