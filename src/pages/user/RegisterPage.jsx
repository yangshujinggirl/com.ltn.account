import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import Head from './comments/Head';
import Footer from './comments/Footer';
import lodash from 'lodash';
import Cookies from '../../utils/Cookies';
import user from '../../model/User';
import {
  userRegisterData,
  getPhoneCodeData,
  getPersonData,
  personalInfo
} from '../../api/DataApi';

import Utils from '../../utils';
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
      mobileValue:'',//手机号0
      passwordValue:'',//密码1
      imgCodeValue:'',//图形验证码2
      phoneCodeValue:'',//手机验证码3
      referPhone:Utils.searchFormat(this.props.location.search).mobile||'',//推荐人手机号4
      disabled:true,//注册按钮是否可点
      codeBtndisabled:true,//发送验证码按钮是否可点
      getCodeText:'获取验证码',
      toggle:false,
      loading:false,
      loading2:false,
      errorText:'',//错误提示信息
      visible:false,//错误弹框
      isDept:Utils.searchFormat(this.props.location.search).mobile?true:false
    }
  }
  componentWillMount() {
    document.title='注册';
    this.machineNoChange();
  }
  // 生成机械码
  machineNoChange() {
    const machineNo = Date.now();
    this.setState({
      machineNo: machineNo
    });
  }
  //推荐人显示状态
  toggleEvent() {
    this.setState({
      toggle:!this.state.toggle
    })
  }
  //表单改变事件
  changeEvent(event) {
    let eleId = event.target.getAttribute('data-id');
    let value = lodash.trim(event.target.value);
    let {mobileValue,passwordValue,imgCodeValue,phoneCodeValue,referPhone,count} = this.state;
    switch(eleId) {
      case '0':
        mobileValue=value;
        break;
      case '1':
        passwordValue=value;
        break;
      case '2':
        imgCodeValue=value;
        break;
      case '3':
        phoneCodeValue=value;
        break;
      case '4':
        referPhone=value
        break;
    }
    let disabled = lodash.isEmpty(mobileValue)||lodash.isEmpty(passwordValue)||lodash.isEmpty(imgCodeValue)||lodash.isEmpty(phoneCodeValue);
    let codeBtndisabled = lodash.isEmpty(mobileValue)||lodash.isEmpty(imgCodeValue)||count>0;
    this.setState({
      disabled,
      mobileValue,
      passwordValue,
      imgCodeValue,
      phoneCodeValue,
      referPhone,
      codeBtndisabled,
      visible:false
    })
  }
  // 处理验证码按钮进入倒计时
  msgCodeBtnTimer(count){
    this.setState({
      loading2:false,
      count
    })
    count--;
    if(count>0){
      setTimeout(()=>{
        this.msgCodeBtnTimer(count);
      },1000);
      this.setState({
        getCodeText:`${count}秒后再获取`
      });
    }else{
      this.setState({
        getCodeText:'重新获取'
      });
    }
  }
  //获取手机验证码Api
  getCodeApi() {
    let {
      codeBtndisabled,
      loading2,
      mobileValue,
      imgCodeValue,
      machineNo
    } = this.state;
    this.setState({
      codeBtndisabled:true,
      loading2:true
    })
    getPhoneCodeData(mobileValue,imgCodeValue,machineNo)
    .then(data=>{
      // 请求成功，开启倒计时
      this.setState({
        loading2:false
      })
      this.msgCodeBtnTimer(60);
    })
    .catch(err=>{
      this.machineNoChange();
      this.setState({
        errorText:err.message,
        getCodeText:'重新获取',
        visible:true,
        loading2:false
      })
    })
  }
  //提交获取手机验证码
  submitGetCode() {
    let {codeBtndisabled} = this.state;
    if(codeBtndisabled){
      return false;
    }
    let checkFormRes = this.checkFormCode();
    // 表单校验通过
    if(!checkFormRes.visible){
      this.getCodeApi();
    }
  }
  // 表单校验 获取图形验证码
  checkFormCode(){
    let {
      mobileValue,
      imgCodeValue,
    } = this.state;
    let errorText,visible=true;
    if(!RegExpUtil.mobile.test(mobileValue)){
      errorText = '请输入正确的手机号码';
    } else if(imgCodeValue.length<6){
      errorText = '请输入正确的图形验证码';
    } else{
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
  // 提交表单校验
  checkForm(){
    let {
      mobileValue,
      imgCodeValue,
      phoneCodeValue,
      passwordValue,
      referPhone,
      isDept
    } = this.state;
    let errorText,visible=true;
    if(!RegExpUtil.mobile.test(mobileValue)){
      errorText = '请输入正确的手机号码';
    }else if(imgCodeValue.length<6){
      errorText = '请输入正确的图形验证码';
    } else if(!RegExpUtil.phoneCode.test(phoneCodeValue)) {
      errorText = '请输入正确的手机验证码';
    } else if(!RegExpUtil.password.test(passwordValue)) {
      errorText = '密码必须为6-18位数字和字母组合';
    } else if(!!isDept) {
      errorText='';
      visible=false;
    } else if(!lodash.isEmpty(referPhone)){
      if(!RegExpUtil.mobile.test(referPhone)){
        errorText = '请输入正确的推荐人手机号码';
      }else if(referPhone == mobileValue){
        errorText = '推荐人不能为本人';
      }else{
        errorText='';
        visible=false;
      }
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
  //注册接口
  goRegister() {
    let {
      mobileValue,
      imgCodeValue,
      phoneCodeValue,
      passwordValue,
      referPhone,
      machineNo,
      disabled,
      loading} = this.state;
    disabled = true;
    loading = true;
    this.setState({
      disabled,
      loading
    })
    // 从cookie中获取dept
    let dept = Cookies.get('dept');
    // 发送请求
    userRegisterData(mobileValue,imgCodeValue,phoneCodeValue,passwordValue,referPhone,machineNo,dept)
    .then(data=>{
      // 注册成功
      // 1. 将 sessionKey uid 设置到cookie中,用于和其他子域名堆积
      Cookies.set('sessionKey',data.sessionKey);
      Cookies.set('uid',data.uid);
      // 2. 初始化用户信息
      Cookies.initUserInfo(data);
      // 3. 更新user
      user.updateUserFromCookie();
      //查询用户个人信息
      personalInfo();
    })
    .then(data=>{
      // 1. 更新部分用户信息进去
      Cookies.updateUser(data);
      // 2. 更新user
      user.updateUserFromCookie();
      this.props.history.push('/user/depostReal');
    })
    .catch(error=>{
      // 注册失败
      this.machineNoChange();
      this.setState({
        errorText:error.message,
        visible:true,
        loading:false
      })
    })
  }
  //提交注册
  submit() {
    let {disabled} = this.state;
    // 按钮不可用
    if(disabled){
      return false;
    }
    let checkFormRes = this.checkForm();
    // 表单校验通过
    if(!checkFormRes.visible){
      this.goRegister();
    }
  }

  render() {
    const {
      machineNo,
      codeBtndisabled,
      toggle,
      visible,
      errorText,
      disabled,
      getCodeText,
      loading2,
      loading,
      isDept
    } =this.state;
    return(
      <div className="component-form-content">
        <div className="head-content clear">
          <p className="texts">个人</p>
          <Link to="/user/login" className="go-register">登录></Link>
        </div>
        <div className="form-wrap">
          <div className="row">
            <input
              type="text"
              data-id="0"
              maxLength="11"
              onChange={(e)=>this.changeEvent(e)}
              placeholder="请输入手机号码"/>
          </div>
          <div className="row clear">
            <input
              type="text"
              data-id="2"
              maxLength="6"
              placeholder="请输入图片验证码"
              onChange={(e)=>this.changeEvent(e)}
              className="code-input"/>
            <span className="img-code">
              <img
                src={`http://192.168.18.196:8082/user/register/pictureCode/${machineNo}`}
                onClick={this.machineNoChange.bind(this)} />
            </span>
          </div>
          <div className="row clear">
            <input
              type="text"
              data-id="3"
              maxLength="4"
              placeholder="请输入短信验证码"
              onChange={(e)=>this.changeEvent(e)}
              className="code-input"/>
            <div className={`phone-code ${codeBtndisabled?'disabled':''}`}>
              <Button
                type="primary"
                loading={loading2}
                onClick={()=>this.submitGetCode()}>
               {getCodeText}
             </Button>
            </div>
          </div>
          <div className="row">
            <input
              type="password"
              data-id="1"
              maxLength="18"
              onChange={(e)=>this.changeEvent(e)}
              placeholder="请设置密码，6-18位数字、字母组合"
            />
          </div>
          {
            !isDept&&<div className={`referrer-write ${toggle?'show':''}`}>
                      <p className="refer-lable" onClick={()=>this.toggleEvent()}>
                        推荐人（选填）
                        <span className={`arrow  ${toggle?'selected':''}`}></span>
                      </p>
                      <input
                        type="text"
                        data-id="4"
                        maxLength="11"
                        onChange={(e)=>this.changeEvent(e)}
                        className="refer-input"
                        placeholder="请输入推荐人手机号"/>
                    </div>
          }
          <ErrorText visible={visible}>
            {errorText}
          </ErrorText>
          <div className={`submit-btn-row ${disabled?'disabled':''}`}>
            <Button
              type="primary"
              loading={loading}
              onClick={()=>this.submit()}>
             同意协议并注册
           </Button>
          </div>
          <Link to="" className="server-protocol">
            <p className="protocol-url">用户服务协议</p>
          </Link>
        </div>
      </div>
    )
  }
}

class LoginPage extends React.Component {
  render() {
    return(
      <div className="user-components-page user-register-page">
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
