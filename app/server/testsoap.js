import { Meteor } from 'meteor/meteor'
import { SkopeiAPI } from '/imports/api/integrations/skopei'


if(Meteor.isServer) {
	Meteor.methods({
	  testsoap() {
		console.log('start testing webservice')
		console.log('///////////////////////////////')
	  	console.log(SkopeiAPI);
		console.log('///////////////////////////////')
		return SkopeiAPI.rentBike("D76egbG6SkcSML2ZS", 1)
		console.log('done testing webservice')
	  },
	})
}
