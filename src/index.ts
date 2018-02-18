import * as querystring from 'querystring';
import * as crypto from 'crypto';
import * as Joi from 'joi';
const endPoint: string = 'https://api.einvoice.nat.gov.tw';

/**
 * `TaiwanEInvoice` is a class that wraps Taiwan e-invoice API.
 */
export class TaiwanEInvoice {
  /**
  * App ID,apply from [MOF E-Invoice platform](https://www.einvoice.nat.gov.tw/APMEMBERVAN/APIService/Registration).
  */
  appID:string;
  /**
  * API Key,apply from [MOF E-Invoice platform](https://www.einvoice.nat.gov.tw/APMEMBERVAN/APIService/Registration).
  */
  apiKey:string;
  /**
  *UUID,universally unique identifier of inquirer
  */
  uuID:string = '';
  /**
  *txID,Transaction ID of inquirer
  */
  txID:string = '';
  /**
  * inquirer's identity.
  */
  identity:InquirerIdentity = InquirerIdentity.Common;
  /**
  * Constructor
  * @param appID App ID,apply from [MOF E-Invoice platform](https://www.einvoice.nat.gov.tw/APMEMBERVAN/APIService/Registration).
  * @param apiKey API Key,apply from [MOF E-Invoice platform](https://www.einvoice.nat.gov.tw/APMEMBERVAN/APIService/Registration).
  */
  constructor(appID:string,apiKey:string){
    //super();
    this.appID = appID;
    this.apiKey = apiKey;
  }
  /**
  * Tell API the UUID or the txID of the inquirer.
  * @param id UUID or txID .
  * @param identity inquirer's identity. Default is `InquirerIdentity.Common` . (Optional)
  */
  inquirer(id:string,identity?:InquirerIdentity):TaiwanEInvoice{
    switch(identity){
      case InquirerIdentity.Common :
        this.identity = identity;
        this.uuID = id;
        break;
      case InquirerIdentity.BusinessEntity :
        this.identity = identity;
        this.txID = id;
        break;
      default :
        this.uuID = id;
        if(identity !== undefined)
          throw new Error(`Invalid inquirer identity.`);
    }
    return this;
  }
  /**
  *
  * @param action request parameter `action` literal specified in the API
  * @param param other request parameters specified in the API
  */
  action(action:string,param:{[x:string]:string | number}){
    if(typeof param !== 'object')
      throw new Error('param must be specified an plain object.');

    let actions:any = undefined;
    let configs:APIRequest.ConfigStruct[]|undefined = undefined;
    switch(this.identity){
      case InquirerIdentity.Common :
        actions = RequestCommonAction;//real object at runtime
        configs = APIRequest.CommonConfigs;
        break;
      case InquirerIdentity.BusinessEntity:
        actions = RequestBusinessuAction;//real object at runtime
        configs = APIRequest.BusinessConfigs;
        break;
      default :
        throw new Error(`Invalid inquirer identity.`);
    }

    let actionIndex = actions[action];
    if(actionIndex === undefined)
      throw new Error(`Invalid request action '${action}'`);

    let config:APIRequest.ConfigStruct = configs[actionIndex];
    config.endPoint = config.endPoint || endPoint;
    let paramters = { ...param, ...config.stableParam};

    if(paramters.hasOwnProperty('appID')) paramters.appID = this.appID;
    if(paramters.hasOwnProperty('appId')) paramters.appId = this.appID;
    if(paramters.hasOwnProperty('UUID')) paramters.UUID = this.uuID;
    if(paramters.hasOwnProperty('uuid')) paramters.uuid = this.uuID;
    if(paramters.hasOwnProperty('TxID')) paramters.TxID = this.txID;

    let url = `${config.endPoint}${config.path}?${querystring.stringify(paramters)}`
    console.log(config.method,url);
  }
}
/**
* Enumerate inquirer's identity.
*/
export enum InquirerIdentity {
  /**
  * General user identity.
  */
  Common,
  /**
  * Business user identity.
  */
  BusinessEntity
}
/**
* Enumerate card type specified in the API.
*/
export enum CarrierCardType {
  /**
  * Mobile barcode
  */
  Mobile = '3J0002',
  /**
  * EasyCard
  */
  EasyCard = '1K0001',
  /**
  * iPASS
  */
  IPASS = '1H0001',
  /**
  * MOICA Citizen Digital Certificate
  */
  MOICACDC = 'CQ0001',
  /**
  * icash
  */
  ICASH = '2G0001'
}
/**
* Enumerate request parameter `action` literals specified in the API for common user.
*/
enum RequestCommonAction {
  /**
  * Query prize numbers.
  */
  QryWinningList,
  /**
  * Query invoice seller information.
  */
  qryInvHeader,
  /**
  * Query invoice details.
  */
  qryInvDetail,
  /**
  * Query registered Social welfare groups.
  */
  qryLoveCode,
  /**
  * Query seller information about invoices held in the carrier.
  */
  carrierInvChk,
  /**
  * Query details about invoices held in the carrier.
  */
  carrierInvDetail,
  /**
  * Donate the invoice to the social welfare group.
  */
  carrierInvDnt,
  /**
  * Query valid aggregate carriers.
  */
  qryCarrierAgg,
  /**
  * Mobile barcode registration without enter password.
  */
  generalCarrierReg,
  /**
  * Binding financial account or electronic payment account.
  */
  generalCarrierBank,
  /**
  * Query mobile barcode.
  */
  etBarcode,
  /**
  * Mobile barcode registration need enter password.
  */
  pubCarVerReg,
  /**
  * Change password.
  */
  changeVer,
  /**
  * Forget password.
  */
  forgetVer,
  /**
  * Carrier aggregate to mobile barcode.
  */
  carrierAction
}
/**
* Enumerate request parameter `action` literals specified in the API for common user.
*/
enum RequestBusinessuAction{
  /**
  * Verify whether the mobile barcode exists on the e-invoice platform.
  */
  bcv,
  /**
  * Verify whether the LoveCode exists on the e-invoice platform.
  */
  preserveCodeCheck,
  /**
  * Query BIN of the credit card carrier.
  */
  cardBin,
  /**
  * Query bankNo of the credit card carrier.
  */
  creditCardBan,
  /**
  * Query receive route status.
  */
  qryRecvRout,
  /**
  * Query whether is business entity.
  */
  qryBanUnitTp
}
/**
* Inner module.Define default request config with the API spec .
*/
namespace APIRequest {
  /**
  * Enumerate HTTP request methods.
  */
  export enum Method {
    GET = 'GET',
    POST = 'POST'
  }
  /**
  * Define default request config structure.
  */
  export interface ConfigStruct {
    /**
    * API HTTP Endpoint. It must be specified in `BusinessConfigs` . (Optional)
    */
    endPoint?:string;
    /**
    * HTTP request path of the API.
    */
    path:string;
    /**
    * HTTP request method.
    */
    method:Method;
    /**
    * Need signature or not.
    */
    needToSign:boolean
    /**
    * Stable request parameter of the API.
    */
    stableParam:{[x:string]:string | number};
    /**
    *Schema of request parameters
    */
    schema:Joi.ObjectSchema
  }
  /**
  * invTerm schema
  */
  const sch_invTerm = Joi.string().regex(/^[0-9]{5}$/, 'yyyMM').required();
  /**
  * invDate schema
  */
  const sch_invDate = Joi.string().regex(/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/,'yyyy/MM/dd').required();
  /**
  * invNum schema
  */
  const sch_invNum = Joi.string().regex(/^[A-Z]{2}[0-9]{8}$/, '[A-Z]{2}[0-9]{8}').required();
  /**
  * bar code type schema
  */
  const sch_barcode = Joi.string().valid('QRCode', 'Barcode').required();
  /**
  * cardType schema
  */
  const sch_cardType = Joi.string().valid(
    CarrierCardType.EasyCard,
    CarrierCardType.ICASH,
    CarrierCardType.IPASS,
    CarrierCardType.MOICACDC,
    CarrierCardType.Mobile).required();
  /**
  * Y/N schema
  */
  const sch_YN = Joi.string().valid('Y','N').required();
  /**
  * verify code (password) schema
  */
  const sch_verify = Joi.string().regex(/^(?=.*\d)(?=.*[a-zA-Z])([^'"+=?\\\/\s]){8,16}$/,'password').required();
  /**
  * digit string schema
  */
  function sch_digits (n?:number):Joi.StringSchema{
    if(typeof n === 'number'){
      let regex = new RegExp(`^[0-9]{${n}}$`);
      return Joi.string().regex(regex, `${n} digits`).required();
    }

    return Joi.string().regex(/^[0-9]+$/, `only digits`).required();
  }
  /**
  * when condition schema
  */
  function sch_when(ref:string,opt:Joi.WhenOptions):Joi.AlternativesSchema{
    return sch_when(ref,{is:opt.is, then:opt.otherwise, otherwise:Joi.forbidden()})
  }
  /**s
  * Default request config for each _Common Action_.
  * Index corresponds to the order of enumeration.
  */
  export const CommonConfigs:ConfigStruct[] = [
    {
      path:'/PB2CAPIVAN/invapp/InvApp',
      method:Method.POST,
      needToSign:false,
      stableParam:{
        action:'QryWinningList',
        version:0.2,
        UUID:'',
        appID:''
      },
      schema : Joi.object().keys({
        UUID:Joi.string().required(),
        action:Joi.string().required(),
        appID:Joi.string().required(),
        invTerm:sch_invTerm,
        version:Joi.number().required()
      })
    },
    {
      path:'/PB2CAPIVAN/invapp/InvApp',
      method:Method.POST,
      needToSign:false,
      stableParam:{
        action:'qryInvHeader',
        version:0.3,
        generation:'V2',
        UUID:'',
        appID:''
      },
      schema : Joi.object().keys({
        UUID:Joi.string().required(),
        action:Joi.string().required(),
        appID:Joi.string().required(),
        generation:Joi.string().required(),
        invDate:sch_invDate,
        invNum:sch_invNum,
        type:sch_barcode,
        version:Joi.number().required()
      })
    },
    {
      path:'/PB2CAPIVAN/invapp/InvApp',
      method:Method.POST,
      needToSign:false,
      stableParam:{
        action:'qryInvDetail',
        version:0.3,
        generation:'V2',
        UUID:'',
        appID:''
      },
      schema : Joi.object().keys({
        UUID:Joi.string().required(),
        action:Joi.string().required(),
        appID:Joi.string().required(),
        encrypt:sch_when('type',{is:'QRCode', then:Joi.string().required()}),
        generation:Joi.string().required(),
        invDate:sch_invDate,
        invNum:sch_invNum,
        invTerm:sch_when('type',{is:'Barcode', then:sch_invTerm}),
        randomNumber:sch_digits(4),
        sellerID:sch_when('type',{is:'QRCode', then:sch_digits(8)}),
        type:sch_barcode,
        version:Joi.number().required()
      })
    },
    {
      path:'/PB2CAPIVAN/loveCodeapp/qryLoveCode',
      method:Method.POST,
      needToSign:false,
      stableParam:{
        action:'qryLoveCode',
        version:0.2,
        UUID:'',
        appID:''
      },
      schema : Joi.object().keys({
        UUID:Joi.string().required(),
        action:Joi.string().required(),
        appID:Joi.string().required(),
        qKey:sch_digits(),
        version:Joi.number().required()
      })
    },
    {
      path:'/PB2CAPIVAN/invServ/InvServ',
      method:Method.POST,
      needToSign:false,
      stableParam:{
        action:'carrierInvChk',
        version:0.3,
        uuid:'',
        appID:''
      },
      schema : Joi.object().keys({
        action:Joi.string().required(),
        appID:Joi.string().required(),
        cardEncrypt:Joi.string().required(),
        cardNo:Joi.string().required(),
        cardType:sch_cardType,
        endDate:sch_invDate,
        expTimeStamp:Joi.date().timestamp('unix').required(),
        onlyWinningInv:sch_YN,
        startDate:sch_invDate,
        timeStamp:Joi.date().timestamp('unix').required(),
        uuid:Joi.string().required(),
        version:Joi.number().required()
      })
    },
    {
      path:'/PB2CAPIVAN/invServ/InvServ',
      method:Method.POST,
      needToSign:false,
      stableParam:{
        action:'carrierInvDetail',
        version:0.3,
        uuid:'',
        appID:''
      },
      schema : Joi.object().keys({
        action:Joi.string().required(),
        amount:sch_digits(),
        appID:Joi.string().required(),
        cardEncrypt:Joi.string().required(),
        cardNo:Joi.string().required(),
        cardType:sch_cardType,
        expTimeStamp:Joi.date().timestamp('unix').required(),
        invDate:sch_invDate,
        invNum:sch_invNum,
        sellerName:Joi.string().optional(),
        timeStamp:Joi.date().timestamp('unix').required(),
        uuid:Joi.string().required(),
        version:Joi.number().required()
      })
    },
    {
      path:'/PB2CAPIVAN/CarInv/Donate',
      method:Method.POST,
      needToSign:true,
      stableParam:{
        action:'carrierInvDnt',
        version:0.1,
        uuid:'',
        appID:''
      },
      schema : Joi.object().keys({
        action:Joi.string().required(),
        appID:Joi.string().required(),
        cardEncrypt:Joi.string().required(),
        cardNo:Joi.string().required(),
        cardType:sch_cardType,
        expTimeStamp:Joi.date().timestamp('unix').required(),
        invDate:sch_invDate,
        invNum:sch_invNum,
        npoBan:sch_digits(),
        serial:sch_digits(10),
        timeStamp:Joi.date().timestamp('unix').required(),
        uuid:Joi.string().required(),
        version:Joi.number().required()
      })
    },
    {
      path:'/PB2CAPIVAN/Carrier/Aggregate',
      method:Method.POST,
      needToSign:true,
      stableParam:{
        action:'qryCarrierAgg',
        version:1.0,
        uuid:'',
        appID:''
      },
      schema : Joi.object().keys({
        action:Joi.string().required(),
        appID:Joi.string().required(),
        cardEncrypt:Joi.string().required(),
        cardNo:Joi.string().required(),
        cardType:sch_cardType,
        serial:sch_digits(10),
        timeStamp:Joi.date().timestamp('unix').required(),
        uuid:Joi.string().required(),
        version:Joi.number().required()
      })
    },
    {//.
      path:'/PB2CAPIVAN/appCarreg/AppCarReg',
      method:Method.POST,
      needToSign:true,
      stableParam:{
        action:'generalCarrierReg',
        version:1.0,
        uuid:'',
        appID:''
      },
      schema : Joi.object().keys({
        action:Joi.string().required(),
        appID:Joi.string().required(),
        email:Joi.string().email().required(),
        isVerification:sch_YN,
        phoneNo:sch_digits(10),
        serial:sch_digits(10),
        timeStamp:Joi.date().timestamp('unix').required(),
        uuid:Joi.string().required(),
        version:Joi.number().required()
      })
    },
    {
      path:'/PB2CAPIVAN/PublicCarrier/AppBankInfo',
      method:Method.POST,
      needToSign:true,
      stableParam:{
        action:'generalCarrierBank',
        version:1.0,
        uuid:'',
        appID:''
      },
      schema : Joi.object().keys({
        accountNo:sch_when('updateAcc',{is:'Y',then:sch_digits()}),
        action:Joi.string().required(),
        appID:Joi.string().required(),
        bankNo:sch_when('updateAcc',{is:'Y',then:sch_digits()}),
        cardEncrypt:Joi.string().required(),
        cardNo:Joi.string().required(),
        cardType:sch_cardType,
        enableRemit:sch_YN,
        expTimeStamp:Joi.date().timestamp('unix').required(),
        rocID:sch_when('updateAcc',{is:'Y',then:Joi.string().regex(/^[A-Z]{1}[0-9]{9}$/, 'ROC ID').required()}),
        serial:sch_digits(10),
        timeStamp:Joi.date().timestamp('unix').required(),
        updateAcc:sch_YN,
        userIdType:Joi.string().valid(['1','2']).required(),
        uuid:Joi.string().required(),
        version:Joi.number().required(),
        winnerName:sch_when('updateAcc',{is:'Y',then:Joi.string().required()}),
        winnerPhone:sch_when('updateAcc',{is:'Y',then:sch_digits(10)}),
      })
    },
    {
      path:'/PB2CAPIVAN/Carrier/AppGetBarcode',
      method:Method.POST,
      needToSign:false,
      stableParam:{
        action:'getBarcode',
        version:1.0,
        uuid:'',
        appID:''
      },
      schema : Joi.object().keys({
        action:Joi.string().required(),
        appID:Joi.string().required(),
        phoneNo:sch_digits(10),
        timeStamp:Joi.date().timestamp('unix').required(),
        uuid:Joi.string().required(),
        verificationCode:Joi.string().required(),
        version:Joi.number().required()
      })
    },
    {
      path:'/PB2CAPIVAN/MobBarCar/PubCarVerReg',
      method:Method.POST,
      needToSign:true,
      stableParam:{
        action:'pubCarVerReg',
        version:1.0,
        uuid:'',
        appID:''
      },
      schema : Joi.object().keys({
        action:Joi.string().required(),
        appID:Joi.string().required(),
        email:Joi.string().email().required(),
        isVerification:sch_YN,
        phoneNo:sch_digits(10),
        serial:sch_digits(10),
        timeStamp:Joi.date().timestamp('unix').required(),
        uuid:Joi.string().required(),
        verify:sch_verify,
        version:Joi.number().required()
      })
    },
    {
      path:'/PB2CAPIVAN/MobBarCar/ChangeVer',
      method:Method.POST,
      needToSign:true,
      stableParam:{
        action:'changeVer',
        version:1.0,
        uuid:'',
        appID:''
      },
      schema : Joi.object().keys({
        action:Joi.string().required(),
        appID:Joi.string().required(),
        cardNo:Joi.string().required(),
        newVerify:sch_verify,
        oldVerify:Joi.string().required(),
        serial:sch_digits(10),
        timeStamp:Joi.date().timestamp('unix').required(),
        uuid:Joi.string().required(),
        version:Joi.number().required()
      })
    },
    {
      path:'/PB2CAPIVAN/MobBarCar/ForgetVer',
      method:Method.POST,
      needToSign:true,
      stableParam:{
        action:'forgetVer',
        version:1.0,
        uuid:'',
        appID:''
      },
      schema : Joi.object().keys({
        action:Joi.string().required(),
        appID:Joi.string().required(),
        email:Joi.string().email().required(),
        phoneNo:sch_digits(10),
        serial:sch_digits(10),
        timeStamp:Joi.date().timestamp('unix').required(),
        uuid:Joi.string().required(),
        version:Joi.number().required()
      })
    },
    {
      path:'/PB2CAPIVAN/MobBarCar/CarrierAction',
      method:Method.POST,
      needToSign:true,
      stableParam:{
        action:'carrierAction',
        version:1.0,
        uuid:'',
        appID:''
      },
      schema : Joi.object().keys({
        action:Joi.string().required(),
        appID:Joi.string().required(),
        email:Joi.string().email().required(),
        cardNo:Joi.string().required(),
        cardType:sch_cardType,
        carrierName:Joi.string().optional(),
        publicCardNo:Joi.string().required(),
        publicCardType:Joi.valid(CarrierCardType.Mobile).required(),
        publicVerifyCode:Joi.string().required(),
        serial:sch_digits(10),
        timeStamp:Joi.date().timestamp('unix').required(),
        uuid:Joi.string().required(),
        verifyCode:Joi.string().required(),
        version:Joi.number().required()
      })
    }
  ];
  /**
  * Default request config for each _Business Action_.
  * Index corresponds to the order of enumeration.
  */
  export const BusinessConfigs:ConfigStruct[] = [
    {
      endPoint:'http://www-vc.einvoice.nat.gov.tw',
      path:'/BIZAPIVAN/biz',
      method:Method.POST,
      needToSign:false,
      stableParam:{
        action:'bcv',
        version:1.0,
        TxID:'',
        appId:''
      },
      schema : Joi.object().keys({
        TxID:Joi.string().required(),
        action:Joi.string().required(),
        appID:Joi.string().required(),
        barCode:Joi.string().required(),
        version:Joi.number().required()
      })
    },
    {
      endPoint:'http://www-vc.einvoice.nat.gov.tw',
      path:'/BIZAPIVAN/biz',
      method:Method.POST,
      needToSign:false,
      stableParam:{
        action:'preserveCodeCheck',
        version:1.0,
        TxID:'',
        appId:''
      },
      schema : Joi.object().keys({
        TxID:Joi.string().required(),
        action:Joi.string().required(),
        appID:Joi.string().required(),
        pCode:Joi.string().required(),
        version:Joi.number().required()
      })
    },
    {
      endPoint:'https://einvoice.nat.gov.tw',
      path:'/BIZAPIVAN/biz',
      method:Method.POST,
      needToSign:false,
      stableParam:{
        action:'cardBin',
        version:1.0,
        TxID:'',
        appId:''
      },
      schema : Joi.object().keys({
        TxID:Joi.string().required(),
        action:Joi.string().required(),
        appID:Joi.string().required(),
        bankNo:sch_digits(),
        version:Joi.number().required()
      })
    },
    {
      endPoint:'https://einvoice.nat.gov.tw',
      path:'/BIZAPIVAN/biz',
      method:Method.POST,
      needToSign:false,
      stableParam:{
        action:'creditCardBan',
        version:1.0,
        TxID:'',
        appId:''
      },
      schema : Joi.object().keys({
        TxID:Joi.string().required(),
        action:Joi.string().required(),
        appID:Joi.string().required(),
        version:Joi.number().required()
      })
    },
    {
      endPoint:'http://www-vc.einvoice.nat.gov.tw',
      path:'/BIZAPIVAN/biz',
      method:Method.POST,
      needToSign:true,
      stableParam:{
        action:'qryRecvRout',
        version:1.0,
        TxID:'',
        appId:''
      },
      schema : Joi.object().keys({
        TxID:Joi.string().required(),
        action:Joi.string().required(),
        appID:Joi.string().required(),
        ban:sch_digits(8),
        serial:sch_digits(10),
        timeStamp:Joi.date().timestamp('unix').required(),
        version:Joi.number().required()
      })
    },
    {
      endPoint:'http://www-vc.einvoice.nat.gov.tw',
      path:'/BIZAPIVAN/biz',
      method:Method.POST,
      needToSign:true,
      stableParam:{
        action:'qryBanUnitTp',
        version:1.0,
        appId:''
      },
      schema : Joi.object().keys({
        action:Joi.string().required(),
        appID:Joi.string().required(),
        ban:sch_digits(8),
        serial:sch_digits(10),
        timeStamp:Joi.date().timestamp('unix').required(),
        version:Joi.number().required()
      })
    }
  ];
}
/**
* A module contains all utilities the API need.
*/
export namespace APIUtil{
  /**
  * Internal serial number generator Map. When `Serial` implement,the instance will register it's generator to here.
  */
  const SerialWMap : WeakMap<Serial , IterableIterator<string>>= new WeakMap();
  /**
  * Serial number generator factory.The `Serial` instance get it's generator from here.
  */
  function serialGenFactory():IterableIterator<string>{
    return gen();

    function* gen() {
        let n = 0;
        while(true){
          n++;
          yield n.toString().padStart(10,'0');
        }
    }
  }
  /**
  * Serial number generator class.You can get new serial number or reset it.
  */
  export class Serial {
    /**
    * constructor
    * The instance will register a serial number generator.
    */
    constructor(){
      SerialWMap.set(this,serialGenFactory());
    }
    /**
    * Return a new serial number.
    */
    next():string | undefined {
      let serialGen = SerialWMap.get(this);
      if(serialGen){
        return serialGen.next().value;
      }
      return;
    }
    /**
    * Register a new generator.
    */
    anew(){
      SerialWMap.set(this,serialGenFactory());
      return this;
    }

  }
}
