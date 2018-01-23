import React from 'react';
import { Pagination,Progress,Icon } from 'antd';
import moment from 'moment';
import {
  inviteRecordData,
  inviteHeaderData,
  personalInfo
} from '../../api/DataApi';

import Head from './comments/Head';
import AccountWrapModule from './comments/AccountWrapModule';
import NoData from './comments/NoData';
import Utils from '../../utils';
import './InviteRecordPage.scss';

const TabList =({data})=>{
  return(
    <table className="account-table-list">
      <thead>
        <tr>
          <th>好友账号</th>
          <th>注册时间</th>
          <th>好友姓名</th>
          <th>注册</th>
          <th>开户</th>
          <th>绑卡</th>
          <th>投资</th>
          <th>好友级别</th>
        </tr>
      </thead>
      <tbody>
        {
          data.map((el,index)=>(
            <tr key={index}>
              <td>{Utils.mosaicsStr(el.friendAccount,3,3)}</td>
              <td>
                {
                  moment(el.registerTime).format('YYYY-MM-DD')
                }
              </td>
              <td>{Utils.mosaicsStr(el.friendName,1,0)}</td>
              <td>
                {
                  el.isRegister==1?
                  <Icon type="check" />
                  :
                  ''
                }
              </td>
              <td>
                {
                  el.isRealName==1?
                  <Icon type="check" />
                  :
                  ''
                }
              </td>
              <td>
                {
                  el.isTiedCard==1?
                  <Icon type="check" />
                  :
                  ''
                }
              </td>
              <td>
                {
                  el.isInvestment==1?
                  <Icon type="check" />
                  :
                  ''
                }
            </td>
              <td className={el.friendLevel=='1'?'one-l':''}>
                {el.friendLevel=='1'?'一级好友':'二级好友'}
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

class InviteRecordPage extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      dataList:[],
      headerData:{},
      tabShow:'A',
      totalCount:0,//总条数
      current:1//分页选中时的样式状态
    }
  };
  componentWillMount() {
    document.title = '邀请记录';
    personalInfo()
    this.getHeader();
    this.getRecordListTab('A',this.state.current)
  }
  getHeader() {
    inviteHeaderData()
    .then((data)=>{
      this.setState({
        headerData:data.invitation
      })
    },(error)=>{
      // if(error.data.resultCode==10000005||error.data.resultCode==10000006) {
      //   location.hash=`/user/login?backUrl=${this.props.match.path}`;
      // }
    })
  }
  //列表
  getRecordListTab(type,current) {
    //参数映摄
    //A:全部,B:注册，c：实名，D:绑卡，E:投资
    const trans = {
            A:0,
            B:0,
            C:1,
            D:2,
            E:3
          }

    this.setState({
      tabShow:type,
      current
    })
    inviteRecordData(trans[type],current-1)
    .then((data)=>{
      this.setState({
        dataList:data.invitationList,
        totalCount:data.totalCount
      })
    },(error)=>{
      // console.log(error.message)
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
    const { headerData,dataList,tabShow,totalCount,current }=this.state;
    let registerPercent;
    let realNamePercent;
    let bindCardPercent;
    let investPercent;
    if(headerData) {
      if(headerData.totalRegister==0) {
        registerPercent=0;
        realNamePercent=0;
        bindCardPercent=0;
        investPercent=0;
      } else {
        registerPercent = (headerData.totalRegister/headerData.totalRegister)*100;
        realNamePercent = (headerData.totalRealName/headerData.totalRegister)*100;
        bindCardPercent = (headerData.totalTiedCard/headerData.totalRegister)*100;
        investPercent = (headerData.totalInvestment/headerData.totalRegister)*100;
      }
    }
    return(
      <AccountWrapModule itemId='14' {...this.props}>
        <div className="main-pages-wrap invite-record-page">
          <Head title="邀请记录"/>
          <div className="content-action">
            <div className="canvas-list">
              <div className="canvas-item">
                <Progress
                  type="circle"
                  strokeWidth={4}
                  percent={registerPercent}
                  width={150}
                  showInfo={false}/>
                <div className="showInfo-text">
                  <p className="circle-num">{headerData.totalRegister}</p>
                  注册
                </div>
              </div>
              <div className="canvas-item">
                <Progress
                  type="circle"
                  strokeWidth={4}
                  percent={realNamePercent}
                  width={150}
                  showInfo={false}/>
                <div className="showInfo-text">
                  <p className="circle-num">{headerData.totalRealName}</p>
                  开户
                </div>
              </div>
              <div className="canvas-item">
                <Progress
                  type="circle"
                  strokeWidth={4}
                  percent={bindCardPercent}
                  width={150}
                  showInfo={false}/>
                <div className="showInfo-text">
                  <p className="circle-num">{headerData.totalTiedCard}</p>
                  绑卡
                </div>
              </div>
              <div className="canvas-item">
                <Progress
                  type="circle"
                  strokeWidth={4}
                  percent={investPercent}
                  width={150}
                  showInfo={false}/>
                <div className="showInfo-text">
                  <p className="circle-num">{headerData.totalInvestment}</p>
                  投资
                </div>
              </div>
            </div>
            <div>
              <div className="tab-toggle clear">
                <div
                  className={`item ${tabShow=='A'?'selected':''}`}
                  onClick={()=>this.getRecordListTab('A',1)}>
                  全部
                </div>
                <div
                  className={`item ${tabShow=='B'?'selected':''}`}
                  onClick={()=>this.getRecordListTab('B',1)}>
                  注册
                </div>
                <div
                  className={`item ${tabShow=='C'?'selected':''}`}
                  onClick={()=>this.getRecordListTab('C',1)}>
                  开户
                </div>
                <div
                  className={`item ${tabShow=='D'?'selected':''}`}
                  onClick={()=>this.getRecordListTab('D',1)}>
                  绑卡
                </div>
                <div
                  className={`item ${tabShow=='E'?'selected':''}`}
                  onClick={()=>this.getRecordListTab('E',1)}>
                  投资
                </div>
              </div>
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
        </div>
      </AccountWrapModule>

    )
  }
}

export default InviteRecordPage;
