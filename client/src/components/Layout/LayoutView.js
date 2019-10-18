import React from 'react';
import { withStyles, CssBaseline } from '@material-ui/core';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter
} from 'react-router-dom';
import classnames from 'classnames';

import Header from '../Header';
import Sidebar from '../Sidebar';
import Alerts from '../Alerts/AlertsView';

// pages
import Dashboard from '../../pages/dashboard';
import Notifications from '../../pages/notifications';
import Tables from '../../pages/tables';
import Stores from '../../pages/stores';
import Users from '../../pages/users';
import Countries from '../../pages/countries';
import Regions from '../../pages/regions';
import Areas from '../../pages/areas';
import Categories from '../../pages/categories';
import Register from '../../pages/register';

// import Typography from '../../pages/typography';
// import Maps from '../../pages/maps';
// import Icons from '../../pages/icons';
// import Charts from '../../pages/charts';
// import SetupUserView from '../../pages/setup';

const Layout = ({ classes, isSidebarOpened, toggleSidebar }) => (
  <div className={classes.root}>
    <CssBaseline />
    <Router>
      <React.Fragment>
        <Header />
        <Sidebar />
        <div
          className={classnames(classes.content, {
            [classes.contentShift]: isSidebarOpened
          })}
        >
          <div className={classes.fakeToolbar} />
          <Alerts />
          <Switch>
            <Route path="/app/dashboard" component={Dashboard} />
            {/* <Route path="/app/typography" component={Typography} /> */}
            <Route path="/app/tables" component={Tables} />
            <Route path="/app/stores" component={Stores} />
            <Route path="/app/users" component={Users} />
            <Route path="/app/countries" component={Countries} />
            <Route path="/app/regions" component={Regions} />
            <Route path="/app/notifications" component={Notifications} />
            <Route path="/app/areas" component={Areas} />
            <Route path="/app/categories" component={Categories} />
            <Route path="/app/register" component={Register} />

            {/* <Route path="/app/setup" component={SetupUserView} />
             <Route
              exact
              path="/app/ui"
              render={() => <Redirect to="/app/ui/icons" />}
            />
            <Route path="/app/ui/maps" component={Maps} />
            <Route path="/app/ui/icons" component={Icons} />
            <Route path="/app/ui/charts" component={Charts} /> */}
          </Switch>
        </div>
      </React.Fragment>
    </Router>
  </div>
);

const styles = theme => ({
  root: {
    display: 'flex',
    maxWidth: '100vw',
    overflowX: 'hidden'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    width: `calc(100vw - 240px)`,
    minHeight: '100vh'
  },
  contentShift: {
    width: `calc(100vw - ${240 + theme.spacing(6)}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  fakeToolbar: {
    ...theme.mixins.toolbar
  }
});

export default withRouter(withStyles(styles)(Layout));
