import React from 'react';
import './ErrorText.scss';

class ErrorText extends React.Component {
  render() {
    const { visible }=this.props;
    return (
      <div className={this.props.className||''}>
        <div className="user-error-text" style={{'display':visible?'block':'none'}}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default ErrorText;
