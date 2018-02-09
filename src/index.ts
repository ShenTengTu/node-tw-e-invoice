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
  * Constructor
  * @param appID App ID,apply from [MOF E-Invoice platform](https://www.einvoice.nat.gov.tw/APMEMBERVAN/APIService/Registration).
  * @param apiKey API Key,apply from [MOF E-Invoice platform](https://www.einvoice.nat.gov.tw/APMEMBERVAN/APIService/Registration).
  */
  constructor(appID:string,apiKey:string){
    //super();
    this.appID = appID;
    this.apiKey = apiKey;
  }
}
