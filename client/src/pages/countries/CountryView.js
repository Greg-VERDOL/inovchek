import React, { Fragment, useContext, useEffect } from 'react';
import CountryContext from '../../context/country/countryContext';
import CountryItem from './CountryItems';
import CountryForm from './CountryForm';
import CountryFilter from './CountryFilter';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Spinner from '../../components/Spinner/Spinner';
import PageTitle from '../../components/PageTitle/PageTitle';

const Countries = classes => {
  const countryContext = useContext(CountryContext);
  console.log('hello', countryContext);
  const { countries, filtered, getCountries, loading } = countryContext;

  useEffect(() => {
    getCountries();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      {countries !== null && !loading ? (
        <Grid container spacing={3}>
          <Grid item xs>
            <Fragment>
              <PageTitle title="Countries" />
              {filtered !== null
                ? filtered.map(country => (
                    <CountryItem
                      key={country._id}
                      country={country}
                      open={''}
                    />
                  ))
                : countries.map(country => (
                    <CountryItem
                      key={country._id}
                      country={country}
                      open={''}
                    />
                  ))}
            </Fragment>
          </Grid>
          <Grid item xs>
            <CountryFilter />
            <CountryForm />
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

export default withStyles(styles, { withTheme: true })(Countries);
