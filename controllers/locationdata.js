const Phone = require('../models/phone');
const Beacon = require('../models/beacon');
// write functions to call the methods of both Phone and Beacon, push the data up to DB

async function getBeacon(){
  const data = await Beacon.getCoordinates();
  const coordinates = {
    lat : data.latitude,
    lng : data.longitude,
  };
  return coordinates;
}

async function setBeacon(){
  const data = await Beacon.setCoordinates();
  console.log("data from setBeacon:", data);
  const coordinates = {
    lat : data.latitude,
    lng : data.longitude,
  };
  return coordinates;
}

module.exports = {
  getBeacon,
  setBeacon,
};