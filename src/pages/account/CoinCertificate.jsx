import React from 'react';
import { Button,Modal } from 'antd';
import lodash from 'lodash';
import { exchargeTickitData } from '../../api/DataApi';

// 本地服务
import Utils from '../../utils';
import TopModule from '../../common/components/TopModule';//引入公共头部
import FooterModule from '../../common/components/FooterModule';//引入公共头部
const confirm = Modal.confirm;
import './CoinCertificate.scss';

class CoinCertificate extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      machineNo:'',//动态机器码
      loading:false,
      tickitValue:'',
      imgCodeValue:'',//图形验证码2
      errorText:'',
      disabled:true,
      search:Utils.searchFormat(this.props.location.search)
    }
  }
  componentWillMount() {
    this.machineNoChange();
  }
  // 生成机械码
  machineNoChange() {
    const temporaryMachineNo = Date.now();
    this.setState({
      machineNo: temporaryMachineNo
    });
  }
  //表单改变事件
  changeEvent(event) {
    let eleId = event.target.getAttribute('data-id');
    let value = lodash.trim(event.target.value);
    let { tickitValue,imgCodeValue } =this.state;
    switch(eleId) {
      case '0':
        tickitValue=value;
        break;
      case '1':
        imgCodeValue = value;
        break;
    }
    let disabled=lodash.isEmpty(tickitValue)||lodash.isEmpty(imgCodeValue)
    this.setState({
      tickitValue,
      imgCodeValue,
      disabled,
      errorText:''
    })
  }
  //校验图形验证码
  checkImgCode() {
    const value = this.state.imgCodeValue;
    if(value.length<6) {
      this.setState({
        errorText:'请输入正确的图形验证码'
      })
      return false
    } else {
      return true;
    }
  }
  //兑换
  goExcharge() {
    let {tickitValue,machineNo,imgCodeValue,search} =this.state;
    this.setState({
      loading:true,
      disabled:true
    })
    exchargeTickitData(
      tickitValue,
      machineNo,
      imgCodeValue
    )
    .then((data)=>{
      Modal.success({
        title: '温馨提示',
        content: '恭喜您兑换成功，快去查看吧',
        onOk:()=> {
          this.props.history.push(search.backUrl);
        }
      });
    },(error)=>{
      this.setState({
        errorText:error.message,
        loading:false,
        disabled:true
      })
    })
  }
  //提交
  submit() {
    if(!this.state.disabled&&this.checkImgCode()) {
      this.goExcharge()
    }
  }
  goReturn() {
    location.hash=this.state.search.backUrl;
  }
  render() {
    const { machineNo,errorText,disabled,loading } =this.state;
    return(
      <div>
        <TopModule />
        <div className="coin-certificate-pages ltn-content">
          <div className="wrap">
            <div className="part-one">
              <div className="secrity">理财金券兑换</div>
              <div className="form-content">
                <div className="row">
                  <input
                    type="text"
                    data-id="0"
                    onChange={this.changeEvent.bind(this)}
                    placeholder="请输入兑换码"/>
                </div>
                <div className="row">
                  <input
                    type="text"
                    placeholder="请输入图形验证码"
                    maxLength="6"
                    data-id="1"
                    onChange={this.changeEvent.bind(this)}
                    className="code-input" />
                  <span className="img-code">
                    <img
                      src={`/api/user/register/pictureCode/${machineNo}`} onClick={this.machineNoChange.bind(this)} />
                  </span>
                </div>
                <div className="error-tips">{errorText}</div>
                <div className={`submit-btn-row ${disabled?'disabled':''}`}>
                  <Button
                    type="primary"
                    loading={loading}
                    onClick={()=>this.submit()}>
                   立即兑换
                 </Button>
                </div>
                <div className="go-return" onClick={()=>this.goReturn()}>
                  立即返回
                </div>
              </div>
            </div>
            <div className="info">
              <p className="hd">兑换说明</p>
              <div className="list">
                <p className="tip">1.输入兑换码，点击兑换后，您将获得相应的投资返现券或投资加息券。</p>
                <p className="tip">
                  2.兑换以后，您可以在“账户中心”页下的“返现券”或者“加息券”中分别查看您所领到的投资返现券或投资加息券。
                </p>
                <p className="tip">
                  3.领投鸟将不定期举办活动向用户发放兑换码，凭兑换码即可兑换相应的投资返现券或投资加息券。
                </p><p className="tip">
                  4.如果您兑换的是投资返现券，需要您单笔投资满足使用条件时才能使用此券，勾选并投资完毕(不含新手特权标)
                ，标的到期后，返现金额会随着本息一同发放至您的账户，您可自行选择再投资或提现。
                </p>
                <p className="tip">
                  5.如果您兑换的是投资加息券，需要您在投资时勾选并使用，此时您购买的标的产品将会有相应的加息，勾选并投资完毕(不含新手特权标)，标的到期后，加息部分的金额会和您的投资本息一同发放至您的账户，您可自行选择再投或提现。
                </p>
              </div>
            </div>
            <div className="copy" id="copy">
              <div className="tips">
                <span className="line">提示</span>
              </div>
              <div className="content1">
                <p className="success">恭喜您！兑换成功！</p>
                <p className="value">您兑换的是<span className="couponName"></span>！<a href="javascript:void(0)" className="look" id="look">快去查看吧！</a></p>
              </div>
              <button className="copyBtn" id="copyBtn">确认</button>
              <div className="close" id="closeBtn"></div>
            </div>
          </div>
        </div>
        <FooterModule />
      </div>
    )
  }
}

export default CoinCertificate;
