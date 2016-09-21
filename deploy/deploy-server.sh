cd commonbike-site/bundle/programs/server
export PORT=3004
export ROOT_URL=http://app.common.bike/
export MONGO_URL=mongodb://localhost:27017/commonbike
npm install
cd ../../../
node bundle/main.js
