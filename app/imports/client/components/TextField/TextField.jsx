import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import Radium from 'radium';

class TextField extends Component {

  constructor(props) {
    super(props);
  }

  handleChange(e) {
    console.log(e);
  }

  render() {
    return (
      <input onChange={this.handleChange.bind(this)} required={this.props.required} style={Object.assign({}, s, this.props.style)} type={this.props.type} name={this.props.name} placeholder={this.props.placeholder} onChange={this.props.onChange} onBlur={this.props.onChange} />
    )
  }

};

var s = {
  borderRadius: '5px',
  lineHeight: '40px',
  height: '40px',
  border: 'solid #b5b5b5 1px',
  backgroundColor: '#fff',
  marginTop: '5px',
  marginBottom: '5px',
  paddingRight: '10px',
  paddingLeft: '10px'
}

TextField.propTypes = {
  children: PropTypes.node,

  setValue: PropTypes.any,
  /**
   * The css class name of the root element.
   */
  className: PropTypes.string,
  /**
   * The text string to use for the default value.
   */
  defaultValue: PropTypes.any,
  /**
   * Disables the text field if set to true.
   */
  disabled: PropTypes.bool,

  required: PropTypes.any,

  /**
   * The style object to use to override error styles.
   */
  errorStyle: PropTypes.object,
  /**
   * The error content to display.
   */
  errorText: PropTypes.node,
  /**
   * If true, the floating label will float even when there is no value.
   */
  floatingLabelFixed: PropTypes.bool,
  /**
   * The style object to use to override floating label styles when focused.
   */
  floatingLabelFocusStyle: PropTypes.object,
  /**
   * The style object to use to override floating label styles.
   */
  floatingLabelStyle: PropTypes.object,
  /**
   * The content to use for the floating label element.
   */
  floatingLabelText: PropTypes.node,
  /**
   * If true, the field receives the property width 100%.
   */
  fullWidth: PropTypes.bool,
  /**
   * Override the inline-styles of the TextField's hint text element.
   */
  hintStyle: PropTypes.object,
  /**
   * The hint content to display.
   */
  hintText: PropTypes.node,
  /**
   * The id prop for the text field.
   */
  id: PropTypes.string,
  /**
   * Override the inline-styles of the TextField's input element.
   * When multiLine is false: define the style of the input element.
   * When multiLine is true: define the style of the container of the textarea.
   */
  inputStyle: PropTypes.object,
  /**
   * If true, a textarea element will be rendered.
   * The textarea also grows and shrinks according to the number of lines.
   */
  multiLine: PropTypes.bool,
  /**
   * Name applied to the input.
   */
  name: PropTypes.string,
  /** @ignore */
  onBlur: PropTypes.func,
  /**
   * Callback function that is fired when the textfield's value changes.
   */
  onChange: PropTypes.func,
  /** @ignore */
  onFocus: PropTypes.func,
  /**
   * Number of rows to display when multiLine option is set to true.
   */
  rows: PropTypes.number,
  /**
   * Maximum number of rows to display when
   * multiLine option is set to true.
   */
  rowsMax: PropTypes.number,
  /**
   * Override the inline-styles of the root element.
   */
  style: PropTypes.object,
  /**
   * Override the inline-styles of the TextField's textarea element.
   * The TextField use either a textarea or an input,
   * this property has effects only when multiLine is true.
   */
  textareaStyle: PropTypes.object,
  /**
   * Specifies the type of input to display
   * such as "password" or "text".
   */
  type: PropTypes.string,
  /**
   * Override the inline-styles of the
   * TextField's underline element when disabled.
   */
  underlineDisabledStyle: PropTypes.object,
  /**
   * Override the inline-styles of the TextField's
   * underline element when focussed.
   */
  underlineFocusStyle: PropTypes.object,
  /**
   * If true, shows the underline for the text field.
   */
  underlineShow: PropTypes.bool,
  /**
   * Override the inline-styles of the TextField's underline element.
   */
  underlineStyle: PropTypes.object,
  /**
   * The value of the text field.
   */
  value: PropTypes.any
};

TextField.defaultProps = {
  disabled: false,
  floatingLabelFixed: false,
  multiLine: false,
  fullWidth: false,
  type: 'text',
  underlineShow: true,
  rows: 1,
};

export default Radium(TextField);
