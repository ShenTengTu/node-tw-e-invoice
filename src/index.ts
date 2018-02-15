import * as querystring from 'querystring';
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
  action(action:string,param:{}){
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
    paramters.appID = this.appID;
    paramters.UUID = this.uuID;
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
    * Stable request parameter of the API. (Optional)
    */
    stableParam?:any;
  }
  /**
  * Default request config for each _Common Action_.
  * Index corresponds to the order of enumeration.
  */
  export const CommonConfigs:ConfigStruct[] = [
    {
      path:'/PB2CAPIVAN/invapp/InvApp',
      method:Method.POST,
      stableParam:{
        action:'QryWinningList',
        version:0.2
      }
    },
    {
      path:'/PB2CAPIVAN/invapp/InvApp',
      method:Method.POST,
      stableParam:{
        action:'qryInvHeader',
        version:0.3,
        generation:'V2'
      }
    },
    {
      path:'/PB2CAPIVAN/invapp/InvApp',
      method:Method.POST,
      stableParam:{
        action:'qryInvDetail',
        version:0.3,
        generation:'V2'
      }
    },
    {
      path:'/PB2CAPIVAN/loveCodeapp/qryLoveCode',
      method:Method.POST,
      stableParam:{
        action:'qryLoveCode',
        version:0.2
      }
    },
    {
      path:'/PB2CAPIVAN/invServ/InvServ',
      method:Method.POST,
      stableParam:{
        action:'carrierInvChk',
        version:0.3
      }
    },
    {
      path:'/PB2CAPIVAN/invServ/InvServ',
      method:Method.POST,
      stableParam:{
        action:'carrierInvDetail',
        version:0.3
      }
    },
    {
      path:'/PB2CAPIVAN/CarInv/Donate',
      method:Method.POST,
      stableParam:{
        action:'carrierInvDnt',
        version:0.1
      }
    },
    {
      path:'/PB2CAPIVAN/Carrier/Aggregate',
      method:Method.POST,
      stableParam:{
        action:'qryCarrierAgg',
        version:1.0
      }
    },
    {//.
      path:'/PB2CAPIVAN/appCarreg/AppCarReg',
      method:Method.POST,
      stableParam:{
        action:'generalCarrierReg',
        version:1.0
      }
    },
    {
      path:'/PB2CAPIVAN/PublicCarrier/AppBankInfo',
      method:Method.POST,
      stableParam:{
        action:'generalCarrierBank',
        version:1.0
      }
    },
    {
      path:'/PB2CAPIVAN/Carrier/AppGetBarcode',
      method:Method.POST,
      stableParam:{
        action:'getBarcode',
        version:1.0
      }
    },
    {
      path:'/PB2CAPIVAN/MobBarCar/PubCarVerReg',
      method:Method.POST,
      stableParam:{
        action:'pubCarVerReg',
        version:1.0
      }
    },
    {
      path:'/PB2CAPIVAN/MobBarCar/ChangeVer',
      method:Method.POST,
      stableParam:{
        action:'changeVer',
        version:1.0
      }
    },
    {
      path:'/PB2CAPIVAN/MobBarCar/ForgetVer',
      method:Method.POST,
      stableParam:{
        action:'forgetVer',
        version:1.0
      }
    },
    {
      path:'/PB2CAPIVAN/MobBarCar/CarrierAction',
      method:Method.POST,
      stableParam:{
        action:'carrierAction',
        version:1.0
      }
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
      stableParam:{
        action:'bcv',
        version:1.0
      }
    },
    {
      endPoint:'http://www-vc.einvoice.nat.gov.tw',
      path:'/BIZAPIVAN/biz',
      method:Method.POST,
      stableParam:{
        action:'preserveCodeCheck',
        version:1.0
      }
    },
    {
      endPoint:'https://einvoice.nat.gov.tw',
      path:'/BIZAPIVAN/biz',
      method:Method.POST,
      stableParam:{
        action:'cardBin',
        version:1.0
      }
    },
    {
      endPoint:'https://einvoice.nat.gov.tw',
      path:'/BIZAPIVAN/biz',
      method:Method.POST,
      stableParam:{
        action:'creditCardBan',
        version:1.0
      }
    },
    {
      endPoint:'http://www-vc.einvoice.nat.gov.tw',
      path:'/BIZAPIVAN/biz',
      method:Method.POST,
      stableParam:{
        action:'qryRecvRout',
        version:1.0
      }
    },
    {
      endPoint:'http://www-vc.einvoice.nat.gov.tw',
      path:'/BIZAPIVAN/biz',
      method:Method.POST,
      stableParam:{
        action:'qryBanUnitTp',
        version:1.0
      }
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
