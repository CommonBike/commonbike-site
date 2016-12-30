// This could better be cached on the server

const Geosearch = (address) => {
  // encoreURI / encodeURIComponent ?
  const url = 'http://maps.google.com/maps/api/geocode/json?address=' + encodeURI(address)
  return fetch(url)
    .then(response => { return response.json() })
}

export default Geosearch
