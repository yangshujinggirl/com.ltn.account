import React from 'react';
import './ButtonAccount.scss';

class ButtonAccount extends React.Component {
  static defaultProps={
		type: 'solid' //按钮类型,默认实心:solid,空心:hollow
	}

  render() {
    const btnClass =`account-components-btn ${this.props.className||''} ${this.props.type}`;
    return (
      <button className={btnClass} onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

export default ButtonAccount;
