import React from 'react';
import { Modal,Button } from 'antd';
import logoImg from './imgs/modal_logo.png';
import './Modal.scss';

class ModalDepost extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      visible:props.visible,
      status:props.status,//实名，设置支会密码：1；绑卡：2
      goUrl:props.goUrl
    }
  }
  componentWillReceiveProps(props) {
    this.setState({
      visible:props.visible,
      status:props.status,
      goUrl:props.goUrl
    })
  }
  handleOk() {
    location.hash = this.state.goUrl;
  }
  handleCancel() {
    this.setState({
      visible:false
    })
  }
  render() {
    const { visible,status} =this.state;
    const { closable } =this.props;
    return (
      <div>
          <Modal
            visible={visible}
            wrapClassName="depost-antd-modal"
            title=""
            onOk={()=>this.handleOk()}
            onCancel={()=>this.handleCancel()}
            closable={closable?false:true}
            footer={[
              <div className="sure-btn-wrap">
                <button
                  className="depost-sure-btn"
                  onClick={()=>this.handleOk()}>
                  {
                    status=='1'?'激活／开通存管账户'
                    :
                    '去绑卡'
                  }
                </button>
              </div>,
            ]}
          >
            <div className="depost-modal-content">
              <img src={logoImg}></img>
              <p className="bottom-line">为积极响应国家政策</p>
              <p className="tips-content">
                {
                  status=='1'?
                  '为保证您的资金安全，请尽快激活或者开通华瑞银行资金存管账户'
                  :
                  '您当前还未绑卡，请去绑定银行卡!'
                }
              </p>
            </div>
          </Modal>
    </div>
    )
  }
}

export default ModalDepost;
