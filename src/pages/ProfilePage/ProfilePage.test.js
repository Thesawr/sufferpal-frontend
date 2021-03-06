import React from 'react';
import { render } from '@testing-library/react';
import ProfilePage from '../ProfilePage/ProfilePage';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { createMemoryHistory } from 'history';

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  Map: () => ({}),
}));

test('renders ProfilePage', () => {
  const { getByText } = render(
    <Provider store={store}>
      <Router history={createMemoryHistory({ initialEntries: ['/'] })}>
        <ProfilePage />
      </Router>
    </Provider>
  );
  const profilePageText = getByText(/your activities/i);
  expect(profilePageText).toBeInTheDocument();
  const createActivityFormText = getByText(/fit file dropbox/i);
  expect(createActivityFormText).toBeInTheDocument();
});
