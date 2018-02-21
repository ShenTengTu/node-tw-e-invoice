import * as Joi from 'joi';
/**
 * `TaiwanEInvoice` is a class that wraps Taiwan e-invoice API.
 */
export declare class TaiwanEInvoice {
    /**
    * Sort request parameters by key in ascending order.
    * Must use before `signature`.
    * @param param unsort request parameters.
    */
    static paramSort(param: APIRequest.DefinedParameter): any;
    /**
    * App ID,apply from [MOF E-Invoice platform](https://www.einvoice.nat.gov.tw/APMEMBERVAN/APIService/Registration).
    */
    appID: string;
    /**
    * API Key,apply from [MOF E-Invoice platform](https://www.einvoice.nat.gov.tw/APMEMBERVAN/APIService/Registration).
    */
    apiKey: string;
    /**
    *UUID,universally unique identifier of inquirer
    */
    uuID: string;
    /**
    *txID,Transaction ID of inquirer
    */
    txID: string;
    /**
    * inquirer's identity.
    */
    identity: InquirerIdentity;
    /**
    * Constructor
    * @param appID App ID,apply from [MOF E-Invoice platform](https://www.einvoice.nat.gov.tw/APMEMBERVAN/APIService/Registration).
    * @param apiKey API Key,apply from [MOF E-Invoice platform](https://www.einvoice.nat.gov.tw/APMEMBERVAN/APIService/Registration).
    */
    constructor(appID: string, apiKey: string);
    /**
    * Tell API the UUID or the txID of the inquirer.
    * @param id UUID or txID .
    * @param identity inquirer's identity. Default is `InquirerIdentity.Common` . (Optional)
    */
    inquirer(id: string, identity?: InquirerIdentity): TaiwanEInvoice;
    /**
    *
    * @param action request parameter `action` literal specified in the API
    * @param param other request parameters specified in the API
    */
    action(action: string, param: APIRequest.DefinedParameter): Promise<{}>;
}
/**
* Enumerate inquirer's identity.
*/
export declare enum InquirerIdentity {
    /**
    * General user identity.
    */
    Common = 0,
    /**
    * Business user identity.
    */
    BusinessEntity = 1,
}
/**
* Enumerate card type specified in the API.
*/
export declare enum CarrierCardType {
    /**
    * Mobile barcode
    */
    Mobile = "3J0002",
    /**
    * EasyCard
    */
    EasyCard = "1K0001",
    /**
    * iPASS
    */
    IPASS = "1H0001",
    /**
    * MOICA Citizen Digital Certificate
    */
    MOICACDC = "CQ0001",
    /**
    * icash
    */
    ICASH = "2G0001",
}
/**
* Inner module.Define default request config with the API spec .
*/
export declare namespace APIRequest {
    /**
    * Enumerate HTTP request methods.
    */
    enum Method {
        GET = "GET",
        POST = "POST",
    }
    /**
    * All request parameters defined in the API.
    */
    interface DefinedParameter {
        [x: string]: any;
        TxID?: string;
        UUID?: string;
        accountNo?: string;
        action?: string;
        amount?: string;
        appID?: string;
        appId?: string;
        ban?: string;
        bankNo?: string;
        barCode?: string;
        cardEncrypt?: string;
        cardNo?: string;
        cardType?: CarrierCardType;
        carrierName?: string;
        email?: string;
        enableRemit?: string;
        encrypt?: string;
        endDate?: string;
        expTimeStamp?: Date | number;
        generation?: string;
        invDate?: string;
        invNum?: string;
        invTerm?: string;
        isVerification?: string;
        newVerify?: string;
        npoBan?: string;
        oldVerify?: string;
        onlyWinningInv?: string;
        pCode?: string;
        phoneNo?: string;
        publicCardNo?: string;
        publicCardType?: CarrierCardType;
        publicVerifyCode?: string;
        qKey?: string;
        randomNumber?: string;
        rocID?: string;
        sellerID?: string;
        sellerName?: string;
        serial?: string;
        signature?: string;
        startDate?: string;
        timeStamp?: Date | number;
        type?: string;
        updateAcc?: string;
        userIdType?: string;
        uuid?: string;
        verificationCode?: string;
        verify?: string;
        verifyCode?: string;
        version: number;
        winnerName?: string;
        winnerPhone?: string;
    }
    /**
    * Define default request config structure.
    */
    interface ConfigStruct {
        /**
        * API HTTP Endpoint. It must be specified in `BusinessConfigs` . (Optional)
        */
        endPoint?: string;
        /**
        * HTTP request path of the API.
        */
        path: string;
        /**
        * HTTP request method.
        */
        method: Method;
        /**
        * Need signature or not.
        */
        needToSign: boolean;
        /**
        * Stable request parameter of the API.
        */
        stableParam: APIRequest.DefinedParameter;
        /**
        *Schema of request parameters
        */
        schema: Joi.ObjectSchema;
    }
    /**
    * Default request config for each _Common Action_.
    * Index corresponds to the order of enumeration.
    */
    const CommonConfigs: ConfigStruct[];
    /**
    * Default request config for each _Business Action_.
    * Index corresponds to the order of enumeration.
    */
    const BusinessConfigs: ConfigStruct[];
}
/**
* A module contains all utilities the API need.
*/
export declare namespace APIUtil {
    /**
    * Serial number generator class.You can get new serial number or reset it.
    */
    class Serial {
        /**
        * constructor
        * The instance will register a serial number generator.
        */
        constructor();
        /**
        * Return a new serial number.
        */
        next(): string | undefined;
        /**
        * Register a new generator.
        */
        anew(): this;
    }
}
