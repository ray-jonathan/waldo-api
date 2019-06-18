const Phone = require('../models/phone');
const Beacon = require('../models/beacon');
// write functions to call the methods of both Phone and Beacon, push the data up to DB

async function getBeacon(){
  const data = await Beacon.getCoordinates();
  console.log(data);
}

module.exports = {
  getBeacon,
};