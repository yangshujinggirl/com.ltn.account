import React from 'react';
import { Link } from 'react-router-dom';
import { Select,Modal,Button } from 'antd';

import {
  changeLoginPsdData,
  forgetPsdData
} from '../../api/DataApi';
// 外部服务
import lodash from 'lodash';
// 本地服务
import Utils from '../../utils';
import Cookies from '../../utils/Cookies';
import RegExpUtil from '../../api/RegExpUtil';
import ErrorText from '../comments/ErrorText';//错误消息
import Head from './comments/Head';
import Footer from './comments/Footer';

import './ChangeLoginPsd.scss';
import HrBankImg from './imgs/deposit_real_hr.jpg';

const confirm = Modal.confirm;

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      machineNo:'',//动态机器码
      mobileValue:'',//手机号
      imgCodeValue:'',//图形验证码2
      phoneCodeValue:'',//手机验证码
      identityValue:'',//身份证
      psdOneValue:'',//密码1
      psdTwoValue:'',//密码2
      errorText:'',
      visible:false,
      isSend:true,//手机验证码按钮是否可点
      count:60,
      disabled:true,//按钮是否可点
      getCodeText:'获取验证码',
      loading:false,
      loading2:false,
      isShow:false//身份证是否校验
    }
  }
  componentWillMount() {
    document.title='重置登录密码';
    this.machineNoChange()
  }
  // 生成机械码
  machineNoChange() {
    const temporaryMachineNo = Date.now();
    this.setState({
      machineNo: temporaryMachineNo
    });
  }
  //表单change事件
  changeEvent(event) {
    let eleId = event.target.getAttribute('data-id');
    let value = lodash.trim(event.target.value);
    let {
      mobileValue,
      imgCodeValue,
      phoneCodeValue,
      psdOneValue,
      psdTwoValue,
      identityValue,
      count,
      isShow
    } =this.state;

    switch(eleId){
      case '0':
        mobileValue=value;
        break;
      case '1':
        imgCodeValue=value;
        break;
      case '2':
        phoneCodeValue=value;
        break;
      case '3':
        identityValue=value;
        break;
      case '4':
        psdOneValue=value;
        break;
      case '5':
        psdTwoValue=value;
        break;
      default:
    }
    let disabled = lodash.isEmpty(mobileValue)||lodash.isEmpty(imgCodeValue)||lodash.isEmpty(phoneCodeValue)
    ||lodash.isEmpty(psdOneValue)||lodash.isEmpty(psdTwoValue)||(isShow&&lodash.isEmpty(identityValue));

    let isSend = lodash.isEmpty(mobileValue)||lodash.isEmpty(imgCodeValue)||count<60;
    this.setState({
      mobileValue,
      imgCodeValue,
      phoneCodeValue,
      psdOneValue,
      psdTwoValue,
      identityValue,
      disabled,
      isSend,
      visible:false
    });
  }
  //倒计时
  handleClick() {
    const timer = setInterval(()=> {
        let count = this.state.count;
        this.state.isSend = true;
        count-=1;
        if(count<1) {
          window.clearInterval(timer);
          this.setState({
            isSend:false,
            count:60,
            getCodeText:'重新获取'
          });
        } else {
          this.setState({
            count,
            getCodeText:`${count}秒后重发`
          });
        }
      },1000)
  }
  //获取手机验证码
  getPhoneCode() {
    let { machineNo,mobileValue,imgCodeValue } =this.state;
    this.setState({
      isSend:true,
      loading2:true
    })
    changeLoginPsdData(machineNo,mobileValue,imgCodeValue)
    .then((data)=>{
      if(data.nameAuthStatus==1) {
        this.setState({
          isShow:true
        })
      }
      this.setState({
        loading2:false
      })
      this.handleClick()
    },(error)=>{
      this.machineNoChange();
      this.setState({
        errorText:error.message,
        visible:true,
        loading2:false
      })
    })
  }
  //提交获取短信验证码
  submitGetPhone() {
    let { isSend } =this.state;
    if(isSend) {
      return false;
    }
    let checkFormRes = this.checkFormSendPhone();
    // 表单校验通过
    if(!checkFormRes.visible){
      this.getPhoneCode();
    }
  }
  // 手机验证码  表单校验
  checkFormSendPhone(){
    let { mobileValue,imgCodeValue } = this.state;
    let errorText,visible=true;
    if(!RegExpUtil.mobile.test(mobileValue)){
      errorText = '请输入正确的手机号码';
    } else if(imgCodeValue.length<6) {
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
  // 注册 表单校验
  checkForm(){
    let {
      mobileValue,
      imgCodeValue,
      phoneCodeValue,
      psdOneValue,
      psdTwoValue,
      identityValue,
      isShow
    } = this.state;
    let errorText,visible=true;
    if(!RegExpUtil.mobile.test(mobileValue)){
      errorText = '请输入正确的手机号码';
    } else if(imgCodeValue.length<6) {
      errorText = '请输入正确的图形验证码';
    } else if(!RegExpUtil.phoneCode.test(phoneCodeValue)) {
      errorText = '请输入正确的手机验证码';
    } else if(isShow&&!RegExpUtil.identity.test(identityValue)) {
      errorText = '请输入正确的身份证号';
    } else if(!RegExpUtil.password.test(psdOneValue)){
      errorText = '密码必须为6-18位数字和字母组合';
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
  //更换密码接口
  goChangePsdApi(mobileNo,mobileCode,newPwd,newPwdTry,idCard) {
    this.setState({
      loading:true,
      disabled:false
    });
    forgetPsdData(mobileNo,mobileCode,newPwd,newPwdTry,idCard)
    .then((data)=>{
      this.setState({
        loading:false,
        disabled:true
      })
      Cookies.clearCookie();
      this.props.history.push('/user/login');
    },(error)=>{
      if(error.data.resultCode==10000017) {
        this.setState({
          isShow:true
        })
      }
      this.setState({
        errorText:error.message,
        visible:true,
        loading:false,
        disabled:true
      })
    })
  }
  //提交
  submit() {
    let { disabled,mobileValue,phoneCodeValue,psdOneValue,psdTwoValue,identityValue } =this.state;
    if(disabled) {
      return false;
    }
    let checkFormRes = this.checkForm();
    // 表单校验通过
    if(!checkFormRes.visible) {
      this.goChangePsdApi(mobileValue,phoneCodeValue,psdOneValue,psdTwoValue,identityValue)
    }
  }
  //我要离开
  goLeave() {
    location.hash='/account/viewall'
  }
  render() {
    const {
      machineNo,
      isSend,
      loading2,
      loading,
      getCodeText,
      isShow,
      visible,
      errorText,
      disabled
    } =this.state;
    return(
      <div className="form-content">
        <div className="row">
          <input
            type="text"
            data-id="0"
            maxLength="11"
            placeholder="请输入手机号"
            onChange={this.changeEvent.bind(this)}/>
        </div>
        <div className="row clear">
          <input
            type="text"
            data-id="1"
            maxLength="6"
            placeholder="请输入验证码"
            onChange={this.changeEvent.bind(this)}
            className="code-input"/>
          <span className="img-code">
            <img src={`/api/user/register/pictureCode/${machineNo}`} onClick={this.machineNoChange.bind(this)}></img>
          </span>
        </div>
        <div className="row clear">
          <input
            type="text"
            data-id="2"
            maxLength="4"
            placeholder="请输入手机验证码"
            className="code-input" onChange={this.changeEvent.bind(this)}/>
          <div className={`phone-code ${isSend?'disabled':''}`}>
            <Button
              type="primary"
              loading={loading2}
              onClick={this.submitGetPhone.bind(this)}>
             {getCodeText}
           </Button>
          </div>
        </div>
        {
          isShow?
            <div className="row">
              <input
                type="text"
                data-id="3"
                placeholder="请输入身份证号"
                onChange={this.changeEvent.bind(this)}/>
            </div>
            :
            ''
        }
        <div className="row">
          <input
            type="password"
            data-id="4"
            placeholder="请输入密码"
            onChange={this.changeEvent.bind(this)}/>
        </div>
        <div className="row">
          <input
            type="password"
            data-id="5"
            placeholder="请重复输入密码"
            onChange={this.changeEvent.bind(this)}/>
        </div>
        <ErrorText visible={visible}>
          {errorText}
        </ErrorText>
        <div className={`submit-btn-row ${disabled?'disabled':''}`}>
          <Button
            type="primary"
            loading={loading}
            onClick={this.submit.bind(this)}>
           确认
         </Button>
        </div>
        <div
          className="go-leave-btn" onClick={()=>this.goLeave()}>
          我要离开
        </div>
      </div>
    )
  }
}

class ChangeLoginPsd extends React.Component {
  render() {
    return(
      <div className="change-loginPsd-page">
        <Head
          title="更改登录密码"
        />
        <div className="deposit-content-wrap clear">
          <div className="part-l">
            <Form {...this.props}/>
          </div>
          <div className="part-r">
            <div className="reminder-infomation">
              <img src={HrBankImg}></img>
              <div className="introduction-hr">
                领投鸟平台上所有资金交易均由<span className="high-col">上海华瑞银行股份有限公司</span>提供第三方资金存管服务；您的资金只存在于您在华瑞银行开通的资金账户中，用户资金与平台进行有效隔离。平台无法触碰用户资金，杜绝资金池。
              </div>
              <div className="friendly-reminder">
                <p className="tips-title">友情提示</p>
                <p>
                  1.我们使用法定接口验证您的身份证信息，如有疑问，请拨打电话：400-999-9980<br/>
                  2.请点击“申请开通”按钮，完成开户操作需要设置支付密码，该密码和登录密码不是同一个密码，请用户注意区分。
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default ChangeLoginPsd;
