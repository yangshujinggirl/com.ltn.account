import React from 'react';
import { Modal,Button,Checkbox } from 'antd';
import { Link } from 'react-router-dom';
import { depositRealData,personalInfo } from '../../api/DataApi';

// 外部服务
import lodash from 'lodash';
// 本地服务
import Utils from '../../utils';
import RegExpUtil from '../../api/RegExpUtil';
import ErrorText from '../comments/ErrorText';//错误消息
import DepositHead from './comments/DepositHead';
import Footer from './comments/Footer';

import './DepositComponent.scss';
import HrBankImg from './imgs/deposit_real_hr.jpg';


class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userNameValue:'',//用户名
      identityValue:'',//身份证
      errorText:'',//错误信息
      visible:false,//错误信息
      disabled:true,//按钮点击状态
      isAgree:true,//checkbox
      loading:false,
      isChecked:true,
      search:Utils.searchFormat(this.props.location.search)
    }
  }
  //checkbox
  checkProtocol(e) {
    let {
      identityValue,
      userNameValue
    } = this.state;
    let isChecked= e.target.checked;
    let disabled = lodash.isEmpty(identityValue)||lodash.isEmpty(userNameValue)||!isChecked;
    this.setState({
      identityValue,
      userNameValue,
      isChecked,
      disabled
    })
  }
  //表单改变事件
  changeEvent(event) {
    let eleId = event.target.getAttribute('data-id');
    let value = lodash.trim(event.target.value);
    let {
      identityValue,
      userNameValue,
      isChecked
    } = this.state;
    if(eleId==6) {//身份证
      identityValue=value
    } else if(eleId==5) {//用户名
      userNameValue=value
    }
    let disabled = lodash.isEmpty(identityValue)||lodash.isEmpty(userNameValue)||!isChecked;
    this.setState({
      identityValue,
      userNameValue,
      isChecked,
      disabled,
      visible:false
    })
  }
  //开通接口
  goRealName() {
    let {
      disabled,
      identityValue,
      userNameValue,
      loading,
      search
    } = this.state;
    disabled = true;
    loading = true;
    this.setState({
      disabled:true,
      loading:true
    })
    // url
    let backUrl = search.backUrl?`/user/depostPsd?backUrl=${search.backUrl}`:'/user/depostPsd';
    depositRealData(identityValue,userNameValue)
    .then(data=>{
      //更新用户消息
      // personalInfo()
    })
    .then((data)=>{
      this.props.history.push(backUrl);
    })
    .catch(err=>{
      if(err.data.resultCode==10000018) {
        personalInfo();
        this.props.history.push(backUrl);
      }
      this.setState({
        errorText:err.message,
        visible:true,
        loading:false
      })
    })
  }

  // 表单检查
  checkForm(){
    let {
      userNameValue,
      identityValue,
      isChecked
    }=this.state;
    let errorText,visible=true;
    //校验用户名中文
    if(!RegExpUtil.userName.test(userNameValue)){
      errorText='请输入正确的中文用户名'
    }else if(!RegExpUtil.identity.test(identityValue)){
      errorText='请输入正确的身份证号'
    }else if(!isChecked){
      errorText='请输先勾选协议'
    }else{
      visible = false;
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
  //提交
  submit() {
    let {disabled}=this.state;
    if(disabled){
      return false;
    }
    let checkFormRes = this.checkForm();
    if(!checkFormRes.visible){
      this.goRealName()
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
            type="text"
            data-id="5"
            maxLength="25"
            placeholder="请输入真实姓名"
            onChange={this.changeEvent.bind(this)}/>
        </div>
        <div className="row">
          <input
            type="text"
            data-id="6"
            placeholder="请输入身份证号"
            onChange={this.changeEvent.bind(this)}/>
        </div>
        <ErrorText visible={this.state.visible}>
          {this.state.errorText}
        </ErrorText>
        <div className="agree-protocol-conten">
          <Checkbox
            checked={this.state.isChecked}
            onChange={(e) => this.checkProtocol(e)}>
            同意领投鸟
          </Checkbox>
          <p className="protocols">
            <Link to="">《银行存管协议》</Link>
            、
            <Link to="">《个人用户授权协议》</Link>
          </p>
        </div>
        <div className={`submit-btn-row ${this.state.disabled?'disabled':''}`}>
          <Button
            type="primary"
            loading={this.state.loading}
            onClick={this.submit.bind(this)}>
           申请开通
         </Button>
        </div>
        <div className="go-leave-btn" onClick={()=>this.goLeave()}>我要离开</div>
      </div>
    )
  }
}

class DepositRealPage extends React.Component {
  componentWillMount() {
    document.title='开户';
  }
  render() {
    return(
      <div className="deposit-component-page">
        <DepositHead
          levelOne="开通华瑞银行存管账户"
          levelTwo="为保障您的资金安全，请先完成华瑞银行账户开通及业务授权！"
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

export default DepositRealPage;
