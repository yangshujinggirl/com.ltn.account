import React from 'react';
import { Link } from 'react-router-dom';
import { Modal,Button } from 'antd';
import DepositHead from './comments/DepositHead';
import Footer from './comments/Footer';
import { depositPasswordData,personalInfo } from '../../api/DataApi';
// 外部服务
import lodash from 'lodash';
// 本地服务
import Utils from '../../utils';
import user from '../../model/User';
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
    let { psdValue,psdTwoValue }= this.state;
    switch(eleId) {
      case '1':
        psdValue=value;
        break;
      case '11':
        psdTwoValue=value;
        break;
    }
    let disabled = lodash.isEmpty(psdValue)||lodash.isEmpty(psdTwoValue);
    this.setState({
      psdValue,
      psdTwoValue,
      disabled,
      visible:false
    })
  }
  // 表单检查
  checkForm() {
    let { psdValue,psdTwoValue } =this.state;
    let errorText;
    let visible=true;
    if(!RegExpUtil.payPassword.test(psdValue)||!RegExpUtil.payPassword.test(psdTwoValue)) {
      errorText='请输入6位数字密码';
    } else {
      visible=false;
    }
    this.setState({
      errorText,
      visible
    });
    return {
      errorText,
      visible
    }
  }
  //提交api请求
  setPsd() {
    this.setState({
      disabled:false,
      loading:true
    });
    let backUrl;
    let { psdValue,psdTwoValue,search } = this.state;
    //如果老用户绑过卡
    if(user.isBindCard()) {
      backUrl=search.backUrl;
    } else {
      backUrl = search.backUrl?`/user/depostCard?backUrl=${search.backUrl}`:'/user/depostCard';
    }
    depositPasswordData(psdValue,psdTwoValue)
    .then((data)=>{
      this.setState({
        disabled:true,
        loading:false
      });
      //更新用户消息
      personalInfo()
    })
    .then((data)=>{
      // 设置密码成功
      this.props.history.push(backUrl);
    })
    .catch((error)=>{
      if(error.data.resultCode==10005005) {
        this.props.history.push(backUrl);
      } else {
        this.setState({
          errorText:error.message,
          visible:true,
          disabled:true,
          loading:false
        })
      }
    })
  }
  //提交
  submit() {
    let { disabled }=this.state;
    if(disabled) {
      return false;
    }else {
      let checkFormRes = this.checkForm();
      if(!checkFormRes.visible){
        this.setPsd()
      }
    }
  }
  //我要离开
  goLeave() {
    location.hash='/account/viewall';
  }
  render() {
    return(
      <div className="form-content">
        <div className="row label-row-two">
          <input
            type="password"
            data-id="1"
            maxLength="6"
            placeholder="请输入交易密码"
            onChange={this.changeEvent.bind(this)}/>
        </div>
        <div className="row label-row-two">
          <input
            type="password"
            placeholder="请再次确认密码"
            data-id="11"
            maxLength="6"
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
           确定
         </Button>
        </div>
        <div
          className="go-leave-btn"
          onClick={this.goLeave}>我要离开</div>
      </div>
    )
  }
}

class DepositPsdPage extends React.Component {
  componentWillMount() {
    document.title='设置支付密码';
  }
  render() {
    return(
      <div className="deposit-component-page">
        <DepositHead
          levelOne="设置华瑞银行存管账户支付密码"
          levelTwo="为保障您的资金安全，请设置华瑞银行存管账户支付密码！"
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

export default DepositPsdPage;
