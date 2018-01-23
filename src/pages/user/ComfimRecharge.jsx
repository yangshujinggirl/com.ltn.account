import React from 'react';
import { Modal, Icon,Button } from 'antd';
import { Link } from 'react-router-dom';
// 外部服务
import lodash from 'lodash';
import user from '../../model/User';
import Utils from '../../utils';
import Head from './comments/Head';
import Footer from './comments/Footer';
import { rechargeMoney } from '../../api/DataApi';
const Accounting = require("accounting");

import './ComfimRecharge.scss';

class ComfimRechargePage extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      identityCard: user.userInfo.idCard,
      bankName: user.userInfo.belongBank,
      userName: user.userInfo.userName,
      idCard: user.userInfo.idCard,
      cardId: user.userInfo.bankNo,
      money: Utils.searchFormat(this.props.location.search).money,
      visible: false,
      visible2: false,
      loading:false
    }
  }
  componentWillMount() {
    document.title='确认提现';
  }
  //我要离开
  abandon(){
    location.hash='/account/trade/recharge';
  }

  submit(){
    this.setState({
      loading:true
    })
    rechargeMoney(this.state.money,'DEBITCARD')
    .then((data)=>{
      this.setState({
        loading:false
      })
      this.showModalVisible();
    },(err)=>{
      this.setState({
        errorText:err.data.resultMessage,
        loading:false
      });
      this.showModalVisible2();
    })
  }

  showModalVisible = () => {
    this.setState({
      visible: true,
    });
  }
  showModalVisible2 = () => {
    this.setState({
      visible2: true,
    });
  }

  hideModal = () => {
    this.setState({
      visible: false,
    });
  }

  goAccount(url){
    location.hash=url;
  }
  goHelpCenter() {
    window.location.href='/help/trade'
  }

  render() {
    const { identityCard,bankName,userName,cardId,money,loading,visible,visible2,errorText } =this.state;
    return(
      <div className="comfim-recharge-wrap">
        <Head
          title="确认充值"
        />
        <div className="main-content-action">
          <div className="verfiy-left-content">
            <div className="row-ver">
              <p className="key">商户名称</p>
              <p className="value">领投鸟</p>
            </div>
            <div className="row-ver">
              <p className="key">身份信息</p>
              <p className="value">{userName}({identityCard})</p>
            </div>
            <div className="row-ver">
              <p className="key">银行卡信息</p>
              <p className="value">{bankName}({cardId})</p>
            </div>
            <div className="row-ver">
              <p className="key">充值金额</p>
              <p className="value">
                {Accounting.formatMoney(money,{symbol:''})}元
              </p>
            </div>
            <div className="row-ver">
              <p className="key">手续费</p>
              <p className="value">0.00元（商户承担）</p>
            </div>
            <div className="row-ver">
              <p className="key">交易金额</p>
              <p className="value">
                {Accounting.formatMoney(money,{symbol:''})}元
              </p>
            </div>
            <div className='submit-btn-row'>
              <Button
                type="primary"
                loading={loading}
                onClick={this.submit.bind(this)}>
               确认
             </Button>
            </div>
            <div className="row">
              <span onClick={() => this.abandon()} className="leave-btn">我要离开</span>
            </div>
          </div>
        </div>
        <Footer />
        <Modal
          title="恭喜您，充值完成！"
          visible={visible}
          onOk={()=>this.goAccount('/account/viewall')}
          onCancel={()=>this.goAccount("/account/trade")}
          okText="完成"
          cancelText="充值记录"
          wrapClassName="depost-confim-modal"
          closable={false}
        >
          <div className="confirm-content">
            <p>1）完成充值，返回“账户中心”请点击“完成”按钮；</p>
            <p>2）查看充值流水，请点击“充值流水”按钮；</p>
            <p>3）<Link to='/account/trade/recharge'>继续充值>></Link></p>
          </div>
        </Modal>
        <Modal
          title="很遗憾，充值失败！"
          visible={this.state.visible2}
          onCancel={()=>this.goHelpCenter()}
          onOk={()=>this.goAccount('/account/viewall')}
          okText="完成"
          cancelText="帮助中心"
          wrapClassName="depost-confim-modal"
          closable={false}
        >
          <div className="confirm-content">
            <h4 className="wrong-text">{errorText}</h4>
            <p>1）放弃充值，请点击“完成”按钮；</p>
            <p>2）遇到问题，建议查看帮助中心；</p>
            <p>3）<Link to="/account/trade/recharge">继续充值>></Link></p>
          </div>
        </Modal>
      </div>
    )
  }
}

export default ComfimRechargePage;
