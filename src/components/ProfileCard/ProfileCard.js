import React, { useEffect, useState } from 'react';
import { Card, CardImg, Table, CardText, CardBody, CardTitle, Button } from 'reactstrap';
import SettingsModal from '../SettingsModal/SettingsModal';
import './ProfileCard.scss';
import ProfilePic from './runner-image.jpeg';
import { useSelector } from 'react-redux';
import { API, graphqlOperation } from 'aws-amplify';
import { getUser } from '../../graphql/queries';

const ProfileCard = (props) => {
  const userID = useSelector((state) => state.user.id);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDataFromCall = await API.graphql(graphqlOperation(getUser, { id: userID }));
        console.log(userDataFromCall);
        setUserData(userDataFromCall.data.getUser);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="ProfileCardDiv">
      <Card className="card">
        <CardImg top width="100%" src={ProfilePic} alt="Card image cap" />
        <CardBody>
          <CardTitle className="font-styles">
            {userData.firstName} {userData.lastName}
          </CardTitle>
          <div className="setting-labels">
            User Settings
            <Table className="setting-labels">
              <tbody>
                <tr>
                  <th scope="row">Gender:</th>
                  <td>{userData.gender}</td>
                </tr>
                <tr>
                  <th scope="row">Weight:</th>
                  <td>{userData.weight}</td>
                </tr>
                <tr>
                  <th scope="row">Birthday:</th>
                  <td>{userData.age}</td>
                </tr>
                <tr>
                  <th scope="row" className="setting-labels">
                    Equipped Gear:
                  </th>
                  <td>endpoint for Equipped Gear</td>
                </tr>
              </tbody>
            </Table>
          </div>
          <SettingsModal />
        </CardBody>
      </Card>
    </div>
  );
};

export default ProfileCard;