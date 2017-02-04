import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import Radium from 'radium';

class RaisedButton extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <button
        style={Object.assign({}, s, this.props.style)}
        onClick={this.props.onClick}
        >{this.props.children}</button>
    )
  }

};

var s = {
  border: 'none',
  display: 'block',
  backgroundColor: '#000',
  width: '100%',
  marginTop: '20px',
  marginRight: 'auto',
  marginBottom: '20px',
  marginLeft: 'auto',
  paddingTop: '15px',
  paddingRight: '0',
  paddingBottom: '15px',
  paddingLeft: '0',
  maxWidth: '400px',
  textAlign: 'center',
  color: '#fff',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '20px',
}

RaisedButton.propTypes = {
  /**
   * Override the default background color for the button,
   * but not the default disabled background color
   * (use `disabledBackgroundColor` for this).
   */
  backgroundColor: PropTypes.string,
  /**
   * Override the inline-styles of the button element.
   */
  buttonStyle: PropTypes.object,
  /**
   * The content of the button.
   * If a label is provided via the `label` prop, the text within the label
   * will be displayed in addition to the content provided here.
   */
  children: PropTypes.node,
  onClick: PropTypes.func,
  /**
   * The CSS class name of the root element.
   */
  className: PropTypes.string,
  /**
   * If true, the button will be disabled.
   */
  disabled: PropTypes.bool,
  /**
   * Override the default background color for the button
   * when it is disabled.
   */
  disabledBackgroundColor: PropTypes.string,
  /**
   * The color of the button's label when the button is disabled.
   */
  disabledLabelColor: PropTypes.string,
  /**
   * If true, the button will take up the full width of its container.
   */
  fullWidth: PropTypes.bool,
  /**
   * The URL to link to when the button is clicked.
   */
  href: PropTypes.string,
  /**
   * An icon to be displayed within the button.
   */
  icon: PropTypes.node,
  /**
   * The label to be displayed within the button.
   * If content is provided via the `children` prop, that content will be
   * displayed in addition to the label provided here.
   */
  label: PropTypes.string,
  /**
   * The color of the button's label.
   */
  labelColor: PropTypes.string,
  /**
   * The position of the button's label relative to the button's `children`.
   */
  labelPosition: PropTypes.oneOf([
    'before',
    'after',
  ]),
  /**
   * Override the inline-styles of the button's label element.
   */
  labelStyle: PropTypes.object,
  /** @ignore */
  onMouseDown: PropTypes.func,
  /** @ignore */
  onMouseEnter: PropTypes.func,
  /** @ignore */
  onMouseLeave: PropTypes.func,
  /** @ignore */
  onMouseUp: PropTypes.func,
  /** @ignore */
  onTouchEnd: PropTypes.func,
  /** @ignore */
  onTouchStart: PropTypes.func,
  /**
   * If true, the button will use the theme's primary color.
   */
  primary: PropTypes.bool,
  /**
   * Override the inline style of the ripple element.
   */
  rippleStyle: PropTypes.object,
  /**
   * If true, the button will use the theme's secondary color.
   * If both `secondary` and `primary` are true, the button will use
   * the theme's primary color.
   */
  secondary: PropTypes.bool,
  /**
   * Override the inline-styles of the root element.
   */
  style: PropTypes.object,
};

RaisedButton.defaultProps = {
  disabled: false,
  labelPosition: 'after',
  fullWidth: false,
  primary: false,
  secondary: false,
};

export default Radium(RaisedButton);
