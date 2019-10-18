import React, { Fragment, useContext, useEffect } from 'react';
import StoreItem from './StoreItems';
import StoreForm from './StoreForm';
import StoreContext from '../../context/store/storeContext';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import StoreFilter from './StoreFilter';
import Spinner from '../../components/Spinner/Spinner';
import PageTitle from '../../components/PageTitle/PageTitle';

const Stores = classes => {
  const storeContext = useContext(StoreContext);

  const { stores, filtered, getStores, loading } = storeContext;
  console.log(storeContext);

  useEffect(() => {
    getStores();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      {stores !== null && !loading ? (
        <Grid container spacing={3}>
          <Grid item xs>
            <Fragment>
              <PageTitle title="Stores" />
              {filtered !== null
                ? filtered.map(store => (
                    <StoreItem key={store._id} store={store} open={''} />
                  ))
                : stores.map(store => (
                    <StoreItem key={store._id} store={store} open={''} />
                  ))}
            </Fragment>
          </Grid>
          <Grid item xs>
            <StoreFilter />
            <StoreForm />
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

export default withStyles(styles, { withTheme: true })(Stores);
