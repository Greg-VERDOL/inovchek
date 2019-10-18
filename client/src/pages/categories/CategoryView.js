import React, { Fragment, useContext, useEffect } from 'react';
import AreaItem from './CategoryItems';
import AreaForm from './CategoryForm';
import AreaContext from '../../context/category/categoryContext';
import AreaFilter from './CategoryFilter';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Spinner from '../../components/Spinner/Spinner';
import PageTitle from '../../components/PageTitle/PageTitle';

const Areas = classes => {
  const categoryContext = useContext(AreaContext);

  const { categories, filtered, getCategories, loading } = categoryContext;

  useEffect(() => {
    getCategories();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      {categories !== null && !loading ? (
        <Grid container spacing={3}>
          <Grid item xs>
            <Fragment>
              <PageTitle title="Categories" />
              {filtered !== null
                ? filtered.map(category => (
                    <AreaItem
                      key={category._id}
                      category={category}
                      open={''}
                    />
                  ))
                : categories.map(category => (
                    <AreaItem
                      key={category._id}
                      category={category}
                      open={''}
                    />
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
