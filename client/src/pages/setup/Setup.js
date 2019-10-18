import React, { useState, useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';

import {
  Grid,
  CircularProgress,
  Typography,
  withStyles,
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormControl
} from '@material-ui/core';

const SetupUser = ({ classes, ...props }) => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  const { setAlert } = alertContext;
  const { setup, error, clearErrors, isAuthenticated } = authContext;
  console.log(authContext);

  useEffect(() => {
    if (
      error === 'This token is not valid' ||
      error === `User token and your token didn't match` ||
      error ===
        `User token and your token didn't match. You may have a more recent token in your mail list.` ||
      error === 'Token has expired' ||
      error === 'Your password must be at least 6 characters'
    ) {
      setAlert(error, 'danger');
      clearErrors();
    }
    if (isAuthenticated) {
      props.history.replace('/app/dashboard');
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated, props.history]);

  const [user, setUser] = useState({
    name: '',
    password: ''
  });

  const { name, password } = user;

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (name === '' || password === '') {
      setAlert('Please enter all fields');
    } else {
      setup({
        name,
        password
      });
    }
  };

  return (
    <Grid container className={classes.container}>
      <form onSubmit={onSubmit}>
        <div className={classes.formContainer}>
          <div className={classes.form}>
            <React.Fragment>
              <Typography variant="h2" className={classes.subGreeting}>
                Setup your account
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
                placeholder="Fullname"
                type="text"
                fullWidth
              />
              <TextField
                id="password"
                name="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField
                  }
                }}
                value={password}
                onChange={onChange}
                placeholder="Password"
                type="password"
                autoComplete="current-password"
                fullWidth
              />
              <div className={classes.creatingButtonContainer}>
                {props.isLoading ? (
                  <CircularProgress size={26} />
                ) : (
                  <Button
                    //onClick={props.handleLoginButtonClick}
                    type="submit"
                    disabled={name.length === 0 || password.length === 0}
                    size="large"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className={classes.createAccountButton}
                  >
                    Create
                  </Button>
                )}
              </div>
            </React.Fragment>
          </div>
        </div>
      </form>
    </Grid>
  );
};

const styles = theme => ({
  container: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0
  },
  formContainer: {
    width: '40%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      width: '50%'
    }
  },
  form: {
    width: 320
  },
  tab: {
    fontWeight: 400,
    fontSize: 18
  },
  greeting: {
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
  },
  formControl: {
    minWidth: 320
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  mainChartSelectRoot: {
    borderColor: theme.palette.text.hint + '80 !important'
  },
  mainChartSelect: {
    padding: 10,
    paddingRight: 25
  }
});

export default withRouter(withStyles(styles, { withTheme: true })(SetupUser));
