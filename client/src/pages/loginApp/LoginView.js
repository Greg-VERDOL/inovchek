import React, { useState, useContext, useEffect } from 'react';
import {
  Grid,
  CircularProgress,
  Typography,
  withStyles,
  Button,
  Tabs,
  TextField,
  Fade
} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';

const Login = ({ classes, ...props }) => {
  console.log(props);
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);

  const { setAlert } = alertContext;
  const { login, error, clearErrors, isAuthenticated } = authContext;

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push('/app/dashboard');
    }
    if (error === 'Invalid Credentials') {
      setAlert(error, 'danger');
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated, props.history]);

  const [user, setUser] = useState({
    email: '',
    password: ''
  });
  const { email, password } = user;

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (email === '' || password === '') {
      setAlert('Please fill in all fields', 'danger');
    } else {
      login({
        email,
        password
      });
    }
  };
  return (
    <Grid container className={classes.container}>
      <form onSubmit={onSubmit}>
        <div className={classes.formContainer}>
          <div className={classes.form}>
            <Tabs
              value={props.activeTabId}
              onChange={props.handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Typography
                label="Login"
                variant="h6"
                className={classes.greeting}
              >
                LOGIN
              </Typography>
              />
            </Tabs>
            <React.Fragment>
              <Typography variant="h1" className={classes.greeting}>
                Inovcheck{' '}
                <span role="img" aria-label="hi">
                  ✅
                </span>
              </Typography>
              <div className={classes.formDividerContainer}>
                <div className={classes.formDivider} />
                <div className={classes.formDivider} />
              </div>
              <Fade in={props.error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  Something is wrong with your login or password :(
                </Typography>
              </Fade>
              <TextField
                id="email"
                name="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField
                  }
                }}
                value={email}
                //onChange={e => props.handleInput(e, 'login')}
                margin="normal"
                placeholder="Email Address"
                type="email"
                onChange={onChange}
                fullWidth
                required
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
                //onChange={e => props.handleInput(e, 'password')}
                margin="normal"
                placeholder="Password"
                type="password"
                onChange={onChange}
                fullWidth
                required
              />
              <div className={classes.formButtons}>
                {props.isLoading ? (
                  <CircularProgress size={26} className={classes.loginLoader} />
                ) : (
                  <Button
                    type="submit"
                    disabled={
                      email.length === 0 ||
                      password.length === 0
                    }
                    onClick={props.handleLoginButtonClick}
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    Login
                  </Button>
                )}
                <Button
                  color="primary"
                  size="large"
                  className={classes.forgetButton}
                >
                  Forget Password
                </Button>
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
  googleButton: {
    marginTop: theme.spacing(6),
    boxShadow: theme.customShadows.widget,
    backgroundColor: 'white',
    width: '100%',
    textTransform: 'none'
  },
  googleButtonCreating: {
    marginTop: 0
  },
  googleIcon: {
    width: 30,
    marginRight: theme.spacing(2)
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
  forgetButton: {
    textTransform: 'none',
    fontWeight: 400
  },
  loginLoader: {
    marginLeft: theme.spacing(4)
  },
  copyright: {
    marginTop: theme.spacing(4),
    whiteSpace: 'nowrap',
    [theme.breakpoints.up('md')]: {
      position: 'absolute',
      bottom: theme.spacing(2)
    }
  }
});

export default withRouter(withStyles(styles, { withTheme: true })(Login));
