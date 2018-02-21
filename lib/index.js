"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
var querystring = __importStar(require("querystring"));
var crypto = __importStar(require("crypto"));
var Joi = __importStar(require("joi"));
/**
* Default endPoint
*/
var EndPoint = 'https://api.einvoice.nat.gov.tw';
/**
 * `TaiwanEInvoice` is a class that wraps Taiwan e-invoice API.
 */
var TaiwanEInvoice = /** @class */ (function () {
    /**
    * Constructor
    * @param appID App ID,apply from [MOF E-Invoice platform](https://www.einvoice.nat.gov.tw/APMEMBERVAN/APIService/Registration).
    * @param apiKey API Key,apply from [MOF E-Invoice platform](https://www.einvoice.nat.gov.tw/APMEMBERVAN/APIService/Registration).
    */
    function TaiwanEInvoice(appID, apiKey) {
        /**
        *UUID,universally unique identifier of inquirer
        */
        this.uuID = '';
        /**
        *txID,Transaction ID of inquirer
        */
        this.txID = '';
        /**
        * inquirer's identity.
        */
        this.identity = InquirerIdentity.Common;
        //super();
        this.appID = appID;
        this.apiKey = apiKey;
    }
    /**
    * Sort request parameters by key in ascending order.
    * Must use before `signature`.
    * @param param unsort request parameters.
    */
    TaiwanEInvoice.paramSort = function (param) {
        return Object.keys(param).sort().reduce(function (acc, k) {
            acc[k] = param[k];
            return acc;
        }, {});
    };
    /**
    * Tell API the UUID or the txID of the inquirer.
    * @param id UUID or txID .
    * @param identity inquirer's identity. Default is `InquirerIdentity.Common` . (Optional)
    */
    TaiwanEInvoice.prototype.inquirer = function (id, identity) {
        switch (identity) {
            case InquirerIdentity.Common:
                this.identity = identity;
                this.uuID = id;
                break;
            case InquirerIdentity.BusinessEntity:
                this.identity = identity;
                this.txID = id;
                break;
            default:
                this.uuID = id;
                if (identity !== undefined)
                    throw new Error("Invalid inquirer identity.");
        }
        return this;
    };
    /**
    *
    * @param action request parameter `action` literal specified in the API
    * @param param other request parameters specified in the API
    */
    TaiwanEInvoice.prototype.action = function (action, param) {
        var _this = this;
        if (typeof param !== 'object')
            throw new Error('param must be specified an plain object.');
        var actions = undefined;
        var configs = undefined;
        switch (this.identity) {
            case InquirerIdentity.Common:
                actions = RequestCommonAction; //real object at runtime
                configs = APIRequest.CommonConfigs;
                break;
            case InquirerIdentity.BusinessEntity:
                actions = RequestBusinessuAction; //real object at runtime
                configs = APIRequest.BusinessConfigs;
                break;
            default:
                throw new Error("Invalid inquirer identity.");
        }
        var actionIndex = actions[action];
        if (actionIndex === undefined)
            throw new Error("Invalid request action '" + action + "'");
        var config = configs[actionIndex];
        var paramters = __assign({}, param, config.stableParam);
        if (paramters.hasOwnProperty('appID'))
            paramters.appID = this.appID;
        if (paramters.hasOwnProperty('appId'))
            paramters.appId = this.appID;
        if (paramters.hasOwnProperty('UUID'))
            paramters.UUID = this.uuID;
        if (paramters.hasOwnProperty('uuid'))
            paramters.uuid = this.uuID;
        if (paramters.hasOwnProperty('TxID'))
            paramters.TxID = this.txID;
        //must sort for signature
        paramters = TaiwanEInvoice.paramSort(paramters);
        return new Promise(function (res, rej) {
            var _a = Joi.validate(paramters, config.schema, { convert: false }), value = _a.value, error = _a.error;
            if (error)
                rej(error);
            var endPoint = config.endPoint, path = config.path, method = config.method, needToSign = config.needToSign;
            endPoint = endPoint || EndPoint;
            //convert Date to unix time stamp
            if (value.timeStamp instanceof Date)
                value.timeStamp = Math.floor(value.timeStamp.getTime() / 1000);
            if (value.expTimeStamp instanceof Date)
                value.expTimeStamp = Math.floor(value.expTimeStamp.getTime() / 1000);
            //Generate signature from query string.
            if (needToSign) {
                var qstr = querystring.stringify(value, undefined, undefined, {
                    encodeURIComponent: querystring.unescape //must unescape
                });
                var hmac = crypto.createHmac('sha1', _this.apiKey); //HNAC-SHA1
                hmac.update(qstr);
                value.signature = hmac.digest('base64');
            }
            res({ path: "" + endPoint + path, method: method, param: value });
        });
    };
    return TaiwanEInvoice;
}());
exports.TaiwanEInvoice = TaiwanEInvoice;
/**
* Enumerate inquirer's identity.
*/
var InquirerIdentity;
(function (InquirerIdentity) {
    /**
    * General user identity.
    */
    InquirerIdentity[InquirerIdentity["Common"] = 0] = "Common";
    /**
    * Business user identity.
    */
    InquirerIdentity[InquirerIdentity["BusinessEntity"] = 1] = "BusinessEntity";
})(InquirerIdentity = exports.InquirerIdentity || (exports.InquirerIdentity = {}));
/**
* Enumerate card type specified in the API.
*/
var CarrierCardType;
(function (CarrierCardType) {
    /**
    * Mobile barcode
    */
    CarrierCardType["Mobile"] = "3J0002";
    /**
    * EasyCard
    */
    CarrierCardType["EasyCard"] = "1K0001";
    /**
    * iPASS
    */
    CarrierCardType["IPASS"] = "1H0001";
    /**
    * MOICA Citizen Digital Certificate
    */
    CarrierCardType["MOICACDC"] = "CQ0001";
    /**
    * icash
    */
    CarrierCardType["ICASH"] = "2G0001";
})(CarrierCardType = exports.CarrierCardType || (exports.CarrierCardType = {}));
/**
* Enumerate request parameter `action` literals specified in the API for common user.
*/
var RequestCommonAction;
(function (RequestCommonAction) {
    /**
    * Query prize numbers.
    */
    RequestCommonAction[RequestCommonAction["QryWinningList"] = 0] = "QryWinningList";
    /**
    * Query invoice seller information.
    */
    RequestCommonAction[RequestCommonAction["qryInvHeader"] = 1] = "qryInvHeader";
    /**
    * Query invoice details.
    */
    RequestCommonAction[RequestCommonAction["qryInvDetail"] = 2] = "qryInvDetail";
    /**
    * Query registered Social welfare groups.
    */
    RequestCommonAction[RequestCommonAction["qryLoveCode"] = 3] = "qryLoveCode";
    /**
    * Query seller information about invoices held in the carrier.
    */
    RequestCommonAction[RequestCommonAction["carrierInvChk"] = 4] = "carrierInvChk";
    /**
    * Query details about invoices held in the carrier.
    */
    RequestCommonAction[RequestCommonAction["carrierInvDetail"] = 5] = "carrierInvDetail";
    /**
    * Donate the invoice to the social welfare group.
    */
    RequestCommonAction[RequestCommonAction["carrierInvDnt"] = 6] = "carrierInvDnt";
    /**
    * Query valid aggregate carriers.
    */
    RequestCommonAction[RequestCommonAction["qryCarrierAgg"] = 7] = "qryCarrierAgg";
    /**
    * Mobile barcode registration without enter password.
    */
    RequestCommonAction[RequestCommonAction["generalCarrierReg"] = 8] = "generalCarrierReg";
    /**
    * Binding financial account or electronic payment account.
    */
    RequestCommonAction[RequestCommonAction["generalCarrierBank"] = 9] = "generalCarrierBank";
    /**
    * Query mobile barcode.
    */
    RequestCommonAction[RequestCommonAction["etBarcode"] = 10] = "etBarcode";
    /**
    * Mobile barcode registration need enter password.
    */
    RequestCommonAction[RequestCommonAction["pubCarVerReg"] = 11] = "pubCarVerReg";
    /**
    * Change password.
    */
    RequestCommonAction[RequestCommonAction["changeVer"] = 12] = "changeVer";
    /**
    * Forget password.
    */
    RequestCommonAction[RequestCommonAction["forgetVer"] = 13] = "forgetVer";
    /**
    * Carrier aggregate to mobile barcode.
    */
    RequestCommonAction[RequestCommonAction["carrierAction"] = 14] = "carrierAction";
})(RequestCommonAction || (RequestCommonAction = {}));
/**
* Enumerate request parameter `action` literals specified in the API for common user.
*/
var RequestBusinessuAction;
(function (RequestBusinessuAction) {
    /**
    * Verify whether the mobile barcode exists on the e-invoice platform.
    */
    RequestBusinessuAction[RequestBusinessuAction["bcv"] = 0] = "bcv";
    /**
    * Verify whether the LoveCode exists on the e-invoice platform.
    */
    RequestBusinessuAction[RequestBusinessuAction["preserveCodeCheck"] = 1] = "preserveCodeCheck";
    /**
    * Query BIN of the credit card carrier.
    */
    RequestBusinessuAction[RequestBusinessuAction["cardBin"] = 2] = "cardBin";
    /**
    * Query bankNo of the credit card carrier.
    */
    RequestBusinessuAction[RequestBusinessuAction["creditCardBan"] = 3] = "creditCardBan";
    /**
    * Query receive route status.
    */
    RequestBusinessuAction[RequestBusinessuAction["qryRecvRout"] = 4] = "qryRecvRout";
    /**
    * Query whether is business entity.
    */
    RequestBusinessuAction[RequestBusinessuAction["qryBanUnitTp"] = 5] = "qryBanUnitTp";
})(RequestBusinessuAction || (RequestBusinessuAction = {}));
/**
* Inner module.Define default request config with the API spec .
*/
var APIRequest;
(function (APIRequest) {
    /**
    * Enumerate HTTP request methods.
    */
    var Method;
    (function (Method) {
        Method["GET"] = "GET";
        Method["POST"] = "POST";
    })(Method = APIRequest.Method || (APIRequest.Method = {}));
    /**
    * invTerm schema
    */
    var Sch_invTerm = Joi.string().regex(/^[0-9]{5}$/, 'yyyMM').required();
    /**
    * invDate schema
    */
    var Sch_invDate = Joi.string().regex(/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/, 'yyyy/MM/dd').required();
    /**
    * invNum schema
    */
    var Sch_invNum = Joi.string().regex(/^[A-Z]{2}[0-9]{8}$/, '[A-Z]{2}[0-9]{8}').required();
    /**
    * bar code type schema
    */
    var Sch_barcode = Joi.string().valid('QRCode', 'Barcode').required();
    /**
    * cardType schema
    */
    var Sch_cardType = Joi.string().valid(CarrierCardType.EasyCard, CarrierCardType.ICASH, CarrierCardType.IPASS, CarrierCardType.MOICACDC, CarrierCardType.Mobile).required();
    /**
    * Y/N schema
    */
    var Sch_YN = Joi.string().valid('Y', 'N').required();
    /**
    * verify code (password) schema
    */
    var Sch_verify = Joi.string().regex(/^(?=.*\d)(?=.*[a-zA-Z])([^'"+=?\\\/\s]){8,16}$/, 'password').required();
    /**
    * digit string schema
    */
    function Sch_digits(n) {
        if (typeof n === 'number') {
            var regex = new RegExp("^[0-9]{" + n + "}$");
            return Joi.string().regex(regex, n + " digits").required();
        }
        return Joi.string().regex(/^[0-9]+$/, "only digits").required();
    }
    /**
    * when condition schema
    */
    function Sch_when(ref, opt) {
        return Joi.alternatives().when(ref, { is: opt.is, then: opt.otherwise, otherwise: Joi.any().forbidden() });
    }
    /**
    * Default request config for each _Common Action_.
    * Index corresponds to the order of enumeration.
    */
    APIRequest.CommonConfigs = _CommonConfigs();
    function _CommonConfigs() {
        return [
            {
                path: '/PB2CAPIVAN/invapp/InvApp',
                method: Method.POST,
                needToSign: false,
                stableParam: {
                    action: 'QryWinningList',
                    version: 0.2,
                    UUID: '',
                    appID: ''
                },
                schema: Joi.object().keys({
                    UUID: Joi.string().required(),
                    action: Joi.string().required(),
                    appID: Joi.string().required(),
                    invTerm: Sch_invTerm,
                    version: Joi.number().required()
                })
            },
            {
                path: '/PB2CAPIVAN/invapp/InvApp',
                method: Method.POST,
                needToSign: false,
                stableParam: {
                    action: 'qryInvHeader',
                    version: 0.3,
                    generation: 'V2',
                    UUID: '',
                    appID: ''
                },
                schema: Joi.object().keys({
                    UUID: Joi.string().required(),
                    action: Joi.string().required(),
                    appID: Joi.string().required(),
                    generation: Joi.string().required(),
                    invDate: Sch_invDate,
                    invNum: Sch_invNum,
                    type: Sch_barcode,
                    version: Joi.number().required()
                })
            },
            {
                path: '/PB2CAPIVAN/invapp/InvApp',
                method: Method.POST,
                needToSign: false,
                stableParam: {
                    action: 'qryInvDetail',
                    version: 0.3,
                    generation: 'V2',
                    UUID: '',
                    appID: ''
                },
                schema: Joi.object().keys({
                    UUID: Joi.string().required(),
                    action: Joi.string().required(),
                    appID: Joi.string().required(),
                    encrypt: Sch_when('type', { is: 'QRCode', then: Joi.string().required() }),
                    generation: Joi.string().required(),
                    invDate: Sch_invDate,
                    invNum: Sch_invNum,
                    invTerm: Sch_when('type', { is: 'Barcode', then: Sch_invTerm }),
                    randomNumber: Sch_digits(4),
                    sellerID: Sch_when('type', { is: 'QRCode', then: Sch_digits(8) }),
                    type: Sch_barcode,
                    version: Joi.number().required()
                })
            },
            {
                path: '/PB2CAPIVAN/loveCodeapp/qryLoveCode',
                method: Method.POST,
                needToSign: false,
                stableParam: {
                    action: 'qryLoveCode',
                    version: 0.2,
                    UUID: '',
                    appID: ''
                },
                schema: Joi.object().keys({
                    UUID: Joi.string().required(),
                    action: Joi.string().required(),
                    appID: Joi.string().required(),
                    qKey: Sch_digits(),
                    version: Joi.number().required()
                })
            },
            {
                path: '/PB2CAPIVAN/invServ/InvServ',
                method: Method.POST,
                needToSign: false,
                stableParam: {
                    action: 'carrierInvChk',
                    version: 0.3,
                    uuid: '',
                    appID: ''
                },
                schema: Joi.object().keys({
                    action: Joi.string().required(),
                    appID: Joi.string().required(),
                    cardEncrypt: Joi.string().required(),
                    cardNo: Joi.string().required(),
                    cardType: Sch_cardType,
                    endDate: Sch_invDate,
                    expTimeStamp: Joi.date().timestamp('unix').required(),
                    onlyWinningInv: Sch_YN,
                    startDate: Sch_invDate,
                    timeStamp: Joi.date().timestamp('unix').required(),
                    uuid: Joi.string().required(),
                    version: Joi.number().required()
                })
            },
            {
                path: '/PB2CAPIVAN/invServ/InvServ',
                method: Method.POST,
                needToSign: false,
                stableParam: {
                    action: 'carrierInvDetail',
                    version: 0.3,
                    uuid: '',
                    appID: ''
                },
                schema: Joi.object().keys({
                    action: Joi.string().required(),
                    amount: Sch_digits(),
                    appID: Joi.string().required(),
                    cardEncrypt: Joi.string().required(),
                    cardNo: Joi.string().required(),
                    cardType: Sch_cardType,
                    expTimeStamp: Joi.date().timestamp('unix').required(),
                    invDate: Sch_invDate,
                    invNum: Sch_invNum,
                    sellerName: Joi.string().optional(),
                    timeStamp: Joi.date().timestamp('unix').required(),
                    uuid: Joi.string().required(),
                    version: Joi.number().required()
                })
            },
            {
                path: '/PB2CAPIVAN/CarInv/Donate',
                method: Method.POST,
                needToSign: true,
                stableParam: {
                    action: 'carrierInvDnt',
                    version: 0.1,
                    uuid: '',
                    appID: ''
                },
                schema: Joi.object().keys({
                    action: Joi.string().required(),
                    appID: Joi.string().required(),
                    cardEncrypt: Joi.string().required(),
                    cardNo: Joi.string().required(),
                    cardType: Sch_cardType,
                    expTimeStamp: Joi.date().timestamp('unix').required(),
                    invDate: Sch_invDate,
                    invNum: Sch_invNum,
                    npoBan: Sch_digits(),
                    serial: Sch_digits(10),
                    timeStamp: Joi.date().timestamp('unix').required(),
                    uuid: Joi.string().required(),
                    version: Joi.number().required()
                })
            },
            {
                path: '/PB2CAPIVAN/Carrier/Aggregate',
                method: Method.POST,
                needToSign: true,
                stableParam: {
                    action: 'qryCarrierAgg',
                    version: 1.0,
                    uuid: '',
                    appID: ''
                },
                schema: Joi.object().keys({
                    action: Joi.string().required(),
                    appID: Joi.string().required(),
                    cardEncrypt: Joi.string().required(),
                    cardNo: Joi.string().required(),
                    cardType: Sch_cardType,
                    serial: Sch_digits(10),
                    timeStamp: Joi.date().timestamp('unix').required(),
                    uuid: Joi.string().required(),
                    version: Joi.number().required()
                })
            },
            {
                path: '/PB2CAPIVAN/appCarreg/AppCarReg',
                method: Method.POST,
                needToSign: true,
                stableParam: {
                    action: 'generalCarrierReg',
                    version: 1.0,
                    uuid: '',
                    appID: ''
                },
                schema: Joi.object().keys({
                    action: Joi.string().required(),
                    appID: Joi.string().required(),
                    email: Joi.string().email().required(),
                    isVerification: Sch_YN,
                    phoneNo: Sch_digits(10),
                    serial: Sch_digits(10),
                    timeStamp: Joi.date().timestamp('unix').required(),
                    uuid: Joi.string().required(),
                    version: Joi.number().required()
                })
            },
            {
                path: '/PB2CAPIVAN/PublicCarrier/AppBankInfo',
                method: Method.POST,
                needToSign: true,
                stableParam: {
                    action: 'generalCarrierBank',
                    version: 1.0,
                    uuid: '',
                    appID: ''
                },
                schema: Joi.object().keys({
                    accountNo: Sch_when('updateAcc', { is: 'Y', then: Sch_digits() }),
                    action: Joi.string().required(),
                    appID: Joi.string().required(),
                    bankNo: Sch_when('updateAcc', { is: 'Y', then: Sch_digits() }),
                    cardEncrypt: Joi.string().required(),
                    cardNo: Joi.string().required(),
                    cardType: Sch_cardType,
                    enableRemit: Sch_YN,
                    expTimeStamp: Joi.date().timestamp('unix').required(),
                    rocID: Sch_when('updateAcc', { is: 'Y', then: Joi.string().regex(/^[A-Z]{1}[0-9]{9}$/, 'ROC ID').required() }),
                    serial: Sch_digits(10),
                    timeStamp: Joi.date().timestamp('unix').required(),
                    updateAcc: Sch_YN,
                    userIdType: Joi.string().valid(['1', '2']).required(),
                    uuid: Joi.string().required(),
                    version: Joi.number().required(),
                    winnerName: Sch_when('updateAcc', { is: 'Y', then: Joi.string().required() }),
                    winnerPhone: Sch_when('updateAcc', { is: 'Y', then: Sch_digits(10) }),
                })
            },
            {
                path: '/PB2CAPIVAN/Carrier/AppGetBarcode',
                method: Method.POST,
                needToSign: false,
                stableParam: {
                    action: 'getBarcode',
                    version: 1.0,
                    uuid: '',
                    appID: ''
                },
                schema: Joi.object().keys({
                    action: Joi.string().required(),
                    appID: Joi.string().required(),
                    phoneNo: Sch_digits(10),
                    timeStamp: Joi.date().timestamp('unix').required(),
                    uuid: Joi.string().required(),
                    verificationCode: Joi.string().required(),
                    version: Joi.number().required()
                })
            },
            {
                path: '/PB2CAPIVAN/MobBarCar/PubCarVerReg',
                method: Method.POST,
                needToSign: true,
                stableParam: {
                    action: 'pubCarVerReg',
                    version: 1.0,
                    uuid: '',
                    appID: ''
                },
                schema: Joi.object().keys({
                    action: Joi.string().required(),
                    appID: Joi.string().required(),
                    email: Joi.string().email().required(),
                    isVerification: Sch_YN,
                    phoneNo: Sch_digits(10),
                    serial: Sch_digits(10),
                    timeStamp: Joi.date().timestamp('unix').required(),
                    uuid: Joi.string().required(),
                    verify: Sch_verify,
                    version: Joi.number().required()
                })
            },
            {
                path: '/PB2CAPIVAN/MobBarCar/ChangeVer',
                method: Method.POST,
                needToSign: true,
                stableParam: {
                    action: 'changeVer',
                    version: 1.0,
                    uuid: '',
                    appID: ''
                },
                schema: Joi.object().keys({
                    action: Joi.string().required(),
                    appID: Joi.string().required(),
                    cardNo: Joi.string().required(),
                    newVerify: Sch_verify,
                    oldVerify: Joi.string().required(),
                    serial: Sch_digits(10),
                    timeStamp: Joi.date().timestamp('unix').required(),
                    uuid: Joi.string().required(),
                    version: Joi.number().required()
                })
            },
            {
                path: '/PB2CAPIVAN/MobBarCar/ForgetVer',
                method: Method.POST,
                needToSign: true,
                stableParam: {
                    action: 'forgetVer',
                    version: 1.0,
                    uuid: '',
                    appID: ''
                },
                schema: Joi.object().keys({
                    action: Joi.string().required(),
                    appID: Joi.string().required(),
                    email: Joi.string().email().required(),
                    phoneNo: Sch_digits(10),
                    serial: Sch_digits(10),
                    timeStamp: Joi.date().timestamp('unix').required(),
                    uuid: Joi.string().required(),
                    version: Joi.number().required()
                })
            },
            {
                path: '/PB2CAPIVAN/MobBarCar/CarrierAction',
                method: Method.POST,
                needToSign: true,
                stableParam: {
                    action: 'carrierAction',
                    version: 1.0,
                    uuid: '',
                    appID: ''
                },
                schema: Joi.object().keys({
                    action: Joi.string().required(),
                    appID: Joi.string().required(),
                    email: Joi.string().email().required(),
                    cardNo: Joi.string().required(),
                    cardType: Sch_cardType,
                    carrierName: Joi.string().optional(),
                    publicCardNo: Joi.string().required(),
                    publicCardType: Joi.string().valid(CarrierCardType.Mobile).required(),
                    publicVerifyCode: Joi.string().required(),
                    serial: Sch_digits(10),
                    timeStamp: Joi.date().timestamp('unix').required(),
                    uuid: Joi.string().required(),
                    verifyCode: Joi.string().required(),
                    version: Joi.number().required()
                })
            }
        ];
    }
    /**
    * Default request config for each _Business Action_.
    * Index corresponds to the order of enumeration.
    */
    APIRequest.BusinessConfigs = _BusinessConfigs();
    function _BusinessConfigs() {
        return [
            {
                endPoint: 'http://www-vc.einvoice.nat.gov.tw',
                path: '/BIZAPIVAN/biz',
                method: Method.POST,
                needToSign: false,
                stableParam: {
                    action: 'bcv',
                    version: 1.0,
                    TxID: '',
                    appId: ''
                },
                schema: Joi.object().keys({
                    TxID: Joi.string().required(),
                    action: Joi.string().required(),
                    appID: Joi.string().required(),
                    barCode: Joi.string().required(),
                    version: Joi.number().required()
                })
            },
            {
                endPoint: 'http://www-vc.einvoice.nat.gov.tw',
                path: '/BIZAPIVAN/biz',
                method: Method.POST,
                needToSign: false,
                stableParam: {
                    action: 'preserveCodeCheck',
                    version: 1.0,
                    TxID: '',
                    appId: ''
                },
                schema: Joi.object().keys({
                    TxID: Joi.string().required(),
                    action: Joi.string().required(),
                    appID: Joi.string().required(),
                    pCode: Joi.string().required(),
                    version: Joi.number().required()
                })
            },
            {
                endPoint: 'https://einvoice.nat.gov.tw',
                path: '/BIZAPIVAN/biz',
                method: Method.POST,
                needToSign: false,
                stableParam: {
                    action: 'cardBin',
                    version: 1.0,
                    TxID: '',
                    appId: ''
                },
                schema: Joi.object().keys({
                    TxID: Joi.string().required(),
                    action: Joi.string().required(),
                    appID: Joi.string().required(),
                    bankNo: Sch_digits(),
                    version: Joi.number().required()
                })
            },
            {
                endPoint: 'https://einvoice.nat.gov.tw',
                path: '/BIZAPIVAN/biz',
                method: Method.POST,
                needToSign: false,
                stableParam: {
                    action: 'creditCardBan',
                    version: 1.0,
                    TxID: '',
                    appId: ''
                },
                schema: Joi.object().keys({
                    TxID: Joi.string().required(),
                    action: Joi.string().required(),
                    appID: Joi.string().required(),
                    version: Joi.number().required()
                })
            },
            {
                endPoint: 'http://www-vc.einvoice.nat.gov.tw',
                path: '/BIZAPIVAN/biz',
                method: Method.POST,
                needToSign: true,
                stableParam: {
                    action: 'qryRecvRout',
                    version: 1.0,
                    TxID: '',
                    appId: ''
                },
                schema: Joi.object().keys({
                    TxID: Joi.string().required(),
                    action: Joi.string().required(),
                    appID: Joi.string().required(),
                    ban: Sch_digits(8),
                    serial: Sch_digits(10),
                    timeStamp: Joi.date().timestamp('unix').required(),
                    version: Joi.number().required()
                })
            },
            {
                endPoint: 'http://www-vc.einvoice.nat.gov.tw',
                path: '/BIZAPIVAN/biz',
                method: Method.POST,
                needToSign: true,
                stableParam: {
                    action: 'qryBanUnitTp',
                    version: 1.0,
                    appId: ''
                },
                schema: Joi.object().keys({
                    action: Joi.string().required(),
                    appID: Joi.string().required(),
                    ban: Sch_digits(8),
                    serial: Sch_digits(10),
                    timeStamp: Joi.date().timestamp('unix').required(),
                    version: Joi.number().required()
                })
            }
        ];
    }
})(APIRequest = exports.APIRequest || (exports.APIRequest = {}));
/**
* A module contains all utilities the API need.
*/
var APIUtil;
(function (APIUtil) {
    /**
    * Internal serial number generator Map. When `Serial` implement,the instance will register it's generator to here.
    */
    var SerialWMap = new WeakMap();
    /**
    * Serial number generator factory.The `Serial` instance get it's generator from here.
    */
    function serialGenFactory() {
        return gen();
        function gen() {
            var n;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        n = 0;
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 3];
                        n++;
                        return [4 /*yield*/, n.toString().padStart(10, '0')];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        }
    }
    /**
    * Serial number generator class.You can get new serial number or reset it.
    */
    var Serial = /** @class */ (function () {
        /**
        * constructor
        * The instance will register a serial number generator.
        */
        function Serial() {
            SerialWMap.set(this, serialGenFactory());
        }
        /**
        * Return a new serial number.
        */
        Serial.prototype.next = function () {
            var serialGen = SerialWMap.get(this);
            if (serialGen) {
                return serialGen.next().value;
            }
            return;
        };
        /**
        * Register a new generator.
        */
        Serial.prototype.anew = function () {
            SerialWMap.set(this, serialGenFactory());
            return this;
        };
        return Serial;
    }());
    APIUtil.Serial = Serial;
})(APIUtil = exports.APIUtil || (exports.APIUtil = {}));
