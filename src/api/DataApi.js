// 数据服务
import Ajax from './axiosinstance';
import Cookies from '../utils/Cookies';
import user from '../model/User';

const ajax = new Ajax({
  // baseURL: '/api',
  baseURL: 'http://192.168.18.196:8082',
  // baseURL: 'http://192.168.18.198:8082',
});

export function getBalanceAccountList(token, startTime, endTime, currentPage, pageSize) {
  return ajax.get('/channelBalance/getBalanceAccountList', {
    params: {
      token,
      startTime,
      endTime,
      currentPage,
      pageSize,
    },
  });
};
//手机号加密
export function generateToken() {
  return ajax.post('/user/register/generateToken', {});
}
//获取系统时间
export function getSystemTime() {
  return ajax.post('/system/getTime', {});
}
//账户总览 banner显示情况
export function getBankShowData() {
  return ajax.post('/pc/account/overview/banner', {});
}
//账户总览
export function getTotalAccountData() {
  return ajax.post('/user/profit', {});
}
//账户总览 福利
export function getWelfareData() {
  return ajax.post('/pc/account/overview/couponInfo', {});
}
//账户总览 推荐理财
export function RecommendProductData() {
  return ajax.post('/pc/account/overview/gethelpcenter/recommendProducts', {});
}

//我的银行卡 卡信息
export function getCardInfoData() {
  return ajax.post('/account/center/bankInfo', {});
}
//我的银行卡 在投资金
export function getZtCapitalData() {
  return ajax.post('/bank/getAccountAmount', {});
}
//用户信息
export function getUserInfoData() {
  return ajax.post('/pc/user/info', {});
}
//账户信息
export function getAccountInfo() {
  return ajax.post('/user/totalAccount', {});
}
//提款账户信息
export function getDrawMoneyAccountInfo() {
  return ajax.post('/account/center/accountInfo', {});
}
//提款接口
export function withDrawMoney(mobileCode,orderAmount,transactionPassword) {
  return ajax.post('/user/withdrawals', {
    mobileCode,
    orderAmount,
    transactionPassword
  });
}
//提现 发送短信验证码
export function drawMoneySendPhone(orderAmount) {
  return ajax.post('/withdrawals/send/code', {
    orderAmount,
  });
}
//邀请记录 header
export function inviteHeaderData(status,currentPage) {
  return ajax.post('/user/invitation/header', {});
}
//邀请记录
export function inviteRecordData(status,currentPage) {
  return ajax.post('/user/invitation/list', {
    status,//0,0,1,2，3
    currentPage,
    pageSize:'6'
  });
}
//奖励明细
export function awardDetailData(friendLevel) {
  return ajax.post('/user/partner/earnings', {
    currentPage:'0',
    pageSize:'6',
    friendLevel//0,1,2
  });
}
//我的积分
export function getIntegralData(currentPage) {
  return ajax.post('/integral/getIntegralList', {
    currentPage,
    pageSize:6
  });
}
//我的地址 删除地址
export function delAddressData(id) {
  return ajax.post('/addressManage/delAddress', {id});
}
//我的地址 获取
export function getAddressData() {
  return ajax.post('/addressManage/getAddress', {});
}
//我的地址  增加地址
export function addAddressData(consigneeName,mobileNo,location,detailAddress) {
  return ajax.post('/addressManage/addAddress', {
    consigneeName,
    detailAddress,
    location,
    mobileNo
  });
}
//我的地址  更新用户地址
export function upDateAddressData(consigneeName,mobileNo,location,detailAddress,id) {
  return ajax.post('/addressManage/updateAddress', {
    consigneeName,
    detailAddress,
    location,
    mobileNo,
    id
  });
}
//我是合伙人 获取合伙人信息
export function getPartnerData() {
  return ajax.post('/user/partner', {});
}
//我是合伙人 添加合伙人
export function addPartnerData(mobileNo) {
  return ajax.post('/pc/supplement/partner', {mobileNo});
}
//我的消息
export function getInfoListData(currentPage) {
  return ajax.post('/message/person/list', {
    currentPage,
    pageSize:6
  });
}
//我的鸟币 鸟币总览
export function birdPandectData() {
  return ajax.post('/account/birdUserInfo', {});
}
//我的鸟币 获得鸟币
export function getBirdCoinData(type,currentPage) {
  return ajax.post('/account/birdCoinWater', {
    currentPage,
    pageSize:6,
    type
  });
}

