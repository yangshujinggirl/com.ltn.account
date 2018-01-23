import React from 'react';
import { Button,Modal } from 'antd';

import TopModule from '../../common/components/TopModule';//引入公共头部
import FooterModule from '../../common/components/FooterModule';//引入公共头部

import codeImg from '../user/imgs/card_modal_code.png';
import './InCardProcess.scss';

const stepList =[
  {
    num:'01',
    info:'线上申请快速换卡'
  },
  {
    num:'02',
    info:'人工审核换卡'
  },
  {
    num:'03',
    info:'查看换卡审核结果'
  }
]
const StepOneContent =()=>(
  <div className="step-one-content">
    <div className="row">
      <p className="label">登录领投鸟网站</p>
      <p className="st-in">进入“我的账户-账户设置-银行卡管理”申请更换银行卡</p>
    </div>
    <div className="row">
      <p className="label">登录领投鸟网站</p>
      <p className="st-in">进入“我的账户-设置-我的银行卡”申请更换银行卡</p>
    </div>
    <div className="attention-tips">
      注意：申请前请保证该卡在平台无剩余资金、无投资中标的，且提现资金已到账银行卡；方可自助换卡
    </div>
  </div>
)
const StepTwoContent =()=>(
  <div className="step-two-content">
    <div className="row">
      <p className="label">原银行卡和新卡皆在：</p>
      <p className="st-in">
        请您提供如下六张照片发送至service@lingtouniao.com，以便领投鸟客服人工审核：<br/>
        1) 您手持身份证照片正反面，显示本人脸和手臂，图片应能看清身份证号、人像；<br/>
        2) 您手持原卡、新卡正反面照片，显示本人脸和手臂，图片应能看清银行卡卡号；<br/>
      </p>
      <p className="attention-tips">注意：新卡需为平台当前支持的储蓄卡类型。</p>
    </div>
    <div className="row">
      <p className="label">若原绑定银行卡已丢失，需再提供：</p>
      <p className="st-in">
        1) 出示原卡挂失证明；<br/>
        2) 原卡的开户证明或银行开具的一个月内交易流水并加盖银行公章；<br/>
        3) 新卡开户单子或新卡与身份证关联关系证明（银行出具）；
      </p>
      <p className="attention-tips">
        提醒：若您丢失原卡开户证明或原卡已销毁等相关资料，请用户提供换卡证明，且证明上需印有银行柜台鲜章以便审核。
      </p>
    </div>
  </div>
)
const StepThrContent =()=>(
  <div className="step-thr-content">
    <div className="row">
      <p className="label">原银行卡和新卡皆在：</p>
      <p className="st-in">
        自提交资料后2-3个工作日后，登录领投鸟站进入“我的账户-银行卡管理”或登录领投鸟APP“我的账户-设置-我的银行卡”查看换卡审核结果。您在办理换卡过程中，如有疑问请直接拨打领投鸟客服热线400-999-9980咨询。
      </p>
    </div>
    <div className="code-wrap">
      <img src={codeImg}></img>
      <p>如有更多疑问，欢迎关注领投鸟微信公众平台</p>
    </div>
  </div>
)
class InCardProcess extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      key:0
    }
  }
  onMouseEnter(e) {
    let key = e.target.getAttribute('data-key');
    this.setState({
      key
    })
  }
  render() {
    let { key }=this.state;
    let classStyle = `step-item ${key}`;
    let Mod;
    if(key==0) {
      Mod=StepOneContent;
    } else if(key==1) {
      Mod=StepTwoContent;
    } else {
      Mod=StepThrContent;
    }
    return(
      <div>
        <TopModule />
        <div className="incard-process-pages">
          <div className="incard-wrap ltn-content">
            <div className="top-content">
              <p className="top-title">更换银行卡流程</p>
              <p className="info-con">
                为了充分保障您的快捷银行卡账户安全，我们将通过线上快速申请与<br/>
                线下人工审核相结合的方式为您更换快捷银行。
              </p>
            </div>
            <div className="main-process">
              <div className="part-l">
                <div className="step-list">
                  {
                    stepList.map((ele,index)=>(
                      <div
                        className={`step-item ${this.state.key==index?'selected':''}`}
                        data-key={index}
                        onMouseEnter={(e)=>this.onMouseEnter(e)}>
                          <p className="num" data-key={index}>{ele.num}</p>
                          {ele.info}
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className="part-r">
                <Mod/>
              </div>
            </div>
          </div>
        </div>
        <FooterModule />
      </div>
    )
  }
}

export default InCardProcess;
