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
var Register = /** @class */ (function () {
    function Register(MongoClient, userdata, res) {
        this.registerStatus = {
            "email": false,
            "username": false,
            "password": false,
            "name": false
        };
        /*this.req = req;
        this.res = res;*/
        this.userdata = userdata.body;
        this.MongoClient = MongoClient;
        console.log(this.userdata);
    }
    Register.prototype.checkConfirmEmail = function (email, confirmEmail) {
        if (email == confirmEmail) {
            this.registerStatus.email = true;
            this.userdata.email = email;
        }
    };
    Register.prototype.checkPassword = function (password, confirmPassword) {
        if (password.length > 0 && password == confirmPassword) {
            this.registerStatus.password = true;
            this.userdata.password = password;
        }
    };
    Register.prototype.checkName = function (firstname, secondname) {
        if (firstname.length > 0 && secondname.length > 0) {
            this.registerStatus.name = true;
        }
    };
    //Needs to be changed towards not being websocket.
    Register.prototype.sendData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, giveData, temp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = false;
                        console.log("Sending data");
                        //this.checkConfirmEmail(this.userdata.email, this.userdata.confirmEmail);
                        this.registerStatus.email = true;
                        this.checkPassword(this.userdata.password, this.userdata.confirmPassword);
                        this.checkName(this.userdata.firstname, this.userdata.secondname);
                        return [4 /*yield*/, this.checkIfUsernameExists(this.userdata.username).then(function (doc) {
                                return doc;
                            })];
                    case 1:
                        _a.sent();
                        this.userdata["friend_id"] = [];
                        temp = this.registerStatus;
                        console.log(this.registerStatus);
                        giveData = Object.keys(temp).every(function (k) {
                            return temp[k];
                        });
                        if (giveData) {
                            //User was registered.  
                            this.MongoClient.collection("UserData").insertOne(this.userdata);
                            data = true;
                        }
                        else {
                            data = false;
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    //May not be used but for future developments.
    Register.prototype.encryptPassword = function (password) {
        console.log(password);
        return password;
    };
    Register.prototype.checkIfUsernameExists = function (usernameReg) {
        return __awaiter(this, void 0, void 0, function () {
            var query, tempQuery, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        query = this.MongoClient.collection("UserData").findOne({ username: usernameReg });
                        tempQuery = this.registerStatus.username;
                        _a = this.registerStatus;
                        return [4 /*yield*/, query.then(function (doc) {
                                if (doc) {
                                    console.log("User Exists already");
                                    return false;
                                }
                                else {
                                    console.log("Username has been sent to database");
                                    return true;
                                }
                            })];
                    case 1:
                        _a.username = _b.sent();
                        this.userdata.username = usernameReg;
                        return [2 /*return*/];
                }
            });
        });
    };
    return Register;
}());
exports.Register = Register;
//module.exports = Register;
