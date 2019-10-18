import React, { useState, useContext, useEffect, Fragment } from 'react';
import UserContext from '../../context/user/userContext';
import AuthContext from '../../context/auth/authContext';
import RegionContext from '../../context/region/regionContext';
import CountryContext from '../../context/country/countryContext';
import StoreContext from '../../context/store/storeContext';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import { getRole } from './RoleService';

const UserForm = props => {
  console.log('props', props);
  const userContext = useContext(UserContext);
  const authContext = useContext(AuthContext);
  const regionContext = useContext(RegionContext);
  const countryContext = useContext(CountryContext);
  const storeContext = useContext(StoreContext);

  const {
    addUser,
    updateUser,
    updateUserAsAdmin,
    clearCurrent,
    current,
    getUsers
  } = userContext;

  const { getRegions, regions } = regionContext;
  const { getCountries, countries } = countryContext;
  const { getStores, stores } = storeContext;

  useEffect(() => {
    setOpen(props.open);
    if (current !== null) {
      setUser(current);
    } else {
      setUser({
        email: '',
        role: ''
      });
    }
  }, [userContext, current, props.open]);

  useEffect(() => {
    getRegions();
    getStores();
    getCountries();
    // eslint-disable-next-line
  }, []);

  const [user, setUser] = useState({
    email: '',
    role: '',
    country: '',
    region: '',
    store: ''
  });

  // const [newUser, createUser] = useState({
  //   userEmail: '',
  //   userRole: '',
  //   userGeo: ''
  // });

  const { email, role, country, region, store } = user;

  // const { userEmail, userRole, userGeo } = newUser;

  const onChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // const onChangeCreate = e => {
  //   createUser({ ...newUser, [e.target.name]: e.target.value });
  // };

  // const onChangeGeo = e => {
  //   setUser({
  //     ...user,
  //     [e.target.name]: { name: '', id: e.target.value }
  //   });
  // };

  // const onSubmit = e => {
  //   e.preventDefault();
  //   console.log('current', current);
  //   if (current === null) {
  //     addUser(user);
  //   } else if (authContext.user.role === 'admin') {
  //     updateUserAsAdmin(user) && getUsers();
  //   } else {
  //     updateUser(user) && getUsers();
  //   }
  //   clearAll();
  // };

  const onSubmit = e => {
    e.preventDefault();
    console.log(user);
    addUser(user) && getUsers();
    clearAll();
  };

  console.log('state', user);

  const clearAll = () => {
    clearCurrent();
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const dynamicRole = () =>
    role === 'country'
      ? 'country'
      : role === 'region'
      ? 'region'
      : role === 'manager'
      ? 'store'
      : '';

  return (
    <div>
      <form onSubmit={onSubmit}>
        {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          Add User
        </Button> */}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Adding User</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Here you can create a user. The user will receive an email and
              will be able to fill in his full name and his password. Once this
              step is complete, this user's account will be active
            </DialogContentText>
            <br />
            <InputLabel>Email</InputLabel>
            <TextField
              margin="dense"
              id="email"
              type="email"
              name="email"
              onChange={onChange}
              value={email}
              fullWidth
            />
            <InputLabel>Role</InputLabel>
            <Select
              margin="dense"
              id="role"
              label="Role"
              type="text"
              name="role"
              onChange={onChange}
              value={role}
              fullWidth
            >
              {getRole().map(role => (
                <MenuItem value={role.toLowerCase()}>{role}</MenuItem>
              ))}
            </Select>
            {role !== 'admin' && role !== '' && (
              <Fragment>
                <InputLabel>{dynamicRole()}</InputLabel>
                <Select
                  margin="dense"
                  id="geo"
                  label={dynamicRole()}
                  type="text"
                  name={dynamicRole()}
                  onChange={onChange}
                  value={
                    role === 'country' && country
                      ? country
                      : role === 'region' && region
                      ? region
                      : role === 'manager' && store
                      ? store
                      : ''
                  }
                  fullWidth
                >
                  {role === 'country' &&
                    countries.map(country => (
                      <MenuItem value={country._id}>{country.name}</MenuItem>
                    ))}
                  {role === 'region' &&
                    regions.map(region => (
                      <MenuItem value={region._id}>{region.name}</MenuItem>
                    ))}
                  {role === 'manager' &&
                    stores.map(store => (
                      <MenuItem value={store._id}>{store.name}</MenuItem>
                    ))}
                </Select>
              </Fragment>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleClose();
                clearAll();
              }}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={e => {
                onSubmit(e);
                handleClose();
              }}
              color="primary"
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};

export default UserForm;
