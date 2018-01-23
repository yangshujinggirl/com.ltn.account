import React from 'react';
import { Link } from 'react-router-dom';
import { Select,Modal,Button } from 'antd';

import {
  depositCardListData,
  depositSendCodeData,
  depositChangeCardData,
  getZtCapitalData
} from '../../api/DataApi';
 // 外部服务
 import lodash from 'lodash';
 // 本地服务
 import Utils from '../../utils';
import RegExpUtil from '../../api/RegExpUtil';
import ErrorText from '../comments/ErrorText';//错误消息
import DepositHead from './comments/DepositHead';
import Footer from './comments/Footer';
import ModalCard from './comments/ModalCard';
import './DepositComponent.scss';
import HrBankImg from './imgs/deposit_real_hr.jpg';

const Option = Select.Option;


class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      isFlag:0,//在投资金
      cardValue:'',//银行卡号1
      mobileValue:'',//手机号
      phoneCodeValue:'',//手机验证码
      bankList:[],//银行卡列表
      errorText:'',
      visible:false,
      gateId:'',//银行卡id
      selectedBank:'',//选 中卡名
      isSend:true,
      count:60,
      disabled:true,//按钮是否可点
      getCodeText:'获取验证码',
      loading:false,
      loading2:false,
      search:Utils.searchFormat(this.props.location.search),
      showModal:false
    }
  }
  componentWillMount() {
    document.title='更换银行卡';
    this.getBankList();
    this.getAccountAmount();
  }
  //是否有在再资金
  getAccountAmount() {
     getZtCapitalData()
     .then((data)=>{
       this.setState({
         isFlag:data.accoutAmountFlag
       })
     })
     .catch((error)=>{

     })
  }
  //表单change事件
  changeEvent(event) {
    let eleId = event.target.getAttribute('data-id');
    let value = lodash.trim(event.target.value);
    let { selectedBank,cardValue,mobileValue,phoneCodeValue,count } =this.state;
    switch(eleId) {
      case '1':
        cardValue=value;
        break;
      case '2':
        mobileValue=value;
        break;
      case '3':
        phoneCodeValue=value;
        break;
    }
    let disabled = lodash.isEmpty(selectedBank)||lodash.isEmpty(cardValue)||lodash.isEmpty(mobileValue)||lodash.isEmpty(phoneCodeValue);
    let isSend = lodash.isEmpty(mobileValue)||count<60;
    this.setState({
      cardValue,
      mobileValue,
      phoneCodeValue,
      disabled,
      isSend,
      visible:false
    })
  }
  //表单校验
  checkForm() {
    let { cardValue,mobileValue,phoneCodeValue } =this.state;
    let errorText,visible=true;
    if(!RegExpUtil.bankCard.test(cardValue)) {
      errorText = '请输入正确的银行卡号';
    } else if(!RegExpUtil.mobile.test(mobileValue)) {
      errorText = '请输入正确的手机号';
    } else if(!RegExpUtil.phoneCode.test(phoneCodeValue)){
      errorText = '请输入正确的手机验证码';
    } else {
      errorText='',
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
  //获取银行卡列表
  getBankList() {
    depositCardListData()
    .then((data)=>{
      this.setState({
        bankList:data.bankInfoList
      })
    },(error)=>{
      this.setState({
        errorText:error.message,
        visible:true
      })
    })
  }
  //银行卡选择 handleChange
  handleChange(value) {
    let { cardValue,phoneCodeValue,mobileValue } =this.state;
    this.setState({
      selectedBank:value.label,
      gateId:value.key,
      disabled:lodash.isEmpty(value.label)||lodash.isEmpty(cardValue)||lodash.isEmpty(phoneCodeValue)||lodash.isEmpty(mobileValue)
    })
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
    const { isSend,mobileValue } =this.state;
    if(!isSend) {
      this.setState({
        isSend:true,
        loading2:true
      })
      depositSendCodeData('4',mobileValue)
      .then((data)=>{
        this.setState({
          loading2:false
        })
        this.handleClick()
      })
      .catch((error)=>{
        this.setState({
          errorText:error.message,
          visible:true,
          loading2:false
        })
      })
    }
  }
  //去换卡
  changeCard() {
    let { isFlag,selectedBank,cardValue,gateId,phoneCodeValue,mobileValue,search } =this.state;
    this.setState({
      disabled:true,
      loading:true
    })
    depositChangeCardData(isFlag,selectedBank,cardValue,gateId,phoneCodeValue,mobileValue)
    .then((data)=>{
      this.setState({
        loading:false
      });
      if(this.state.isFlag==1) {
        this.setState({
          showModal:true
        })
      } else {
        Modal.success({
          title: '温馨提示',
          content: '您已换卡成功',
          onOk:()=> {
            this.props.history.push(search.backUrl);
          }
        })
      }
    })
    .catch((error)=>{
      this.setState({
        loading:false,
        errorText:error.message,
        visible:true
      });
    })
  }
  //提交
  submit() {
    if(this.state.disabled) {
      return false
    }
    let checkFormRes = this.checkForm();
    // 表单校验通过
    if(!checkFormRes.visible){
      this.changeCard()
    }
  }
  //我要离开
  goLeave() {
    location.hash='/account/viewall';
  }
  render() {
    const {
      bankList,
      isSend,
      loading2,
      getCodeText,
      visible,
      errorText,
      disabled,
      loading,
      search
     } =this.state;
    return(
      <div>
        <div className="form-content">
          <div className="row">
            <Select labelInValue defaultValue={{ key: '请选择开户行' }} onChange={this.handleChange.bind(this)}>
              {
                bankList.map((el,index)=>(
                  <Option value={el.gateId} key={index}>{el.bankName}</Option>
                ))
              }
            </Select>
          </div>
          <div className="row">
            <input
              type="text"
              data-id="1"
              placeholder="请输入本人名下的银行卡号"
              onChange={this.changeEvent.bind(this)}/>
          </div>
          <div className="row">
            <input
              type="text"
              data-id="2"
              maxLength="11"
              placeholder="请输入银行预留手机号"
              onChange={this.changeEvent.bind(this)}/>
          </div>
          <div className="row clear">
            <input
              type="text"
              data-id="3"
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
             确认换卡
           </Button>
          </div>
          <div
            className="go-leave-btn" onClick={()=>this.goLeave()}>
            我要离开
          </div>
        </div>
        <ModalCard
          {...this.props}
          visible={this.state.showModal}
          backUrl={search.backUrl} />
      </div>
    )
  }
}

class ChangeCardPage extends React.Component {
  render() {
    return(
      <div className="deposit-component-page">
        <DepositHead
          levelOne="更换银行卡"
          levelTwo="请更换银行卡"
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

export default ChangeCardPage;