//我的返现券
export function cashBackTickData(status,currentPage) {
  return ajax.post('/account/coupon/list/cashBack', {
    status,
    currentPage,
    pageSize:6
  });
}
//我的返现券,赠送券
export function sendTickData(userCouponId) {
  return ajax.post('/pc/presentCoupon/presentCode/get', {
    userCouponId
  });
}
//我的加息券
export function raiseTickData(status) {
  return ajax.post('/account/coupon/list/increase', {
    currentPage:0,
    status,
    pageSize:6
  });
}
//资金明细 资金总览
export function detailMoneyTotalData() {
  return ajax.post('/pc/assetDetail/total/get', {});
}
//兑换券码
export function exchargeTickitData(code,machineNo,pictureCode) {
  return ajax.post('/user/exchangeCode/exchange', {
    code,
    machineNo,
    pictureCode
  });
}
//个人资料
export function getPersonData() {
  return ajax.get('/get/person/data')
}
//个人资料
export function personalInfo() {
  ajax.get('/get/person/data')
  .then((data)=>{
    Cookies.updateUser(data)
    user.updateUserFromCookie();
  },(error)=>{
  })
}
//资金明细 列表
export function detailMoneyListData(queryType,startDate,endDate,currentPage=0) {
  return ajax.post('/pc/assetDetail/list/get', {
    queryType,//ALL，CZ,TX,TZ,HK,FX,QT
    currentPage,
    startDate,
    endDate,
    pageSize:6
  });
}
//回款记录 待回款
export function returndWaitData(startTime,endTime,currentPage=0) {
  return ajax.post('/payment/waitfor/list', {
    currentPage,
    handleStatus:'ZFCG',
    startTime,
    endTime,
    pageSize:6
  });
}
//回款记录 已回款
export function returndAlreayData(startTime,endTime,currentPage=0) {
  return ajax.post('/payment/already/list', {
    currentPage,
    handleStatus:'YHK',
    startTime,
    endTime,
    pageSize:6
  });
}
//投资记录 列表
export function trackRecordData(status,startTime,endTime,currentPage) {
  return ajax.post('/account/current/orderList', {
    currentPage,
    status,//10,1,2,4,3
    startTime,
    endTime,
    pageSize:6
  });
}
//查看协议
export function createProtocolData(orderNo) {
  return ajax.post('/invest/proxy/contract', {orderNo});
}
//投资记录 投资总览
export function trackTotalAmountData(status,endTime,startTime) {
  return ajax.post('/account/fixed/homepage', {});
}
//登录
export function userLoginData(mobileNo,password,pictureCode,machineNo) {
  return ajax.post('/user/login/login', {
    mobileNo,
    password,
    pictureCode,
    machineNo
  });
}

//注册 获取手机验证码
export function getPhoneCodeData(mobileNo,pictureCode,machineNo) {
  return ajax.post('/mobile/pcmobilecode/getMobileCode', {
    machineNo,
    mobileNo,
    pictureCode,
    sendType:'1'
  });
}
//注册
export function userRegisterData(mobileNo,pictureCode,mobileCode,password,partnerMobile,machineNo,dept) {
  return ajax.post('/user/register/registerUser', {
    mobileNo,
    password,
    pictureCode,
    mobileCode,
    partnerMobile:partnerMobile||'',
    machineNo,
    dept:dept||'',
    readAndAgree:'1'
  });
}
//开通银行存管账户
export function depositRealData(identityCode,userName) {
  return ajax.post('/user/register/userAuthPwd', {
    identityCode,
    userName,
  });
}
//设置支付密码
export function depositPasswordData(transactionPassword,transactionPasswordTry) {
  return ajax.post('/user/transactionpassword/save', {
    transactionPassword,
    transactionPasswordTry
  });
}
//绑定卡成功  推荐理财
export function depositRecommendData() {
  return ajax.post('/pc/account/overview/getRecommendProducts', {});
}
//绑定银行卡  发送手机验证码
export function depositSendCodeData(sendType,mobileNo) {
  return ajax.post('/bank/bindCardMobileCode', {
    sendType,//3绑卡,4换卡
    mobileNo
  });
}

