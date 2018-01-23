import React from 'react';
import { Link } from 'react-router-dom';
import { Button,Modal } from 'antd';
import Head from './comments/Head';
import Footer from './comments/Footer';
import {
  savePasswordData,
  personalInfo
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

const confirm = Modal.confirm;

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      disabled:true,
      identityValue:Utils.searchFormat(this.props.location.search).identityValue,//身份证
      phoneCodeValue:Utils.searchFormat(this.props.location.search).phoneCodeValue,//手机验证码
      token:Utils.searchFormat(this.props.location.search).token,//token
      errorText:'',
      visible:false,
      psdValue:'',
      psdTwoValue:'',
      loading:false,
      search:Utils.searchFormat(this.props.location.search)
    }
  }
  //表单改变事件
  changeEvent(event) {
    let eleId = event.target.getAttribute('data-id');
    let value = lodash.trim(event.target.value);
    let { psdValue,psdTwoValue } =this.state;
    if(eleId==1) {
      psdValue=value;
    } else {
      psdTwoValue =value;
    }
    let disabled=lodash.isEmpty(psdValue)||lodash.isEmpty(psdTwoValue);
    this.setState({
      psdValue,
      psdTwoValue,
      disabled,
      visible:false
    })
  }
  //校验表单
  checkForm() {
    let { psdValue,psdTwoValue } = this.state;
    let errorText,visible=true;
    if(!RegExpUtil.payPassword.test(psdValue)) {
      errorText='请输入6位数字密码'
    } else if(!RegExpUtil.payPassword.test(psdTwoValue)) {
      errorText='请输入6位数字密码'
    } else {
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
  //重置交易密码
  setPsd() {
    let { identityValue,phoneCodeValue,psdValue,psdTwoValue,token,search } = this.state;
    this.setState({
      loading:true,
      disabled:true
    })
    savePasswordData(identityValue,phoneCodeValue,psdValue,psdTwoValue,token)
    .then((data)=>{
      this.setState({
        loading:false,
        disabled:false
      })
      //更新用户消息
      personalInfo()
    })
    .then((data)=>{
      this.props.history.push(search.backUrl);
    })
    .catch((error)=>{
      if(error.data.resultCode=='10005003') {
        this.setState({
          errorText:error.data.resultMessage,
          visible:true
        })
      } else {
        confirm({
          title: 'Do you Want to delete these items?',
          content: error.message+'请重新填写信息',
          onOk:()=> {
            let backUrl = search.backUrl?`/user/resetPsd?backUrl=${search.backUrl}`:'/user/resetPsd';
            this.props.history.push(backUrl);
          }
        });
      }
      this.setState({
        loading:false
      })
    })
  }
  //提交
  submit() {
    if(this.state.disabled) {
      return false;
    }
    let checkFormRes = this.checkForm();
    // 表单校验通过
    if(!checkFormRes.visible){
      this.setPsd();
    }
  }
  //我要离开
  goLeave() {
    location.hash='/account/viewall';
  }
  render() {
    return(
      <div className="form-content">
        <div className="row">
          <input
            type="password"
            data-id="1"
            maxLength="6"
            placeholder="请输入支付密码"
            onChange={this.changeEvent.bind(this)}/>
        </div>
        <div className="row">
          <input
            type="password"
            maxLength="6"
            placeholder="请再次确认密码"
            data-id="11"
            onChange={this.changeEvent.bind(this)}/>
        </div>
        <ErrorText visible={this.state.visible}>
          {this.state.errorText}
        </ErrorText>
        <div className={`submit-btn-row ${this.state.disabled?'disabled':''}`}>
          <Button
            type="primary"
            loading={this.state.loading}
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
