import React, { useContext, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  withRouter
} from 'react-router-dom';
import AuthContext from '../context/auth/authContext';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import themes, { overrides } from '../themes';
import Layout from './Layout';
import Error from '../pages/error';
// import Login from '../pages/login';
import Login from '../pages/loginApp';
import SetupUserView from '../pages/setup/';

import StoreState from '../context/store/StoreState';
import CountryState from '../context/country/CountryState';
import RegionState from '../context/region/RegionState';
import AlertState from '../context/alert/AlertState';
import AreaState from '../context/area/AreaState';
import CategoryState from '../context/category/CategoryState';
import UserState from '../context/user/UserState';

const theme = createMuiTheme({ ...themes.default, ...overrides });

const PrivateRoute = ({ component: Component, ...rest }) => {
  const authContext = useContext(AuthContext);
  const { loadUser } = authContext;

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  return (
    <Route
      {...rest}
      render={props =>
        !localStorage.getItem('token') ? (
          <Redirect to="/login" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

const PublicRoute = ({ component: Component, ...rest }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading } = authContext;
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated && loading ? (
          <Redirect to="/" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

const App = () => (
  <UserState>
    <StoreState>
      <CategoryState>
        <AreaState>
          <CountryState>
            <RegionState>
              <AlertState>
                <MuiThemeProvider theme={theme}>
                  <Router>
                    <Switch>
                      <Route
                        exact
                        path="/"
                        render={() => <Redirect to="/app/dashboard" />}
                      />
                      <Route
                        exact
                        path="/app"
                        render={() => <Redirect to="/app/dashboard" />}
                      />
                      <PrivateRoute path="/app" component={Layout} />
                      <PublicRoute path="/login" component={Login} />
                      <PublicRoute path="/setup" component={SetupUserView} />
                      <Route component={Error} />
                    </Switch>
                  </Router>
                </MuiThemeProvider>
              </AlertState>
            </RegionState>
          </CountryState>
        </AreaState>
      </CategoryState>
    </StoreState>
  </UserState>
);

export default withRouter(App);
