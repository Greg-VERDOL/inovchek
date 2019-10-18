import React, { Fragment, useState, useContext, useEffect } from 'react';
import {
  Grid,
  Typography,
  withStyles,
  CircularProgress,
  Button,
  TextField
} from '@material-ui/core';
import CategoryContext from '../../context/category/categoryContext';

const CategoryForm = ({ classes, ...props }) => {
  const categoryContext = useContext(CategoryContext);

  const { addCategory, updateCategory, clearCurrent, current } = categoryContext;

  useEffect(() => {
    if (current !== null) {
      setCategory(current);
    } else {
      setCategory({
        name: '',
        icon: '',
        color: '',
        country: { name: '' }
      });
    }
  }, [categoryContext, current]);

  const [category, setCategory] = useState({
    name: '',
    icon: '',
    color: '',
    country: { name: '' }
  });

  const { name, icon, color, country } = category;

  const onChange = e => setCategory({ ...category, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (current === null) {
      addCategory(category);
    } else {
      updateCategory(category);
    }
    clearAll();
  };

  const clearAll = () => {
    clearCurrent();
  };

  return (
    <Fragment>
      <Grid item xs>
        <form onSubmit={onSubmit}>
          <div className={classes.formContainer}>
            <div className={classes.form}>
              <Typography label="Add" variant="h6" className={classes.addCategory}>
                {current ? 'Edit Category' : 'Add Category'}
              </Typography>
              <TextField
                id="name"
                name="name"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField
                  }
                }}
                value={name}
                onChange={onChange}
                margin="normal"
                placeholder="name"
                type="text"
                fullWidth
              />
              <TextField
                id="icon"
                name="icon"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField
                  }
                }}
                value={icon}
                onChange={onChange}
                margin="normal"
                placeholder="icon"
                type="text"
                fullWidth
              />
              <TextField
                id="color"
                name="color"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField
                  }
                }}
                value={color}
                onChange={onChange}
                margin="normal"
                placeholder="color"
                type="text"
                fullWidth
              />

              <TextField
                id="country"
                name="country"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField
                  }
                }}
                value={country.name}
                onChange={onChange}
                margin="normal"
                placeholder="country"
                type="text"
                fullWidth
              />
              <div className={classes.formButtons}>
                {props.isLoading ? (
                  <CircularProgress size={26} className={classes.loginLoader} />
                ) : (
                  <Button
                    type="submit"
                    disabled={
                      name.length === 0 ||
                      country.length === 0 ||
                      icon.length === 0 ||
                      color.length === 0
                    }
                    onClick={props.handleLoginButtonClick}
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    {current ? 'Update Category' : 'Add Category'}
                  </Button>
                )}
                {current && (
                  <div>
                    <Button
                      onClick={clearAll}
                      variant="contained"
                      color="primary"
                      size="large"
                    >
                      {' '}
                      Clear
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </Grid>
    </Fragment>
  );
};

const styles = theme => ({
  logotypeContainer: {
    backgroundColor: theme.palette.primary.main,
    width: '60%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      width: '50%'
    },
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  logotypeImage: {
    width: 165,
    marginBottom: theme.spacing(4)
  },
  logotypeText: {
    color: 'white',
    fontWeight: 500,
    fontSize: 84,
    [theme.breakpoints.down('md')]: {
      fontSize: 48
    }
  },
  formContainer: {
    width: '40%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      width: '50%'
    }
  },
  form: {
    marginTop: 20,
    justifyContent: 'space-between',
    width: 320
  },
  tab: {
    fontWeight: 400,
    fontSize: 18
  },
  addCategory: {
    fontWeight: 500,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  },
  subGreeting: {
    fontWeight: 500,
    textAlign: 'center',
    marginTop: theme.spacing(2)
  },
  creatingButtonContainer: {
    marginTop: theme.spacing(2.5),
    height: 46,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  createAccountButton: {
    height: 46,
    textTransform: 'none'
  },
  formDividerContainer: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    display: 'flex',
    alignItems: 'center'
  },
  formDividerWord: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  formDivider: {
    flexGrow: 1,
    height: 1,
    backgroundColor: theme.palette.text.hint + '40'
  },
  errorMessage: {
    textAlign: 'center'
  },
  textFieldUnderline: {
    '&:before': {
      borderBottomColor: theme.palette.primary.light
    },
    '&:after': {
      borderBottomColor: theme.palette.primary.main
    },
    '&:hover:before': {
      borderBottomColor: `${theme.palette.primary.light} !important`
    }
  },
  textField: {
    borderBottomColor: theme.palette.background.light
  },
  formButtons: {
    width: '100%',
    marginTop: theme.spacing(4),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  loginLoader: {
    marginLeft: theme.spacing(4)
  }
});

export default withStyles(styles, { withTheme: true })(CategoryForm);
