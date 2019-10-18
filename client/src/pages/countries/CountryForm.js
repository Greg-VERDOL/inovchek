import React, { Fragment, useState, useContext, useEffect } from 'react';
import CountryContext from '../../context/country/countryContext';
import {
  Grid,
  Typography,
  withStyles,
  CircularProgress,
  Button,
  TextField
} from '@material-ui/core';

const CountryForm = ({ classes, ...props }) => {
  const countryContext = useContext(CountryContext);

  const { addCountry, updateCountry, clearCurrent, current } = countryContext;

  useEffect(() => {
    if (current !== null) {
      setCountry(current);
    } else {
      setCountry({
        name: '',
        code: '',
        flag: '',
        text: ''
      });
    }
  }, [current]);

  const [country, setCountry] = useState({
    name: '',
    code: '',
    flag: '',
    text: ''
  });

  const { name, code, flag, text } = country;

  const onChange = e =>
    setCountry({ ...country, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (current === null) {
      addCountry(country);
    } else {
      updateCountry(country);
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
              <Typography
                label="Add"
                variant="h6"
                className={classes.addCountry}
              >
                {current ? 'Edit Country' : 'Add Country'}
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
                id="code"
                name="code"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField
                  }
                }}
                value={code}
                onChange={onChange}
                margin="normal"
                placeholder="code"
                type="text"
                fullWidth
              />
              <TextField
                id="flag"
                name="flag"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField
                  }
                }}
                value={flag}
                onChange={onChange}
                margin="normal"
                placeholder="flag"
                type="text"
                fullWidth
              />
              <TextField
                id="text"
                name="text"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField
                  }
                }}
                value={text}
                onChange={onChange}
                margin="normal"
                placeholder="free text"
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
                      code.length === 0 ||
                      flag.length === 0 ||
                      text.length === 0
                    }
                    onClick={props.handleLoginButtonClick}
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    {current ? 'Update Country' : 'Add Country'}
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
  addCountry: {
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

export default withStyles(styles, { withTheme: true })(CountryForm);
