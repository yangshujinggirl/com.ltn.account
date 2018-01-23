import Url from 'url';
import JSCookies from 'js-cookie';
import Cookies from './Cookies';
import user from '../model/User';

import { Modal } from 'antd';
const confirm = Modal.confirm;

const Utils = {
  searchFormat:(searchStr)=>{
    let urlObj = Url.parse(searchStr,{
      querystring:true
    });
    return urlObj.query
  },
  // 处理接口响应 sessionKey 超时
  handlerSessionTimeout:(resultCode)=>{
    switch (resultCode) {
      case '10000005':
        Cookies.clearCookie();
        window.location.reload();
        break;
      case '10000006':
        Cookies.clearCookie();
        window.location.reload();
        break;
    }
  },
  //目标页 去绑卡
  goBindCardUrl:(backUrl)=> {
    let visible=false;
    let goUrl;
    let status;
    if(!user.isNameAuth()) {
      visible=true;
      goUrl=`/user/depostReal?backUrl=${backUrl}`;
      status='1';
    } else if(!user.isSetPwd()) {
      visible=true;
      goUrl=`/user/depostPsd?backUrl=${backUrl}`;
      status='1';
    } else {
      location.hash =`/user/depostCard?backUrl=${backUrl}`;
      return  {
        visible,
        goUrl,
        status
      };
    }
    return  {
      visible,
      goUrl,
      status
    };
  },
  //目标页：充值提现
  goNextUrl:(backUrl)=> {
    let visible=false;
    let goUrl;
    let status;
    if(!user.isNameAuth()) {
      visible=true;
      goUrl=`/user/depostReal?backUrl=${backUrl}`;
      status='1';
    } else if(!user.isSetPwd()) {
      visible=true;
      goUrl=`/user/depostPsd?backUrl=${backUrl}`;
      status='1';
    } else if(!user.isBindCard()) {
      visible=true;
      goUrl=`/user/depostCard?backUrl=${backUrl}`;
      status='2';
    }  else {
      location.hash =backUrl;
      return  {
        visible,
        goUrl,
        status
      };
    }
    return  {
      visible,
      goUrl,
      status
    };
  },
  //去投资
  goProduct() {
    window.location.href='/finance/list/0/1/0/0';
  },
  //对姓名，电话号码打码
  //str：字符串，frontLen：前面保留位数，endLen：后面保留位数
  mosaicsStr :(str,frontLen,endLen)=> {
    var len = str.length-frontLen-endLen;
    var xing = '';
    for (var i=0;i<len;i++) {
      xing+='*';
    }
    return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
  }
}
export default Utils;
