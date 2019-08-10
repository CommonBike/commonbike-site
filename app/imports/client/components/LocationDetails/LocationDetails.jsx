import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import R from 'ramda';

// Import components
import EditLocation from '../../containers/EditLocation/EditLocation';
import RaisedButton from '../Button/RaisedButton.jsx'
import ObjectBlock from '../../containers/ObjectBlock/ObjectBlock';
import ManageApiKeys from '../ManageApiKeys/ManageApiKeys';
import ManageUserlist from '../ManageUserlist/ManageUserlist';
import MapSummary from '../../MapSummary'

class LocationDetails extends Component {

  constructor(props) {
    super(props);

//    Meteor.call('goabout.checklocations');
  }

  newObject() {
    this.props.newObject(this.props.locationId);
  }

  render() {
    return (
      <div style={s.base}>

        <p style={s.intro}>
          <span dangerouslySetInnerHTML={{__html: this.props.location.title}} /><br />
        </p>

        <center>
          <MapSummary item={this.props.location} width={400} height={300}/>
        </center>


        { this.props.isEditable?
          <EditLocation locationId={this.props.location._id} />
          :null }

        { this.props.isEditable?
          <ManageUserlist methodsBaseName='locationprovider'
                          parentId={this.props.locationId} />
          :null }

        {/* this.props.isEditable?
          <ManageApiKeys keyOwnerId={this.props.locationId} keyType="location" />
          :null */}

        <RaisedButton style={Object.assign({display: 'none'}, this.props.isEditable && {display: 'block'})} onClick={this.newObject.bind(this)}>
          NIEUWE FIETS
        </RaisedButton>

        { this.props.objects.length != 0 ?
          R.map((object) =>  <ObjectBlock
                              key={object._id}
                              item={object}
                              isEditable={this.props.isEditable}
                              onClick={this.props.clickItemHandler}
                              showPrice={true}
                              showState={this.props.isEditable}
                              showRentalDetails={this.props.isEditable} />
                            , this.props.objects)
          :
          <p style={s.paragraph}>GEEN FIETSEN BESCHIKBAAR</p>
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
  },
  intro: {
    padding: '0 5px 0 70px',
    margin: '0 auto',
    maxWidth: '400px',
    textAlign: 'left',
    minHeight: '80px',
    fontSize: '1.2em',
    fontWeight: '500',
    background: 'url("/files/LocationDetails/marker.svg") 0 0 / auto 30px no-repeat',
  },

}

LocationDetails.propTypes = {
  location: PropTypes.object,
  objects: PropTypes.array,

  methodsBaseName: PropTypes.string,
  locationId: PropTypes.string,
  isEditable: PropTypes.any
};

LocationDetails.defaultProps = {
  location: {},
  objects: {},

  methodsBaseName: "",
  locationId: null,
  isEditable: false
}

export default LocationDetails;
