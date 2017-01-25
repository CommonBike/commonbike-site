export const StyleProvider = (function () {
    var instance;
 
    return {
        getInstance: function () {
            if (!instance) {
                instance = AllStyles;
            }
            return instance;
        }
    };
})();

var AllStyles = {
	checkInOutProcess: {
	  base: {
	    fontSize: 'default',
	    lineHeight: 'default',
	    padding: '20px 20px 0 20px',
	    textAlign: 'center',
	  },
	  button: {
	    display: 'block'
	  },
	  list: {
	    margin: '0 auto',
	    padding: 0,
	    textAlign: 'center',
	    listStyle: 'none',
	  },
	  listitem: {
	    padding: '0 10px 0 0',
	    margin: '0 auto',
	    textAlign: 'center',
	    minHeight: '40px',
	    fontSize: '1.2em',
	    fontWeight: '500',
	    listStyle: 'none',
	  },
	  largerFont: {
	    fontSize: '4em',
	    fontWeight: '1000',
	  },
	  image: {
	    padding: '20px 20px 0 20px',
	    textAlign: 'center',
	    maxHeight: '250px',
	  },
	  textField: {
	    display: 'inline-block',
	    width: '300px',
	    maxWidth: '100%',
	  },
	  codeentry: {
	    backgroundColor: '#fff',
	    maxWidth: '400px',
	    textAlign: 'center',
	    color: '#000',
	    fontWeight: 'bold',
	    fontSize: '20px',
	    padding: '10px',
	    margin: '2px'
	  },
	  explanationText: {
	    padding: '0 25px 25px 25px',
	    margin: '0px auto',
	    maxWidth: '400px',
	    textAlign: 'left',
	    minHeight: '80px',
	    fontSize: '1.2em',
	    fontWeight: 500,
	  }
	}
}