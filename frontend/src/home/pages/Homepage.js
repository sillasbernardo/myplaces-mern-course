import React, { useEffect, useState } from 'react';

import Users from '../../user/pages/Users';
import { useHttpClient } from '../../shared/hooks/http-hooks';
import Button from '../../shared/components/FormElements/Button';
import './Homepage.scss';

const Homepage = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState();
  const [loadedUsers, setLoadedUsers] = useState();
  const [placeCreator, setPlaceCreator] = useState();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const placesResponseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/places'
        );
        setLoadedPlaces(placesResponseData.places);

        const usersResponseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users'
        );
        setLoadedUsers(usersResponseData.users);
      } catch (error) {}
    };
    fetchPlaces();
  }, [sendRequest]);

  return (
    <div className="homepage-container">
      <div className="homepage-container__users">
        <Users />
      </div>
      <div className="homepage-container__places">
        {loadedPlaces && !isLoading && (
          // Render places here
          <div>
            <h3>All places</h3>
            {loadedPlaces.map((place) => {
              return (
                <div
                  key={new Date() + Math.random()}
                  className="homepage-container__place-post"
                >
                  {loadedUsers.map((user) => {
                    if (user.id === place.creator) {
                      return (
                        <div
                          className="homepage-container__user-post"
                          key={new Date() + Math.random()}
                        >
                          <img
                            src={`${process.env.REACT_APP_ASSET_URL}/${user.image}`}
                            alt={user.name}
                          />
                          <div className='post-name-location'>
                            <h5>
                              {user.name} <span>posted a new place</span>{' '}
                            </h5>
                            <p id="place-address">{`Location: ${place.address}`}</p>
                          </div>
                        </div>
                      );
                    }
                  })}
                  <div className="user-post__infos">
                    <div>
                      <h4>{place.title}</h4>
                      <p>{place.description}</p>
                    </div>
                  </div>
                  <img
                    id="place-image-post"
                    src={`${process.env.REACT_APP_ASSET_URL}/${place.image}`}
                    alt={place.title}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
