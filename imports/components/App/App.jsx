import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
 
// App component - represents the whole app
export default class App extends Component {

  render() {
    return (
      <MuiThemeProvider>
        <div style={s.base}>
          <img src="https://trello-attachments.s3.amazonaws.com/57b84120e3ac5fa5b48bbbca/900x387/88cb9443b502f8af9da9ee99cde2ffff/bicycles-bw.jpg" alt="CommonBike" style={s.headerImage} />
          {this.props.content}
        </div>
      </MuiThemeProvider>
    );
  }

}

var s = {
  base: {
    width: '360px',
    margin: '0 auto'
  },
  headerImage: {
    display: 'block',
    maxWidth: '100%',
    height: '154.8px'
  },
}
