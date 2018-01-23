import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.func.isRequired,
  load: PropTypes.func.isRequired,
};
class BundleComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mod: null,
    };
  }
  componentWillMount() {
    this.load(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps);
    }
  }
  load(props) {
    this.setState({
      mod: null,
    });
    props.load((mod) => {
      this.setState({
        mod: mod.default ? mod.default : mod,
      });
    });
  }
  render() {
    return this.props.children(this.state.mod);
  }
}
BundleComponent.propTypes = propTypes;


const ModLoader = props => (
  <BundleComponent load={props.mod}>
    {
      (Mod) => {
        if (Mod) {
          return (
            <Mod />
          );
        }
        return (
          <div>
            正在加载...
          </div>
        );
      }
    }
  </BundleComponent>
);
ModLoader.propTypes = {
  mod: PropTypes.func.isRequired,
};

export default ModLoader;
