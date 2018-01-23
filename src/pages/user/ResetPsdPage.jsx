import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import Head from './comments/Head';
import Footer from './comments/Footer';
import {
  resetSendPhoneData,
  resetTokenData
 } from '../../api/DataApi';
 // 外部服务
 import lodash from 'lodash';
 // 本地服务
 import Utils from '../../utils';
 import user from '../../model/User';
 import Cookies from '../../utils/Cookies';

 import RegExpUtil from '../../api/RegExpUtil';
import ErrorText from '../comments/ErrorText';//错误消息

import './DepositComponent.scss';
import HrBankImg from './imgs/deposit_real_hr.jpg';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      userName:user.userInfo.userName,//用户名
      identityValue:'',//身份证
      phoneCodeValue:'',//手机验证码
      disabled:true,
      count: 60,
      isSend:true,
      getCodeText:'获取验证码',
      errorText:'',
      visible:false,
      loading:false,
      loading2:false,
      search:Utils.searchFormat(this.props.location.search)
    }
  }
  //表单改变事件
  changeEvent(event) {
    let eleId = event.target.getAttribute('data-id');
    let value = lodash.trim(event.target.value);
    let { identityValue,phoneCodeValue,count } =this.state;
    switch(eleId) {
      case '1':
        identityValue = value;
        break;
      case '2':
        phoneCodeValue = value;
        break;
    }
    let disabled = lodash.isEmpty(identityValue)||lodash.isEmpty(phoneCodeValue);
    let isSend = lodash.isEmpty(identityValue)||count<60;
    this.setState({
      identityValue,
      phoneCodeValue,
      disabled,
      isSend,
      visible:false
    })
  }
  //校验手机验证码
  checkPhoneCode() {
    let value = this.state.phoneCodeValue;
    if(!RegExpUtil.phoneCode.test(value)) {
      this.setState({
        errorText:'请输入正确的手机验证码',
        visible:true
      })
      return false
    } else {
      return true;
    }
  }
  //校验身份证号
  checkIdentity() {
    const value = this.state.identityValue;
    if(!RegExpUtil.identity.test(value)) {
      this.setState({
        errorText:'请输入正确的身份证号',
        visible:true
      })
      return false
    } else {
      return true;
    }
  }

  //倒计时
  handleClick() {
    const timer = setInterval(()=> {
        let count = this.state.count;
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
    let { isSend,identityValue } =this.state;
    if(!isSend&&this.checkIdentity()) {
      this.setState({
        isSend:true,
        loading2:true
      })
      resetSendPhoneData(identityValue)
      .then((data)=>{
        this.setState({
          loading2:false
        })
        this.handleClick()
      },(error)=>{
        this.setState({
          errorText:error.message,
          visible:true,
          isSend:true,
          loading2:false
        })
      })
    }
  }
  //token
  getToken() {
    let { identityValue,phoneCodeValue,search } =this.state;
    this.setState({
      loading:true,
      disabled:true
    })
    resetTokenData(identityValue,phoneCodeValue)
    .then((data)=>{
      this.setState({
        loading:false
      })
      let parmas = `token=${data.token}&&identityValue=${identityValue}&&phoneCodeValue=${phoneCodeValue}`;
      let backUrl = search.backUrl?`/user/resetConfirmPsd?backUrl=${search.backUrl}&&${parmas}`:`/user/resetConfirmPsd?${parmas}`;
      this.props.history.push(backUrl);
    },(error)=>{
      this.setState({
        errorText:error.message,
        loading:false,
        visible:true
      })
    })
  }
  //提交
  submit() {
    if(!this.state.disabled&&this.checkIdentity()&&this.checkPhoneCode()) {
      this.getToken()
    }
  }
  //我要离开
  goLeave() {
    location.hash='/account/viewall';
  }
  render() {
    const {
      userName,
      isSend,
      loading2,
      getCodeText,
      visible,
      errorText,
      disabled,
      loading
    } =this.state;
    return(
      <div className="form-content">
        <div className="row">
          <input
            type="text"
            readOnly='readOnly'
            defaultValue={userName}/>
        </div>
        <div className="row">
          <input
            type="text"
            data-id="1"
            placeholder="请输入身份证号"
            onChange={this.changeEvent.bind(this)}/>
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
              onClick={this.getPhoneCode.bind(this)}>
             {getCodeText}
           </Button>
          </div>
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

class DepositResetPsdPage extends React.Component {
  componentWillMount() {
    document.title='重置密码';
  }
  render() {
    return(
      <div className="deposit-component-page">
        <Head title="重置交易密码"/>
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
                  支付密码为6位数字密码，用于您在本平台下的绑卡，充值，转账，提现等交易操作及确认，以保证您账户的资金安全。
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

export default DepositResetPsdPage;
