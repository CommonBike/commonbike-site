import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';

// Import components
import RaisedButton from '../RaisedButton/RaisedButton.jsx'
import ObjectBlock from '../../containers/ObjectBlock/ObjectBlock';

class LocationDetails extends Component {

  constructor(props) {
    super(props);
  }

  newObject() {
    this.props.newObject(this.props.locationId);
  }

  render() {
    return (
      <div style={s.base}>

        <h1 style={s.title} dangerouslySetInnerHTML={{__html: this.props.location.title}}></h1>

        <p>
          Pak je fiets bij <b><span dangerouslySetInnerHTML={{__html: this.props.location.title}} /></b>. Kies hieronder je gewenste fiets. 
        </p>

        <RaisedButton style={Object.assign({display: 'none'}, this.props.isEditable && {display: 'block'})} onClick={this.newObject.bind(this)}>
          Nieuwe fiets
        </RaisedButton>

        {R.map((object) =>  <ObjectBlock
                              key={object._id}
                              item={object}
                              isEditable={this.props.isEditable}
                              onClick={this.props.clickItemHandler} />
                            , this.props.objects)}

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
  },
  title: {
    textAlign: 'center',
  }
}

LocationDetails.propTypes = {
  location: PropTypes.object,
  objects: PropTypes.array,
};

LocationDetails.defaultProps = {
  location: {}
}

export default LocationDetails;
