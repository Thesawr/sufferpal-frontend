// This function converts raw measurments from backend of activity into useable format for map container
export const setupMapGeoJSONData = (rawMeasurements) => {
  if (rawMeasurements.length === 0) {
    return [];
  }

  const geoJSONData = [];
  const length = rawMeasurements.length;

  for (let index = 0; index < length; index++) {
    const rawMeasurement = rawMeasurements[index];
    if (!rawMeasurement['position_long'] || !rawMeasurement['position_lat']) {
      continue;
    }
    // if (geoJSONData.length > 800) {
    //     break;
    // }
    const coordinates = [rawMeasurement['position_long'], rawMeasurement['position_lat']];
    geoJSONData.push(coordinates);
  }
  return geoJSONData;
};
// this function calculates the pace for an activity
export const calculatePace = (time, distance) => {
  // time is coming in as seconds
  if (!time || !distance) {
    return null;
  }

  const timeInMinutes = time / 60;
  const pace = timeInMinutes / distance;
  return parseFloat(pace.toFixed(2));
};
// this function creates custom time on activity card
export const createCustomTimeString = (time) => {
  if (!time) {
    return null;
  }
  const hours = time / 3600;
  const hourSplitArray = getSplitNumberArray(hours);
  const hoursInt = hourSplitArray[0];
  const minutes = hourSplitArray[1] * 60;
  const minutesSplitArray = getSplitNumberArray(minutes);
  const minutesInt = minutesSplitArray[0];
  const seconds = minutesSplitArray[1] * 60;
  const secondsSplitArray = getSplitNumberArray(seconds);
  const secondsInt = secondsSplitArray[0];
  let hoursString = '';
  let minStr = '';
  let secondsString = '';

  if (hoursInt < 10) {
    hoursString = `0${hoursInt}`;
  } else {
    hoursString = hoursInt.toString();
  }
  if (minutesInt < 10) {
    minStr = `0${minutesInt}`;
  } else {
    minStr = minutesInt.toString();
  }
  if (secondsInt < 10) {
    secondsString = `0${secondsInt}`;
  } else {
    secondsString = secondsInt.toString();
  }
  return `${hoursString}:${minStr}:${secondsString}`;
};

export const getSplitNumberArray = (time) => {
  const timeString = time.toString();
  const decimalString = timeString.split('.');
  return [parseInt(decimalString[0]), parseFloat(`0.${decimalString[1]}`)];
};
