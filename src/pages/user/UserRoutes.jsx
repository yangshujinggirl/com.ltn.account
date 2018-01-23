import React from 'react';
import {
  Switch,
  Route
} from 'react-router-dom';

import LoginPage from './LoginPage';//登录
import RegisterPage from './RegisterPage';//注册
import DepositRealPage from './DepositRealPage';//开户
import DepositPsdPage from './DepositPsdPage';//设置支付密码
import DepositCardPage from './DepositCardPage';//绑定银行卡
import DepositVerifyCardPage from './DepositVerifyCardPage';//银行卡验证
import CardSuccessPage from './CardSuccessPage';//绑卡成功
import ResetPsdPage from './ResetPsdPage';//重置密码
import ResetPsdConfirmPage from './ResetPsdConfirmPage';//重置密码确认页面
import ComfimRechargePage from './ComfimRecharge';//确认充值页面（免密）
import ComfirmDrawMoneyPage from './ComfirmDrawMoney';//确认提现页面
import ComfirmRechageWithCode from './ComfirmRechageWithCode';//确认充值页面（非免密）
import ChangePasswordStatePage from './ChangePasswordState';//银行卡验证
import ChangeCardPage from './ChangeCardPage';//换卡
import ChangeLoginPsd from './ChangeLoginPsd';//更改登陆密码

class UserRoutes extends React.Component {
  render() {
    return(
      <Switch>
        <Route exact path='/user/login' component={LoginPage}></Route>
        <Route exact path='/user/register' component={RegisterPage}></Route>
        <Route exact path='/user/depostReal' component={DepositRealPage}></Route>
        <Route exact path='/user/depostPsd' component={DepositPsdPage}></Route>
        <Route exact path='/user/depostCard' component={DepositCardPage}></Route>
        <Route exact path='/user/depositVerify' component={DepositVerifyCardPage}></Route>
        <Route exact path='/user/cardSuccess' component={CardSuccessPage}></Route>
        <Route exact path='/user/resetPsd' component={ResetPsdPage}></Route>
        <Route exact path='/user/resetConfirmPsd' component={ResetPsdConfirmPage}></Route>
        <Route exact path='/user/changeLoginPsd' component={ChangeLoginPsd}></Route>
        <Route exact path='/user/changeCard' component={ChangeCardPage}></Route>
        <Route exact path='/user/comfirmWithCode' component={ComfirmRechageWithCode}></Route>
        <Route exact path='/user/changePassState/:type' component={ChangePasswordStatePage}></Route>
        <Route exact path='/user/comfimrecharge' component={ComfimRechargePage}></Route>
        <Route exact path='/user/comfirmDrawMoney' component={ComfirmDrawMoneyPage}></Route>
      </Switch>
    )
  }
}

export default UserRoutes;
