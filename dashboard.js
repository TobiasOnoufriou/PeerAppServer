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
var dashboard = /** @class */ (function () {
    function dashboard(db, _id) {
        this.db = db;
        this._id = _id;
    }
    ;
    //Gets the group information like the time of the meeting and who's in the group.
    dashboard.prototype.getGroupInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var adminDocs, i, documents, acceptedDoc, i, temp, i, temp, jsonIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._id = this._id.substring(1, this._id.length - 1);
                        adminDocs = [];
                        return [4 /*yield*/, this.db.collection("Sessions").find({ "CreatorID": new mongodb_1.ObjectId(this._id) }).toArray().then(function (doc) {
                                return doc;
                            })];
                    case 1:
                        adminDocs = _a.sent();
                        adminDocs["Creator"] = true;
                        for (i = 0; i < adminDocs.length; i++) {
                            adminDocs[i]['Creator'] = true;
                        }
                        documents = [];
                        return [4 /*yield*/, this.db.collection("Sessions").find({ Requested: { $elemMatch: { $eq: new mongodb_1.ObjectId(this._id) } } }).toArray().then(function (doc) {
                                return doc;
                            })];
                    case 2:
                        documents = _a.sent();
                        acceptedDoc = [];
                        return [4 /*yield*/, this.db.collection("Sessions").find({ GroupAccepted: { $elemMatch: { $eq: new mongodb_1.ObjectId(this._id) } } }).toArray().then(function (doc) {
                                console.log(doc);
                                return doc;
                            })];
                    case 3:
                        acceptedDoc = _a.sent();
                        for (i = 0; i < documents.length; i++) {
                            temp = documents[i];
                            temp["Creator"] = false;
                            documents[i] = temp;
                        }
                        for (i = 0; i < acceptedDoc.length; i++) {
                            temp = acceptedDoc[i];
                            temp["Creator"] = false;
                            acceptedDoc[i] = temp;
                        }
                        adminDocs = adminDocs.concat(documents);
                        adminDocs = adminDocs.concat(acceptedDoc);
                        jsonIndex = { 'Sessions': adminDocs };
                        console.log(jsonIndex);
                        return [2 /*return*/, jsonIndex];
                }
            });
        });
    };
    ///Will change this when the group requested actually has real users within them.
    dashboard.prototype.convertIdToUsername = function (doc) {
        return __awaiter(this, void 0, void 0, function () {
            var usernames, i, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(i < doc.length)) return [3 /*break*/, 5];
                        _b = (_a = usernames).push;
                        return [4 /*yield*/, this.db.collection("UserData").findOne({ _id: doc[i]._id }).then(function (err, doc) {
                                if (err)
                                    throw err;
                            })];
                    case 2: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/, usernames];
                }
            });
        });
    };
    return dashboard;
}());
exports.dashboard = dashboard;
