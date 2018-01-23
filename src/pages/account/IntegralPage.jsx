import React from 'react';
import { Pagination } from 'antd';
import moment from 'moment';
import Head from './comments/Head';
import AccountWrapModule from './comments/AccountWrapModule';
import { getIntegralData,personalInfo } from '../../api/DataApi';
import NoData from './comments/NoData';
import './IntegralPage.scss';

const TabList =({data})=>{
  const trans = {
          "REGISTER": "注册",
          "AUTHNAME": "实名",
          "BINDCARD": "绑卡",
          "RECHARGE": "充值",
          "INVEST": "投资",
          "REFERRER": "推荐",
          "SIGNIN": "签到",
          "ACC_SIGNIN":"签到累积",
          "CROWDFUNDING": "众筹",
          "HELPEACHOTHER": "互助",
          "SHARE": "分享",
          "EXCHANGE": "兑换",
          "HISTORY": "积分结转",
          "MANUALADD": "积分调整"
        };
  return(
    <table className="account-table-list">
      <thead>
        <tr>
          <th>说明</th>
          <th>数量</th>
          <th>余额</th>
          <th>时间</th>
        </tr>
      </thead>
      <tbody>
        {
          data.map((el,index)=>(
            <tr key={index}>
              <td>{trans[el.eventType]}</td>
              <td>{el.operateType==2?'-':'+'}{el.integral}</td>
              <td>{el.currentIntegral}</td>
              <td>
                {
                  moment(el.eventDate).format('YYYY-MM-DD')
                }
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

class IntegralPage extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      dataList:[],
      totalCount:0,//总条数
      current:1//分页选中时的样式状态
    }
  };
  componentWillMount() {
    document.title = '我的积分';
    personalInfo()
    this.getIntegralList(this.state.current)
  }
  getIntegralList(current) {
    getIntegralData(current-1)
    .then((data)=>{
      this.setState({
        dataList:data.data,
        totalCount:data.total
      })
    },(error)=>{
      // if(error.data.resultCode==10000005||error.data.resultCode==10000006) {
      //   location.hash=`/user/login?backUrl=${this.props.match.path}`;
      // }
    })
  }
  //分页
  paginationEvent(page, pageSize) {
    this.setState({
      current:page
    });
    this.getIntegralList(page);
  }
  render() {
    const { dataList,totalCount,current }=this.state;
    return(
      <AccountWrapModule itemId='12' {...this.props}>
        <div className="main-pages-wrap integral-page">
          <Head title="我的积分"/>
          <div className="content-action">
            <div className="headline">我的积分列表</div>
          {
            dataList.length>0?
            <div>
              <TabList data={dataList}/>
              <Pagination
                current={current}
                onChange={this.paginationEvent.bind(this)}
                defaultPageSize={6}
                total={totalCount} />
            </div>
            :
            <NoData />
          }
          </div>
        </div>
      </AccountWrapModule>
    )
  }
}

export default IntegralPage;
