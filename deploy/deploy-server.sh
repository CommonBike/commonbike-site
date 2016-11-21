cd /home/tuxion/commonbike-site/bundle/programs/server
export PORT=3004
export ROOT_URL=https://go.common.bike/
export MONGO_URL=mongodb://localhost:27017/commonbike
npm install
forever start /home/tuxion/commonbike-site/bundle/main.js
