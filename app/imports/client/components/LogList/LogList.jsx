import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';

class LogList extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.logitems)
    return (
      <div style={s.base}>
        <div style={s.title}>{this.props.title}</div>
        {R.map((logitem) => <div key={logitem._id} style={s.centerbox}>{logitem.datetime} - {logitem.description}<br/>{JSON.stringify(logitem.data, 0,4)}</div>, this.props.logitems)}
      </div>
    );
  }
}

var s = {
  base: {
    fontSize: 'default',
    lineHeight: 'default',
    padding: '20px 20px 0 20px',
    textAlign: 'center',
    minHeight: 'calc(100vh - 66px)',
  },
  title: {
    fontSize: '1.2em',
    fontWeight: '500',
    maxWidth: '100%',
    width: '400px',
    margin: '10px auto',
    padding: '5px 0',
  },
  centerbox: {
    background: 'white',
    padding: '2px',
    margin: '2px',
    border: '1px solid black',
    textAlign: 'left'
  }
}

LogList.propTypes = {
  title: PropTypes.string,
  logitems: PropTypes.array
};

LogList.defaultProps = {
  title: "Log"
}

export default LogList;