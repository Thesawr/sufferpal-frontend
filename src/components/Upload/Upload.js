import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { API, graphqlOperation } from 'aws-amplify';
import Storage from '@aws-amplify/storage';
import { createActivity } from '../../graphql/mutations';
import { getActivity, getUser } from '../../graphql/queries';
import FitParser from 'fit-file-parser';
import { useSelector } from 'react-redux';
import MapContainer from '../Map/MapContainer';

const Upload = () => {
  const [activity, setActivity] = useState({});
  const userID = useSelector((state) => state.user.id);
  const [rawMeasurements, setRawMeasurements] = useState([]);

  console.log(userID);

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.onload = () => {
        const binaryString = reader.result;
        // Create a FitParser instance (options argument is optional)
        const fitParser = new FitParser({
          force: true,
          speedUnit: 'km/h',
          lengthUnit: 'km',
          temperatureUnit: 'kelvin',
          elapsedRecordField: true,
          mode: 'list',
        });

        // Parse your file
        fitParser.parse(binaryString, function (error, data) {
          setActivity(data);
          setRawMeasurements(data.records);
        });
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const addActivity = async (activity) => {
    // console.log(activity);
    await API.graphql(graphqlOperation(createActivity, { input: activity }));
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    const userData = await API.graphql(graphqlOperation(getUser, { id: userID }));

    //setRawMeasurements(userData.data.getUser.activities.items[0].rawMeasurements);

    console.log(userData);
    // Storage.get(userData.data.getUser.activities.items[0].rawMeasurementsS3FileKey, { download: true }).then(
    //   (result) => {
    //     console.log(result.Body);
    //   }
    // );
    // const activityData = await API.graphql(
    //   graphqlOperation(getActivity, { id: '3ac0b53c-39d0-4e6f-b50c-ecff62bc11a4' })
    // );
    // console.log(activityData.data.getActivity);
  };

  useEffect(() => {
    const isActivityEmpty = Object.entries(activity).length === 0;
    const customActivityData = {};

    if (!isActivityEmpty) {
      if (activity?.sessions) {
        customActivityData['totalCalories'] = activity?.sessions[0]?.total_calories;
        customActivityData['startTime'] = activity?.sessions[0]?.start_time;
        customActivityData['totalMovingTime'] = activity?.sessions[0]?.total_moving_time;
        customActivityData['maxCadence'] = activity?.sessions[0]?.max_cadence;
        customActivityData['minHeartRate'] = activity?.sessions[0]?.min_heart_rate;
        customActivityData['avgSpeed'] = activity?.sessions[0]?.avg_speed;
        customActivityData['maxHeartRate'] = activity?.sessions[0]?.max_heart_rate;
        customActivityData['totalDistance'] = activity?.sessions[0]?.total_distance;
        customActivityData['avgCadence'] = activity?.sessions[0]?.avg_cadence;
        customActivityData['sport'] = activity?.sessions[0]?.sport;
        customActivityData['avgHeartRate'] = activity?.sessions[0]?.avg_heart_rate;
      }

      console.log(activity?.records);
      // customActivityData['rawMeasurements'] = activity?.records;
      const stringifiedRawMeasurements = JSON.stringify(activity?.records);
      const blob = new Blob([stringifiedRawMeasurements], { type: 'application/json' });
      const rawMeasurementsFileName = `Fit Files/${userID}/fit_${Date.now()}`;
      // console.log(new Date());
      console.log(
        'done writing',
        blob.text().then((result) => {
          console.log('done', JSON.parse(result));
        })
      );
      customActivityData['userID'] = userID;

      Storage.put(rawMeasurementsFileName, blob).then((result) => {
        console.log(result);

        customActivityData['rawMeasurementsS3FileKey'] = result.key;

        // console.log(customActivityData);

        addActivity(customActivityData);
      });
    }
  }, [activity]);

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
      </div>
      {activity.rawMeasurements}
      <MapContainer rawMeasurements={rawMeasurements || []} />
    </>
  );
};

export default Upload;
