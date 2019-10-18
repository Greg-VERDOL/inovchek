import React, { Fragment, useState, useContext, useEffect } from 'react';
import {
  Grid,
  Typography,
  withStyles,
  CircularProgress,
  Button,
  TextField
} from '@material-ui/core';
import StoreContext from '../../context/store/storeContext';

const StoreForm = ({ classes, ...props }) => {
  const storeContext = useContext(StoreContext);
  console.log(storeContext);

  const {
    addStore,
    updateStore,
    clearCurrent,
    current,
    getStores
  } = storeContext;

  useEffect(() => {
    if (current !== null) {
      setStore(current);
    } else {
      setStore({
        name: '',
        address: '',
        phone: '',
        region: { name: '' },
        country: { name: '' },
        store_type: { name: '' }
      });
    }
  }, [storeContext, current]);

  const [store, setStore] = useState({
    name: '',
    address: '',
    phone: '',
    region: { name: '' },
    country: { name: '' },
    store_type: { name: '' }
  });

  const { name, address, phone, region, country, store_type } = store;

  const onChange = e => setStore({ ...store, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (current === null) {
      addStore(store);
    } else {
      updateStore(store) && getStores();
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
              <Typography label="Add" variant="h6" className={classes.addStore}>
                {current ? 'Edit Store' : 'Add Store'}
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
                id="address"
                name="address"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField
                  }
                }}
                value={address}
                onChange={onChange}
                margin="normal"
                placeholder="address"
                type="text"
                fullWidth
              />
              <TextField
                id="phone"
                name="phone"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField
                  }
                }}
                value={phone}
                onChange={onChange}
                margin="normal"
                placeholder="phone"
                type="text"
                fullWidth
              />
              <TextField
                id="region"
                name="region"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField
                  }
                }}
                value={region.name}
                onChange={onChange}
                margin="normal"
                placeholder="region"
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
              <TextField
                id="store_type"
                name="store_type"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField
                  }
                }}
                value={store_type.name}
                onChange={onChange}
                margin="normal"
                placeholder="store_type"
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
                      address.length === 0 ||
                      phone.length === 0 ||
                      country.length === 0 ||
                      region.length === 0 ||
                      store_type.length === 0
                    }
                    onClick={props.handleLoginButtonClick}
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    {current ? 'Update Store' : 'Add Store'}
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
  addStore: {
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

export default withStyles(styles, { withTheme: true })(StoreForm);
