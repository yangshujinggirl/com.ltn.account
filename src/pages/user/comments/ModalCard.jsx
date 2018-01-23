import React from 'react';
import { Modal,Carousel } from 'antd';

import tickImg from '../imgs/tick_icon.png';
import codeImg from '../imgs/card_modal_code.png';
import './ModalCard.scss';

class ModalCard extends React.Component{
  handleCancel() {
    this.props.history.push(this.props.backUrl);
  }
  render() {
    const { visible,backUrl } =this.props;
    return (
      <Modal
        visible={visible}
        title=""
        wrapClassName="change-card-modal-wrap"
        onCancel={()=>this.handleCancel()}
        footer={[]}
      >
        <div className="change-card-modal-content">
          <div className="top-content">
            <img src={tickImg}></img>
            <p className="top-head">换卡申请提交成功</p>
            <p>
              为保障您的资金安全，请提供相关资料发送至邮箱service@lingotuniao.com
              等待人工审核，审核结果将会短信通知到您！
            </p>
          </div>
          <div className="swiper-wp">
            <Carousel autoplay>
              <div className="sw-item clear">
                <div className="part-l">
                  <p className="title">原银行卡和新卡皆在：</p>
                  <div className="info-text">
                    1) 您手持身份证照片正反面，显示本人脸和手臂，图片应能看清身份证号、人像；<br/>
                    2) 您手持原卡、新卡正反面照片，显示本人脸和手臂，图片应能看清银行卡卡号；
                  </div>
                </div>
                <div className="part-r">
                  <img src={codeImg} className="shade-img"></img>
                  <p>领投鸟微信公众平台</p>
                </div>
              </div>
              <div className="sw-item clear">
                <div className="part-l">
                  <p className="title">若原绑定银行卡已丢失，需再提供：</p>
                  <div className="info-text">
                    1) 出示原卡挂失证明；<br/>
                    2) 原卡的开户证明或银行开具的一个月内交易流水并加盖银行公章；<br/>
                    3) 新卡开户单子或新卡与身份证关联关系证明（银行出具）；<br/>
                  </div>
                </div>
                <div className="part-r">
                  <img src={codeImg} className="shade-img"></img>
                  <p>领投鸟微信公众平台</p>
                </div>
              </div>
            </Carousel>
          </div>
        </div>
    </Modal>
    )
  }
}

export default ModalCard;
