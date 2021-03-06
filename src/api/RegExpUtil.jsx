const RegExpUtil={
  money: /^[1-9]\d*\.\d{1,2}$|0\.[1-9]\d{0,1}$|0\.0[1-9]{1}$|^[1-9]\d*$/,
  userName:/^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,25}$/,//用户名
  mobile:/^1[34578]\d{9}$/,//手机号
  identity:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,//身份证
  password:/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/,//密码
  bankCard:/^\d{12,19}$/,//银行卡
  payPassword:/^\d{6}$/,//支付密码
  phoneCode:/^\d{4}$/,///手机验证码
}

export default RegExpUtil;
