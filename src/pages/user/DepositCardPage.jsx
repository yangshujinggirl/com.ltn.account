import React from 'react';
import { Link } from 'react-router-dom';
import { Select,Button,Modal,Checkbox } from 'antd';

import { depositCardListData } from '../../api/DataApi';
// 外部服务
import lodash from 'lodash';
// 本地服务
import Utils from '../../utils';
import user from '../../model/User';
import Cookies from '../../utils/Cookies';
import JSCookies from 'js-cookie';
import LimitsModal from './comments/LimitsModal';//银行限额表
import RegExpUtil from '../../api/RegExpUtil';
import ErrorText from '../comments/ErrorText';//错误消息
import DepositHead from './comments/DepositHead';
import Footer from './comments/Footer';

import './DepositComponent.scss';
import HrBankImg from './imgs/deposit_real_hr.jpg';


const Option = Select.Option;

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      cardValue:'',//银行卡号8
      bankList:[],//银行卡列表
      errorText:'',//错误信息
      visible:false,
      gateId:'',//银行卡id
      selectedBank:'',//选 中卡名
      disabled:true,//按钮是否可点
      loading:false,
      isChecked:true,
      search:Utils.searchFormat(this.props.location.search)
    }
  }
  componentWillMount() {
    this.getBankList()
  }
  //checkbox
  checkProtocol(e) {
    let {
      cardValue,
      selectedBank
    } = this.state;
    let isChecked= e.target.checked;
    let disabled = lodash.isEmpty(cardValue)||lodash.isEmpty(selectedBank)||!isChecked;
    this.setState({
      cardValue,
      selectedBank,
      isChecked,
      disabled
    })
  }
  //表单change事件
  changeEvent(event) {
    let value = lodash.trim(event.target.value);
    this.setState({
      cardValue:value,
      disabled:lodash.isEmpty(value)||lodash.isEmpty(this.state.selectedBank),
      visible:false
    })
  }
  //卡号校验
  checkCard() {
    let value = this.state.cardValue;
    if(!RegExpUtil.bankCard.test(value)) {
      this.setState({
        errorText:'请输入正确的银行卡号',
        visible:true,
        disabled:true
      })
      return false;
    }else {
      return true;
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

    })
  }
  //handleChange
  handleChange(value) {
    this.setState({
      selectedBank:value.label,
      gateId:value.key,
      disabled:lodash.isEmpty(value.label)||lodash.isEmpty(this.state.cardValue)
    })
  }
  //提交
  submit() {
    let {
      selectedBank,
      gateId,
      cardValue,
      search,
      disabled
    } = this.state;
    if(!disabled&&this.checkCard()) {
      //参数带到下一个页面
      let parmas = `bankName=${selectedBank}&&gateId=${gateId}&&cardValue=${cardValue}`;
      let backUrl = search.backUrl?`/user/depositVerify?backUrl=${search.backUrl}&&${parmas}`:`/user/depositVerify?${parmas}`;
      this.props.history.push(backUrl);
    }
  }
  //我要离开
  goLeave() {
    location.hash='/account/viewall';
  }

  render() {
    const { bankList,isChecked,visible,errorText,disabled,loading } =this.state;
    return(
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
            maxLength="19"
            placeholder="请输入本人名下的银行卡号"
            onChange={this.changeEvent.bind(this)}/>
        </div>
        <ErrorText visible={visible}>
          {errorText}
        </ErrorText>
        <div className="agree-protocol-conten">
          <Checkbox
            checked={isChecked}
            onChange={(e) => this.checkProtocol(e)}>
            同意领投鸟
          </Checkbox>
          <p className="protocols">
            <Link to="">《免密码授权服务协议》</Link>
          </p>
        </div>
        <div className={`submit-btn-row ${disabled?'disabled':''}`}>
          <Button
            type="primary"
            loading={loading}
            onClick={this.submit.bind(this)}>
           确认绑卡
         </Button>
        </div>
        <div
          className="go-leave-btn" onClick={()=>this.goLeave()}>
          暂不绑卡
        </div>
      </div>
    )
  }
}

class DepositCardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      visible:false
    }
  }
  componentWillMount() {
    document.title='绑卡';
  }
  handleOk() {
    this.setState({
      visible:true
    })
  }
  handleCancel() {
    this.setState({
      visible:false
    })
  }
  render() {
    return(
      <div className="deposit-component-page">
        <DepositHead
          levelOne="绑定银行卡"
          levelTwo="开户成功，完成绑卡操作即可参与投资！"
        />
        <div className="deposit-content-wrap clear">
          <div className="part-l">
            <Form {...this.props}/>
          </div>
          <div className="part-r">
            <div className="reminder-infomation">
              <div className="friendly-reminder">
                <p className="tips-title">友情提示：</p>
                <p>
                  1.仅支持储蓄卡(借记卡)，不支持信用卡(借贷卡)；<br/>
                  2.该银行卡可用于网站及手机APP充值与提现 ，目前可支持银行均在右侧下拉列表中有显示，推荐绑定中国工商银行、中国农业银行、中国建设银行、中国银行、浦东发展银行、中国交通银行以上银行在快捷充值时均有限额。
                  <span className="blue-col" onClick={this.handleOk.bind(this)}>查看快捷充值限额表>></span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <LimitsModal
          visible={this.state.visible} handleCancel={this.handleCancel.bind(this)}/>
        <Footer />
      </div>
    )
  }
}

export default DepositCardPage;
