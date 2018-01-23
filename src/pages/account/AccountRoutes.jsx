// 登录、注册、忘记密码、企业注册  模块路由
import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';

import ViewallPage from './ViewallPage';//账户总览
import DetailmoneyPage from './DetailmoneyPage';//资金明细
import ReturnedMoneyPage from './ReturnedMoneyPage';//回款记录
import TrackReacordPage from './TrackReacordPage';//投资记录
import AwardDetailPage from './AwardDetailPage';//奖励明细
import BirdCoinPage from './BirdCoinPage';//我的鸟币
import IntegralPage from './IntegralPage';//我的积分
import InviteRecordPage from './InviteRecordPage';//邀请记录
import RaiseTickitPage from './RaiseTickitPage';//加息券
import ReturnTickitPage from './ReturnTickitPage';//返现券
import InfolistPage from './InfolistPage';//我的消息
import AddressPage from './AddressPage';//我的地址
import CardPage from './CardPage';//我的银行卡
import PartnerPage from './PartnerPage'//我的合伙人
import PersonalInfo from './PersonalInfo'//个人资料
import Recharge from './Recharge'//充值
import DrawMoney from './DrawMoney'//提现
import TradePage from './TradePage'//
import CoinCertificate from './CoinCertificate'//兑换
import InCardProcess from './InCardProcess'//兑换

class HomeRoutes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/account/viewall" component={ViewallPage} />
        <Route exact path="/account/infolist" component={InfolistPage} />
        <Route exact path="/account/detailmoney" component={DetailmoneyPage} />
        <Route exact path="/account/trackReacord" component={TrackReacordPage} />
        <Route exact path="/account/returnedMoney" component={ReturnedMoneyPage} />
        <Route exact path="/account/awardDetail" component={AwardDetailPage} />
        <Route exact path="/account/birdCoin" component={BirdCoinPage} />
        <Route exact path="/account/integral" component={IntegralPage} />
        <Route exact path="/account/inviteRecord" component={InviteRecordPage} />
        <Route exact path="/account/raiseTickit" component={RaiseTickitPage} />
        <Route exact path="/account/returnTickit" component={ReturnTickitPage} />
        <Route exact path="/account/address" component={AddressPage} />
        <Route exact path="/account/card" component={CardPage} />
        <Route exact path="/account/partner" component={PartnerPage} />
        <Route exact path="/account/personalInfo" component={PersonalInfo} />
        <Route exact path="/account/trade/recharge" component={Recharge} />
        <Route exact path="/account/trade/drawmoney" component={DrawMoney} />
        <Route exact path="/account/trade" component={TradePage} />
        <Route exact path="/account/exchange" component={CoinCertificate} />
        <Route exact path="/account/inCardProcess" component={InCardProcess} />
      </Switch>
    );
  }
}

export default HomeRoutes;
