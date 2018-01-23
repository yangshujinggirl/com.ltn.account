import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import Head from './comments/Head';
import Footer from './comments/Footer';
import lodash from 'lodash';
// TODO: api 名称统一修改为 login;  getUserInfo  ApiServer.login
import {
  userLoginData,
  getUserInfoData,
  personalInfo,
  getTotalAccountData
} from '../../api/DataApi';

import user from '../../model/User';
import Utils from '../../utils';
// cookie封装
import Cookies from '../../utils/Cookies';
import RegExpUtil from '../../api/RegExpUtil';

import ErrorText from '../comments/ErrorText';

import './UserCompontPage.scss';
import LoginBg from './imgs/login_bg.png';
import userLbgImg from './imgs/register_bg_left.png';
class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      machineNo:'',//动态机器码
      mobileValue:'',//手机号
      passwordValue:'',//密码
      imgCodeValue:'',//图形验证码
      disabled:true,//按钮是否可点
      errorText:'',//错误提示信息
      visible:false,
      loading:false,
      search:Utils.searchFormat(this.props.location.search)
    }
  }
  componentWillMount() {
    document.title='登录';
    this.machineNoChange();
  }
  // 生成机械码
  machineNoChange() {
    const machineNo = Date.now();
    this.setState({
      machineNo
    });
  }
  //totalAccount
  getTotalAccount() {
    getTotalAccountData()
    .then((data)=>{
      Cookies.updateUser(data)
      user.updateUserFromCookie();
    })
    .catch((error)=>{
    })
  }
  //表单改变事件
  changeEvent(event) {
    let eleId = event.target.getAttribute('data-id');
    let value = lodash.trim(event.target.value);
    let {mobileValue,imgCodeValue,passwordValue} = this.state;
    switch (eleId) {
      case '0':
        mobileValue = value;
        break;
      case '1':
        passwordValue = value;
        break;
      case '2':
        imgCodeValue = value;
        break;
    }
    let disabled = lodash.isEmpty(mobileValue)||lodash.isEmpty(imgCodeValue)||lodash.isEmpty(passwordValue);
    this.setState({
      visible:false,
      mobileValue,
      passwordValue,
      imgCodeValue,
      disabled
    })
  }
  // 表单校验
  checkForm(){
    let {mobileValue,imgCodeValue,passwordValue} = this.state;
    let errorText,visible=true;
    // 手机号码验证不通过
    if(!RegExpUtil.mobile.test(mobileValue)){
      errorText = '请输入正确的手机号码';
    }else if(imgCodeValue.length<6){
      errorText = '请输入正确的图形验证码';
    }else if(!RegExpUtil.password.test(passwordValue)){
      errorText = '密码至少为6位，只能使用且必须同时包含数字和字母';
    }else{
      errorText='';
      visible=false;
    }
    this.setState({
      errorText,
      visible
    })
    return {
      errorText,
      visible
    }
  }
  //去登录
  goLogin() {
    this.setState({
      loading:true,
      disabled:false
    })
    let {
      mobileValue,
      passwordValue,
      imgCodeValue,
      machineNo,
      search
    } = this.state;
    let backUrl = search.backUrl?search.backUrl:'/account/viewall';
    userLoginData(mobileValue,passwordValue,imgCodeValue,machineNo)
    .then(data=>{
      // 1. 将 sessionKey uid 设置到cookie中,用于和其他子域名堆积
      Cookies.set('sessionKey',data.sessionKey);
      Cookies.set('uid',data.uid);
      // 2. 初始化用户信息
      Cookies.initUserInfo(data);
      // 3. 更新user
      user.updateUserFromCookie();
      this.getTotalAccount()
      personalInfo();
    })
    .then(data=>{
      // 1. 更新部分用户信息进去
      Cookies.updateUser(data);
      // 2. 更新user
      user.updateUserFromCookie();
      // console.log('login:',user)
      if(search.backUrl) {
        window.location.href = backUrl;
      } else {
        location.hash = backUrl;
      }

    })
    .catch(error=>{
      this.machineNoChange();
      this.setState({
        errorText:error.message||'服务器异常',
        visible:true,
        loading:false,
        disabled:true
      })
    })
  }

  submit() {
    if(this.state.disabled){
      return false;
    }
    let checkFormRes = this.checkForm();
    // 表单校验通过
    if(!checkFormRes.visible){
      this.goLogin();
    }
  }

  render() {
    const { machineNo,visible,errorText,disabled,loading } =this.state;
    return(
      <div className="component-form-content">
        <div className="head-content clear">
          <p className="texts">登录领投鸟</p>
          <Link to="/user/register" className="go-register">注册></Link>
        </div>
        <div className="form-wrap">
          <div className="row">
            <input
              type="text"
              data-id="0"
              maxLength="11"
              onChange={this.changeEvent.bind(this)}
              placeholder="请输入手机号码"/>
          </div>
          <div className="row">
            <input
              type="password"
              data-id="1"
              onChange={this.changeEvent.bind(this)}
              placeholder="请输入账号密码"/>
          </div>
          <div className="row clear">
            <input
              type="text"
              data-id="2"
              maxLength="6"
              placeholder="请输入图形验证码"
              onChange={this.changeEvent.bind(this)}
              className="code-input"/>
            <span className="img-code">
              <img src={`http://192.168.18.196:8082/user/register/pictureCode/${machineNo}`} onClick={this.machineNoChange.bind(this)}></img>
            </span>
          </div>
          <ErrorText visible={visible}>
            {errorText}
          </ErrorText>
          <div className={`submit-btn-row ${disabled?'disabled':''}`}>
            <Button
              type="primary"
              loading={loading}
              onClick={this.submit.bind(this)}>
             立即登录
           </Button>
          </div>
          <div className="forget-pwd-wrap">
            <Link to="/user/changeLoginPsd" className="forget-psd">忘记密码？</Link>
          </div>
          <div className="bg-wrap">
            <img src={LoginBg}></img>
          </div>
        </div>
      </div>
    )
  }
}

class LoginPage extends React.Component {
  render() {
    return(
      <div className="user-components-page">
        <Head title="欢迎回来"/>
        <div className="user-main-action">
          <div className="user-content-wrap clear">
            <div className="part-l">
              <img src={userLbgImg}></img>
            </div>
            <div className="part-r">
              <Form {...this.props}/>
            </div>
        </div>
        </div>
        <Footer />
      </div>
    )
  }
}


export default LoginPage;
