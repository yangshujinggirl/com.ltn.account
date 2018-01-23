import React from 'react';
import { Pagination } from 'antd';

import { getInfoListData,personalInfo } from '../../api/DataApi';
import NoData from './comments/NoData';
import Head from './comments/Head';
import AccountWrapModule from './comments/AccountWrapModule';

import './InfolistPage.scss';

const TabList =({data})=>(
  <table className="account-table-list">
    <thead>
      <tr>
        <th>消息内容</th>
        <th>发送时间</th>
      </tr>
    </thead>
    <tbody>
      {
        data.map((el,index)=>(
          <tr key={index}>
            <td>{el.content}</td>
            <td>{el.createDate}</td>
          </tr>
        ))
      }
    </tbody>
  </table>
)

class InfolistPage extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      dataList:[],
      totalCount:0,//总条数
      current:1//分页选中时的样式状态
    }
  };
  componentWillMount() {
    document.title = '我的消息';
    personalInfo();
    this.getInfoList(this.state.current)
  }
  getInfoList(current) {
    getInfoListData(current-1)
    .then((data)=>{
      this.setState({
        dataList:data.messages,
        totalCount:data.totalCount
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
    this.getInfoList(page)
  }
  render() {
    const { dataList,totalCount,current }=this.state;
    return(
      <AccountWrapModule itemId='7' {...this.props}>
        <div className="infolist-pages main-pages-wrap">
          <Head title="我的消息"/>
          <div className="content">
            <div className="headline">我的消息列表</div>
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

export default InfolistPage;
