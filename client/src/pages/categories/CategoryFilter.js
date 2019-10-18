import React, { useContext, useRef, useEffect } from 'react';
import CategoryContext from '../../context/category/categoryContext';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, InputBase, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const CategoryFilter = () => {
  const categoryContext = useContext(CategoryContext);
  const text = useRef('');

  const { filterCategories, clearFilter, filtered } = categoryContext;

  useEffect(() => {
    if (filtered === null) {
      text.current.value = '';
    }
  });

  const onChange = e => {
    if (text.current.value !== '') {
      filterCategories(e.target.value);
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
        placeholder="Search Categories"
        onChange={onChange}
      />
      <IconButton className={classes.iconButton} aria-label="Search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default CategoryFilter;
