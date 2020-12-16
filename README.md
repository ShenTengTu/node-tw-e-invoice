> **This project is no longer being actively developed. If you are interested in this project, welcome to fork.**

[![npm version](https://badge.fury.io/js/node-tw-e-invoice.svg)](https://badge.fury.io/js/node-tw-e-invoice)

# node-tw-e-invoice
An unofficial Node.js interface of Taiwan MOF E-Invoice API .
台灣財政部電子發票 API 的 非官方 Node.js 介面。

```
npm i node-tw-e-invoice --save
```

## Feature
- Request by action
- Request parameters schema validation
- Provide serial number generator
- Auto convert to Unix timestap
- Auto generate signature

**Not implement :**
- Real HTTP Request
  > Retrun Promise contain `path`,`method` & `param` values .

- Request Individual statistics information

## Example

```js
require('dotenv').config();
const {TaiwanEInvoice, InquirerIdentity, CarrierCardType}= require('node-tw-e-invoice');
const {Serial}= require('node-tw-e-invoice').APIUtil;

//Create TaiwanEInvoice instance
const EInvoice = new TaiwanEInvoice(process.env.APP_ID,process.env.API_KEY);

// Create serial number generator
const serial = new Serial();


EInvoice.inquirer(process.env.UUID,InquirerIdentity.Common)//Declare identity
.action('qryCarrierAgg',{//Request by action
  serial:serial.next(),
  cardType: CarrierCardType.Mobile,
  cardNo:'/AB56P5Q',
  timeStamp:new Date(),
  cardEncrypt:'password'
}).then((values)=>{//Return Promise
  let {path,method,param}  = values;
  param.timeStamp += 10;
  console.log(param)
  //start sending a request ...
}).catch((err)=>{
  let {name, details} = err;//Get error if schema validate fail
  console.log(name);
  console.log(details[0].message);
});
```

## Documentation
- Check out the [Using Guides](https://github.com/ShenTengTu/node-tw-e-invoice/wiki)
  - https://github.com/ShenTengTu/node-tw-e-invoice/wiki
- Check out the [API Doc](https://shentengtu.github.io/node-tw-e-invoice/)
  - https://shentengtu.github.io/node-tw-e-invoice/

## Official specifications
- [電子發票應用API規格 V1.5](https://www.einvoice.nat.gov.tw/home/DownLoad?fileName=1510206773173_0.pdf) :E-Invoice API Spec. `v1.5`
- [電子發票營業人應用API規格 V1.4](https://www.einvoice.nat.gov.tw/home/DownLoad?fileName=1468833776540_0.pdf) : E-Invoice Business Entity API Spec. `v1.4`
- [電子發票行動支付應用API規格 V1.4](https://www.einvoice.nat.gov.tw/home/DownLoad?fileName=1510206811150_0.pdf) : E-Invoice Mobile Payment API Spec. `v1.4`
