import React, { Fragment, useContext, useEffect } from 'react';
import UserItem from './UserItems';
import UserForm from './UserForm';
import UserContext from '../../context/user/userContext';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import UserFilter from './UserFilter';
import Spinner from '../../components/Spinner/Spinner';
import PageTitle from '../../components/PageTitle/PageTitle';
// import mock from './mock';
import Table from './components/Table';
import Widget from '../../components/Widget';

const Users = classes => {
  const userContext = useContext(UserContext);

  const { users, filtered, getUsers, loading, clearUsers } = userContext;

  useEffect(() => {
    clearUsers();
    getUsers();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      {users !== null && !loading ? (
        <Grid container spacing={32}>
          <Grid item xs={12}>
            <UserFilter />
            <UserForm />
            <br />
            <Grid item>
              <Table />
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
});

export default withStyles(styles, { withTheme: true })(Users);
