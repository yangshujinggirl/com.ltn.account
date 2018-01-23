import JSCookies from 'js-cookie';
import lodash from 'lodash';
const cookieprefix='ltn_';
const cookieDomain = (window.location.href.indexOf('lingtouniao.com')==-1)?window.location.hostname:'.lingtouniao.com';
const Cookies = {
  // 获取用户信息，从cookie中
  getUser:()=>{
    let user = JSCookies.getJSON(`${cookieprefix}user`);
    if(typeof user==='undefined'){
      user={}
    }
    return user;
  },
  // 更新cookie中用户信息
  updateUser:(data)=>{
    let user = JSCookies.getJSON(`${cookieprefix}user`);
    user = {
      ...user,
      ...data
    }
    JSCookies.set(`${cookieprefix}user`,user,{
      domain:cookieDomain
    });
  },
  // 初始化用户信息
  initUserInfo:(data)=>{
    JSCookies.set(`${cookieprefix}user`,data,{
      domain:cookieDomain
    });
  },
  // 设置cookie
  set:(key,value,options={})=>{
    JSCookies.set(`${cookieprefix}${key}`,value,options);
  },
  // 获取cookie
  get:(key)=>{
    return JSCookies.get(`${cookieprefix}${key}`)
  },
  // 清除cookie,用户状态相关信息
  clearCookie:()=>{
    JSCookies.remove('ltn_sessionKey');
    JSCookies.remove('ltn_uid');
    JSCookies.remove('ltn_user');
  },
  // 清除指定cookie,
  deleteCookie:(key)=>{
    JSCookies.remove(`${cookieprefix}${key}`);
  }
}
export default Cookies;