//绑定银行卡  银行卡列表
export function depositCardListData(reqParam) {
  return ajax.post('/bank/list/bk', {});
}
//绑定银行卡  绑卡人信息
export function depositPersionInfo(reqParam) {
  return ajax.post('/bank/person/data', {});
}
//绑定银行卡
export function depositBindCardData(belongBank,bankNo,gateId,mobileCode,mobileNo) {
  return ajax.post('/bank/bindCard', {
    belongBank,//所属行
    bankNo,//卡号
    gateId,//银行编号
    mobileCode,//	验证码
    mobileNo,//	手机号
  });
}
//更换银行卡
export function depositChangeCardData(amountFlag,belongBank,bankNo,gateId,mobileCode,mobileNo) {
  return ajax.post('/bank/replaceCard', {
    amountFlag,
    belongBank,//所属行
    bankNo,//卡号
    gateId,//银行编号
    mobileCode,//	验证码
    mobileNo,//	手机号
  });
}
//更换银登陆密码
export function changeLoginPsdData(machineNo,mobileNo,pictureCode) {
  return ajax.post('/mobile/pcmobilecode/getMobileCode', {
      machineNo,
      mobileNo,
      pictureCode,
      sendType:2
  });
}
//忘记密码
export function forgetPsdData(mobileNo,mobileCode,newPwd,newPwdTry,idCard) {
  return ajax.post('/user/login/forgetPwd', {
    mobileNo,
    mobileCode,
    newPwd,
    newPwdTry,
    idCard
  });
}
//重置密码 发送短信验证码
export function resetSendPhoneData(idCard) {
  return ajax.post('/user/transactionpassword/send', {
    idCard
  });
}
//重置密码 token
export function resetTokenData(idCard,mobileCode) {
  return ajax.post('/user/transactionpassword/token', {
    idCard,
    mobileCode
  });
}
//重置密码 password
export function savePasswordData(idCard,mobileCode,transactionPassword,transactionPasswordTry,token) {
  return ajax.post('/user/transactionpassword/update', {
    idCard,
    mobileCode,
    transactionPassword,
    transactionPasswordTry,
    token
  });
}

//获取银行通知信息
export function getBankNoteData() {
  return ajax.post('/bank/list/notice');
}

//获取充值模块银行卡列表
export function getBankList() {
  return ajax.post('/bank/list/online');
}

//充值限额接口
export function orderAmountLimitApi(orderAmount) {
  return ajax.post('/user/recharge/check/amount',{
    orderAmount,//充值金额
  });
}
//充值接口
export function rechargeMoney(orderAmount,payType,gateId='',mobileCode='') {
  return ajax.post('/user/recharge',{
    gateId,//银行卡id
    orderAmount,//充值金额
    payType,//充值类型
    mobileCode//手机验证码
  });
}
//确认充值 发送短信验证码
export function confirmRechargeSendPhone(orderAmount) {
  return ajax.post('/user/recharge/send/code',{
    orderAmount
  });
}

//切换免密充值状态
export function changePassState(agreementCz,mobileCode,transactionPassword) {
  return ajax.post('/update/agreement/cz',{
    agreementCz,//切换状态
    mobileCode,//手机验证码
    transactionPassword,//交易密码
  });
}
//免密充值  发送短信验证码
export function changeAgreementState() {
  return ajax.post('/update/agreement/send',{});
}
//充值提现流水记录
export function getTradeListData(operateType,startDate,endDate,currentPage) {
  return ajax.post('/account/watercourse/list',{
    currentPage,
    pageSize:6,
    operateType,//CZ//TX//''
    startDate,
    endDate,
  })
}
//提现时间
export function getwithdrawalsTimeApi() {
  return ajax.post('/withdrawals/prompt/message',{})
}
