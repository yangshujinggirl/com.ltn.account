import React from 'react';
import TopModule from '../../../common/components/TopModule';//引入公共头部
import FooterModule from '../../../common/components/FooterModule';//引入公共底部
import SiderBar from './SiderBar';//侧边栏
import FloatNav from '../../../common/components/FloatNav';
import './AccountWrapModule.scss';

class AccountWrapModule extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    const { itemId }=this.props;
    return(
      <div>
        <TopModule {...this.props}/>
        <div className="account-page-controller">
          <div className="account-siderbar-action">
            <SiderBar itemId={itemId} {...this.props}/>
          </div>
          <div className="account-modules-action">
            {this.props.children}
          </div>
          <FloatNav />
        </div>
        <FooterModule />
      </div>
    )
  }
}


export default AccountWrapModule;
