import Map from '../imports/client/Map'
import {mount} from 'react-mounter'

FlowRouter.route('/map', {
  name: 'map',
  action() {
    mount(Map)
  }
})
