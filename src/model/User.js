import Cookies from '../utils/Cookies';
import lodash from 'lodash';
// 用户对象
const User = function(){
  this.updateUserFromCookie();
}

User.prototype.update = function(){
  updateUserInfoFromCookie();
}

User.prototype.updateUserFromCookie = function(){
  let userInfo = Cookies.getUser();
  this.userInfo = userInfo||{};
}
//用户是否实名
User.prototype.isNameAuth = function(){
  let isNameAuth = Cookies.getUser().nameAuthStatus;
  if(isNameAuth==1) {
    return true;
  } else {
    return false;
  }
}
//用户是否设置交易密码
User.prototype.isSetPwd = function(){
  let pwdAuthStatus = Cookies.getUser().pwdAuthStatus;
  if(pwdAuthStatus==1) {
    return true;
  } else {
    return false;
  }
}
//用户是否绑卡
User.prototype.isBindCard = function(){
  let bankAuthStatus = Cookies.getUser().bankAuthStatus;
  if(bankAuthStatus==1) {
    return true;
  } else {
    return false;
  }
}

let user = new User();

export default user;
