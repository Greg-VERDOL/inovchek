import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Register from './Register';

import PageTitle from '../../components/PageTitle/PageTitle';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
}));

const Users = (...props) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Fragment>
          <PageTitle title="Users" />
          <Register />
        </Fragment>
      </Grid>
    </div>
  );
};

export default Users;
