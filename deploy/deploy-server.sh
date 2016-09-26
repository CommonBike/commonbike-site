cd ~/commonbike-site/bundle/programs/server
export PORT=3004
export ROOT_URL=https://go.common.bike/
export MONGO_URL=mongodb://localhost:27017/commonbike
npm install
cd ../../../
forever start bundle/main.js
