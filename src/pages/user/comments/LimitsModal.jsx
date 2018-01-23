import React from 'react';
import { Modal } from 'antd';
import { depositCardListData } from '../../../api/DataApi';
import './LimitsModal.scss';
class LimitsModal extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      bankList:[]
    }
  }
  componentWillMount() {
  this.getBankList()
  }
  //获取银行卡列表
  getBankList() {
    depositCardListData()
    .then((data)=>{
      this.setState({
        bankList:data.bankInfoList
      })
    },(error)=>{
      if(error.data.resultCode==10000005||error.data.resultCode==10000006) {
        location.hash=`/user/login?backUrl=${this.props.match.path}`;
      }
    })
  }
  render() {
    const {visible,handleCancel} =this.props;
    return (
      <Modal
        title="充值限额表"
        visible={visible}
        onCancel={handleCancel}
        footer={[]}
      >
        <div className="limits-wrap">
          <table className="limits-tables">
            <thead>
              <tr>
                <th>银行</th>
                <th>单笔限额</th>
                <th>单日限额</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.bankList.map((el,index)=>(
                  <tr key={index}>
                    <td>{el.bankName}</td>
                    <td>{el.chargeDateLimit}</td>
                    <td>{el.chargeTimeLimit}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </Modal>
    )
  }
}




export default LimitsModal;
