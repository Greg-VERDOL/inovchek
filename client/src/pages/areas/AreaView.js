import React, { Fragment, useContext, useEffect } from 'react';
import AreaItem from './AreaItems';
import AreaForm from './AreaForm';
import AreaContext from '../../context/area/areaContext';
import AreaFilter from './AreaFilter';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Spinner from '../../components/Spinner/Spinner';
import PageTitle from '../../components/PageTitle/PageTitle';

const Areas = classes => {
  const areaContext = useContext(AreaContext);

  const { areas, filtered, getAreas, loading } = areaContext;

  useEffect(() => {
    getAreas();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      {areas !== null && !loading ? (
        <Grid container spacing={3}>
          <Grid item xs>
            <Fragment>
              <PageTitle title="Areas" />
              {filtered !== null
                ? filtered.map(area => (
                    <AreaItem key={area._id} area={area} open={''} />
                  ))
                : areas.map(area => (
                    <AreaItem key={area._id} area={area} open={''} />
                  ))}
            </Fragment>
          </Grid>
          <Grid item xs>
            <AreaFilter />
            <AreaForm />
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

export default withStyles(styles, { withTheme: true })(Areas);
