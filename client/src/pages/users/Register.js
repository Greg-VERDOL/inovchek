import React, { useState, useContext, useEffect } from 'react';
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

const Register = ({ classes, ...props }) => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  const { setAlert } = alertContext;
  const { register, error, clearErrors, msg } = authContext;

  useEffect(() => {
    if (error === 'Email already exists') {
      setAlert(error, 'danger');
      clearErrors();
    } else {
      if (msg === 'Email sent') {
        setAlert(msg, 'danger');
      }
    }
  }, [clearErrors, error, msg, setAlert]);

  const [user, setUser] = useState({
    email: '',
    role: ''
  });

  const { email, role } = user;

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (email === '' || role === '') {
      setAlert('Please enter all fields', 'danger');
    } else {
      register({
        email,
        role
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
                Create a User
              </Typography>
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
                onChange={onChange}
                placeholder="Email Address"
                type="text"
                fullWidth
                required
              />
              <FormControl className={classes.formControl}>
                <InputLabel required htmlFor="role">
                  Role
                </InputLabel>
                <Select
                  value={role}
                  onChange={onChange}
                  name="role"
                  InputProps={{
                    id: 'role',
                    classes: {
                      notchedOutline: classes.mainChartSelectRoot,
                      input: classes.mainChartSelect
                    }
                  }}
                  className={classes.selectEmpty}
                  autoWidth
                  type="text"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={'admin'}>Admin</MenuItem>
                  <MenuItem value={'country'}>Country</MenuItem>
                  <MenuItem value={'region'}>Region</MenuItem>
                  <MenuItem value={'manager'}>Manager</MenuItem>
                </Select>
                <FormHelperText>Required</FormHelperText>
              </FormControl>
              <div className={classes.creatingButtonContainer}>
                {props.isLoading ? (
                  <CircularProgress size={26} />
                ) : (
                  <Button
                    type="submit"
                    disabled={email.length === 0}
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

export default withStyles(styles, { withTheme: true })(Register);
