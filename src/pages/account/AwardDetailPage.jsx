import React from 'react';
import { Pagination } from 'antd';
import { awardDetailData,personalInfo } from '../../api/DataApi';

import NoData from './comments/NoData';
import Head from './comments/Head';
import AccountWrapModule from './comments/AccountWrapModule';
import Utils from '../../utils';
import './AwardDetailPage.scss';


const TabList =({data})=>{
  return(
    <table className="account-table-list">
      <thead>
        <tr>
          <th>好友账号</th>
          <th>好友姓名</th>
          <th>投资收益</th>
          <th>奖励收益</th>
          <th>好友级别</th>
        </tr>
      </thead>
      <tbody>
        {
          data.map((el,index)=>(
            <tr key={index}>
              <td>{Utils.mosaicsStr(el.mobileNo,3,3)}</td>
              <td>{Utils.mosaicsStr(el.userName,1,0)}</td>
              <td>{el.reward}</td>
              <td>{el.orderReward}</td>
              <td className={el.friendLevel==1?'one-l':''}>
                {el.friendLevel==1?'一级好友':'二级好友'}
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

class AwardDetailPage extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      dataList:[],
      tabShow:'A',//0:全部,1:一级好友，2：二级好友
      totalCount:0,//总条数
      current:1//分页选中时的样式状态
    }
  };
  componentWillMount() {
    document.title = '奖励明细';
    personalInfo()
    this.getRecordListTab('A',this.state.current)
  }
  getRecordListTab(type,current) {
    //0:全部,1:一级好友，2：二级好友
    const trans={
            A:0,
            B:1,
            C:2
          }
    this.setState({
      tabShow:type,
      current
    })
    awardDetailData(trans[type],current-1)
    .then((data)=>{
      this.setState({
        dataList:data.listPartnerEarnings,
        totalCount:data.totalCount
      })
    },(error)=>{
    })
  }
  //分页
  paginationEvent(page, pageSize) {
    this.setState({
      current:page
    });
    this.getRecordListTab(this.state.tabShow,page);
  }
  render() {
    const { dataList,totalCount,current,tabShow } =this.state;
    return(
      <AccountWrapModule itemId='15' {...this.props}>
        <div className="main-pages-wrap award-detail-page">
          <Head title="奖励明细"/>
          <div className="content-action">
            <div className="has-ad-content banner-toggle-show">
              <p className="info-text">邀请好友双重礼</p>
              <a href='/other/mypartner' className="share-btn">他投我就赚</a>
            </div>
            <div className="tab-toggle clear">
              <div
                className={`item ${tabShow=='A'?'selected':''}`}
                onClick={()=>this.getRecordListTab('A',1)}>
                全部
              </div>
              <div
                className={`item ${tabShow=='B'?'selected':''}`}
                onClick={()=>this.getRecordListTab('B',1)}>
                一级好友
              </div>
              <div
                className={`item ${tabShow=='C'?'selected':''}`}
                onClick={()=>this.getRecordListTab('C',1)}>
                二级好友
              </div>
            </div>
            {
              dataList.length>0?
              <div>
                <TabList data={dataList}/>
                <Pagination
                  current={current}
                  onChange={(page)=>this.paginationEvent(page)}
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

export default AwardDetailPage;
