const endPoint: string = 'https://api.einvoice.nat.gov.tw/';

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
  uuID:string;
  /**
  *txID,Transaction ID of inquirer
  */
  txID:string;
  /**
  * inquirer's identity.
  */
  identity:InquirerIdentity;
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
  * @param identity inquirer's identity.
  * @param id UUID or txID .
  */
  inquirer(identity:InquirerIdentity,id:string):TaiwanEInvoice{
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
       throw new Error(`Invalid inquirer identity.`);
    }
    return this;
  }
  /**
  *
  * @param action request parameter `action` literal specified in the API
  * @param parameters other request parameters specified in the API
  */
  action(action:string,params:any){
    let actions:any = (()=>{
      switch(this.identity){
        case InquirerIdentity.Common :
          return RequestCommonAction;
        case InquirerIdentity.BusinessEntity:
         return RequestBusinessuAction;
        default :
          return undefined;
      }
    })();

    if(actions  === undefined)
      throw new Error(`Undefined request actions with invalid inquirer identity.`);
    if(actions[action] === undefined)
      throw new Error(`Invalid request action '${action}'`);
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
