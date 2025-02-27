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
var mongodb_1 = require("mongodb");
var UserSearch = /** @class */ (function () {
    function UserSearch(name, db, _id) {
        this.name = name;
        this.db = db;
        this._id = _id;
    }
    //This will return it to the user to confirm the usernames.
    //May return the _id.
    UserSearch.prototype.searchUsername = function () {
        return __awaiter(this, void 0, void 0, function () {
            var user, users, rgx, _friendsId, friendDoc, _i, friendDoc_1, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = this.name;
                        console.log(user);
                        this._id = this._id.substring(1, this._id.length - 1);
                        rgx = new RegExp("^" + user);
                        _friendsId = new Array();
                        return [4 /*yield*/, this.db.collection("UserData").findOne({ _id: new mongodb_1.ObjectId(this._id) }).then(function (userDoc) {
                                return userDoc.friend_id;
                            })];
                    case 1:
                        friendDoc = _a.sent();
                        for (_i = 0, friendDoc_1 = friendDoc; _i < friendDoc_1.length; _i++) {
                            i = friendDoc_1[_i];
                            _friendsId.push(new mongodb_1.ObjectId(i._id));
                        }
                        return [4 /*yield*/, this.db.collection("UserData").find({ $and: [{ username: rgx }, { _id: { $ne: new mongodb_1.ObjectId(this._id) } }, { _id: { $nin: _friendsId } }] }).toArray()
                                .then(function (doc) {
                                return doc;
                            })];
                    case 2:
                        users = _a.sent();
                        return [2 /*return*/, users];
                }
            });
        });
    };
    UserSearch.prototype.addFriend = function (friendusername, usernameNew) {
        return __awaiter(this, void 0, void 0, function () {
            var added;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        usernameNew = usernameNew.substring(1, usernameNew.length - 1);
                        return [4 /*yield*/, this.db.collection("UserData").findOne({ username: friendusername }).then(function (doc) {
                                var _id = doc._id;
                                _this.db.collection("UserData").findOne({ _id: new mongodb_1.ObjectId(usernameNew) }).then(function (doc) {
                                    if (doc.friend_id.length > 0) {
                                        for (var _i = 0, _a = doc.friend_id; _i < _a.length; _i++) {
                                            var key = _a[_i];
                                            if (key._id.equals(_id)) {
                                                console.log("Has key");
                                                break;
                                                return false;
                                            }
                                            else {
                                                _this.db.collection("UserData").updateOne({ _id: new mongodb_1.ObjectId(usernameNew) }, { $push: { friend_id: { _id: _id } } }, function (err, res) {
                                                    if (err)
                                                        throw err;
                                                    console.log("Thing Uploaded");
                                                    return true;
                                                });
                                                break;
                                            }
                                        }
                                    }
                                    else {
                                        _this.db.collection("UserData").updateOne({ _id: new mongodb_1.ObjectId(usernameNew) }, { $push: { friend_id: { _id: _id } } }, function (err, res) {
                                            if (err)
                                                throw err;
                                            console.log("uploaded");
                                            return true;
                                        });
                                    }
                                });
                            })];
                    case 1:
                        added = _a.sent();
                        return [2 /*return*/, added];
                }
            });
        });
    };
    UserSearch.prototype.currentFriends = function () {
        return __awaiter(this, void 0, void 0, function () {
            var friends;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.collection("UserData").findOne({ _id: this._id }, function (doc) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: 
                                    //Will need to go through all the values within friend_id.
                                    return [4 /*yield*/, this.db.collection("UserData").find({ "_id": { "$in": doc.friend_id } }).then(function (users) {
                                            friends = users;
                                        })];
                                    case 1:
                                        //Will need to go through all the values within friend_id.
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, friends];
                }
            });
        });
    };
    return UserSearch;
}());
exports.UserSearch = UserSearch;
