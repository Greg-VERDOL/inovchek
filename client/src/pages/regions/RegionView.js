import React, { Fragment, useContext, useEffect } from 'react';
import RegionItem from './RegionItems';
import RegionForm from './RegionForm';
import RegionContext from '../../context/region/regionContext';
import RegionFilter from './RegionFilter';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Spinner from '../../components/Spinner/Spinner';
import PageTitle from '../../components/PageTitle/PageTitle';

const Regions = classes => {
  const regionContext = useContext(RegionContext);

  const { regions, filtered, getRegions, loading } = regionContext;
  console.log('regions', regions);

  useEffect(() => {
    getRegions();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      {regions !== null && !loading ? (
        <Grid container spacing={3}>
          <Grid item xs>
            <Fragment>
              <PageTitle title="Regions" />
              {filtered !== null
                ? filtered.map(region => (
                    <RegionItem key={region._id} region={region} open={''} />
                  ))
                : regions.map(region => (
                    <RegionItem key={region._id} region={region} open={''} />
                  ))}
            </Fragment>
          </Grid>
          <Grid item xs>
            <RegionFilter />
            <RegionForm />
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

export default withStyles(styles, { withTheme: true })(Regions);
