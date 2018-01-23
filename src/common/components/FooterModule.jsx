import React from 'react';
import './FooterModule.scss';

import iconImg0 from './imgs/footer_icon1.png';
import iconImg1 from './imgs/code-app.png';
import iconImg2 from './imgs/footer_icon2.png';
import iconImg3 from './imgs/code-weixin.png';
import iconImg4 from './imgs/footer_icon3.png';
const FooterModule=()=>(
  <div>
    <div className="foot-nav-warp">
      <div className="head-wrap">
        <div className="contain">
          <img src={iconImg0} alt="add" />
          <p className="first">（工作日9:30-18:30）</p>
          <p className="second">400-999-9980</p>
          <p className="third">领投鸟投资用户交流群：247441580</p>
        </div>
        <div className="contain">
          <div>
            <ul>
              <li className="title">关于我们</li>
              <li><a href="/about/pltinfo" target="_blank">平台介绍</a></li>
              <li><a href="/about/team" target="_blank">团队介绍</a></li>
              <li><a href="/about/advantage" target="_blank">品牌优势</a></li>
              <li><a href="/about/honor" target="_blank">平台荣誉</a></li>
              <li><a href="/about/partner" target="_blank">合作伙伴</a></li>
            </ul>
            <ul className="vertical-align">
              <li className="title">联系我们</li>
              <li><a href="/about/notice" target="_blank">平台公告</a></li>
              <li><a href="/about/news" target="_blank">媒体报道</a></li>
              <li><a href="/about/join" target="_blank">加入我们</a></li>
              <li><a href="/about/contact" target="_blank">联系我们</a></li>
              <li><a href="http://www.hongtanggroup.com/" target="_blank">集团官网</a></li>
            </ul>
            <ul className="vertical-align">
              <li className="title">帮助中心</li>
              <li><a href="/other/newerguide" target="_blank">新手指引</a></li>
              <li><a href="/help/aboutltn" target="_blank">帮助中心</a></li>
              <li><a href="/other/actlist" target="_blank">热门活动</a></li>
            </ul>
            <ul className="vertical-align">
              <li className="title">安全保障</li>
              <li><a href="/about/report" target="_blank">运营报告</a></li>
              <li><a href="/about/protocol" target="_blank">法律法规</a></li>
              <li><a href="/other/safeguards" target="_blank">安全保障</a></li>
            </ul>
          </div>
        </div>
        <div className="contain">
          <div className="content">
            <img className="icode" src={iconImg1} alt="FootIcon1" />
            <p>APP下载</p>
            <div className="white-icon email">
              <img src={iconImg2} alt="FootIcon1" />
              <span>客服邮箱</span>
              <p className="server-tips">客服邮箱：service@lingtouniao.com</p>
            </div>
          </div>
          <div className="content">
            <img className="icode" src={iconImg3} alt="FootIcon1" />
            <p>微信公众号</p>
            <a className="white-icon" href="http://weibo.com/u/5935757405">
              <img src={iconImg4} alt="FootIcon1" />
              <span>新浪微博</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div className="bottom-foot-wrap">
      <div className="icons">
        {/* <a className="icons1" href="https://trustsealinfo.websecurity.norton.com/splash?form_file=fdf/splash.fdf&amp;dn=www.lingtouniao.com&amp;lang=zh_cn" target="_blank"></a> */}
        <a className="icons2" href="http://credit.szfw.org/CX20160524015311350170.html" target="_blank"></a>
        <a className="icons3" href="http://www.sgs.gov.cn/lz/etpsInfo.do?method=index" target="_blank"></a>
        <a className="icons4" href="http://www.miibeian.gov.cn/publish/query/indexFirst.action" target="_blank"></a>
        <a className="icons5" href="http://sfia.org.cn/h/n/user/toDetailMermbersMainInfo?uId=2016072400000000077" target="_blank"></a>
        <a className="icons6" href="http://v.pinpaibao.com.cn/authenticate/cert/?site=www.lingtouniao.com&amp;amp;at=business" target="_blank"></a>
        <a className="icons7" href="http://si.trustutn.org/info?sn=881160520000436261733" target="_blank"></a>
        <a className="icons8" href="https://ss.knet.cn/verifyseal.dll?sn=e160523310104635708sr5000000&amp;amp;pa=500267" target="_blank"></a>
        <a href="http://www.cnzz.com/stat/website.php?web_id=1258037212" target="_blank"></a>
      </div>
      <div className="friend">
        <div className="friend_top">
          友情链接：
          <a href="http://www.wdzj.com/dangan/ltnlc/" target="_blank">网贷之家&nbsp;</a>
          <span>|</span>
          <a href="http://lingtouniao.p2peye.com/" target="_blank">网贷天眼&nbsp;</a>
          <span>|</span>
          <a href="http://baike.baidu.com/item/领投鸟理财" target="_blank">百度百科&nbsp;</a>
          <span>|</span>
          <a href="http://tieba.baidu.com/f?kw=%E9%A2%86%E6%8A%95%E9%B8%9F&amp;amp;ie=utf-8" target="_blank">百度贴吧&nbsp;</a>
          <span>|</span>
          <a href="http://mp.sohu.com/profile?xpt=cHBhZzI1NjRjY2RmOThmZkBzb2h1LmNvbQ==" target="_blank">搜狐媒体&nbsp;</a>
          <span>|</span>
          <a href="http://weibo.com/u/5935757405?topnav=1&amp;amp;wvr=6&amp;amp;topsug=1" target="_blank">新浪微博&nbsp;</a>
          <span>|</span>
          <a href="http://toutiao.com/m5784948163/" target="_blank">今日头条&nbsp;</a>
          <span>|</span>
          <a href="http://www.lagou.com/gongsi/103258.html?m=1" target="_blank">拉勾&nbsp;</a>
          <span>|</span>
          <a href="http://www.itjuzi.com/company/32856" target="_blank">IT桔子</a>
        </div>
        <div className="friend_bottom">
          公司地址：上海市金沙江路2145号普罗娜商务广场A栋7楼©2016 LINGTOUNIAO.COM 上海吾悠互联网科技服务有限公司版权所有
          <a className="except" href="http://www.miitbeian.gov.cn/">沪ICP备15056137号</a>
          <span>市场有风险&nbsp;投资需谨慎</span>
        </div>
      </div>
    </div>
  </div>
)

export default FooterModule;
