import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';
import ObjectBlock from '../../containers/ObjectBlock/ObjectBlock';

// Import models
import { Objects } from '/imports/api/locations.js'; 

// Import components
import Block from '../Block/Block';

class ObjectList extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={s.base}>

        <p style={s.intro}>
          {this.props.title}<br/>
        </p>

        { this.props.objects.length != 0 ?
           R.map((object) =>  <ObjectBlock
                              key={object._id}
                              item={object}
                              isEditable={this.props.isEditable}
                              showPrice={this.props.showPrice}
                              showState={this.props.showState}
                              showRentalDetails={this.props.showRentalDetails}
                              showLockDetails={this.props.showLockDetails}
                              onClick={this.props.clickItemHandler} />
                            , this.props.objects)
          :
          <p style={s.intro}><i><b>{this.props.emptyListMessage}</b></i></p> 
        }

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
    minHeight: 'calc(100vh - 74px)',
  },
  intro: {
    padding: '0 70px',
    margin: '0 auto',
    maxWidth: '400px',
    textAlign: 'left',
    minHeight: '80px',
    fontSize: '1.2em',
    fontWeight: '500',
    background: 'url("/files/ObjectList/marker.svg") 0 0 / auto 60px no-repeat',
  },

}

ObjectList.propTypes = {
  title: PropTypes.string,
  emptyListMessage: PropTypes.string,
  objects: PropTypes.array,
  clickItemHandler: PropTypes.any,

  showPrice : PropTypes.any,
  showState : PropTypes.any,
  showRentalDetails: PropTypes.any,
  showLockDetails: PropTypes.any,
  isEditable: PropTypes.any
};

ObjectList.defaultProps = {
  title: "Bekijk hier jouw reserveringen",
  emptyListMessage: "",
  objects: {},
  clickItemHandler: '',

  methodsBaseName: "",
  showPrice : false,
  showState : false,
  showRentalDetails: false,
  showLockDetails: false,
  isEditable: false
}

export default ObjectList;
