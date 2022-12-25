import './App.css';
import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

// import NewPlace from './places/pages/NewPlace';
// import UserPlaces from './places/pages/UserPlaces';
import MainNavigation from './shared/components/Navigation/MainNavigation';
// import UpdatePlace from './places/pages/UpdatePlace';
import Authentication from './user/pages/Authentication';
// import Homepage from './home/pages/Homepage';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));
const Homepage = React.lazy(() => import('./home/pages/Homepage'));

const App = () => {
  const { token, login, logout, userId } = useAuth();

  /* Routing */
  let routes;
  if (token) {
    routes = (
      <Switch>
        {/* Home page */}
        <Route path="/" exact>
          {/* <Users /> */}
          <Homepage />
        </Route>

        {/* See user places */}
        <Route path="/:userId/places">
          <UserPlaces />
        </Route>

        {/* New place */}
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>

        {/* Update place */}
        <Route path="/places/:placeId" exact>
          <UpdatePlace />
        </Route>

        {/* Redirects to home page */}
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        {/* Auth place */}
        <Route path="/auth" exact>
          <Authentication />
        </Route>

        {/* Redirects to authentication */}
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
