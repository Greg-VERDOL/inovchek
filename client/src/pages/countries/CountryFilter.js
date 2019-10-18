import React, { useContext, useRef, useEffect } from 'react';
import CountryContext from '../../context/country/countryContext';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, InputBase, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const CountryFilter = () => {
  const countryContext = useContext(CountryContext);
  const text = useRef('');

  const { filterCountries, clearFilter, filtered } = countryContext;

  useEffect(() => {
    if (filtered === null) {
      text.current.value = '';
    }
  });

  const onChange = e => {
    if (text.current.value !== '') {
      filterCountries(e.target.value);
    } else {
      clearFilter();
    }
  };

  const useStyles = makeStyles({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 400
    },
    input: {
      marginLeft: 8,
      flex: 1
    },
    iconButton: {
      padding: 10
    },
    divider: {
      width: 1,
      height: 28,
      margin: 4
    }
  });
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <InputBase
        inputRef={text}
        type="text"
        className={classes.input}
        placeholder="Search Countries"
        onChange={onChange}
      />
      <IconButton className={classes.iconButton} aria-label="Search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default CountryFilter;
