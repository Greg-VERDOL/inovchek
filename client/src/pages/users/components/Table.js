import React, {
  useContext,
  useState,
  forwardRef,
  useEffect,
  Fragment
} from 'react';
import { withStyles } from '@material-ui/core';
import UserContext from '../../../context/user/userContext';
import AuthContext from '../../../context/auth/authContext';
import { Button } from '../../../components/Wrappers';
import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import UserForm from '../UserForm.js';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const TableComponent = ({ classes }) => {
  const userContext = useContext(UserContext);
  const authContext = useContext(AuthContext);

  const {
    users,
    deleteUser,
    setCurrent,
    clearCurrent,
    current,
    updateUser,
    updateUserAsAdmin,
    getUsers
  } = userContext;

  const [editable, setEditable] = useState(false);
  //const { _id } = users;

  useEffect(() => {
    getUsers();
    console.log('users 2', users);
    //eslint-disable-next-line
  }, []);

  const onDelete = id => {
    deleteUser(id);
    clearCurrent();
  };

  const [user, setUser] = useState({
    name: '',
    email: '',
    role: '',
    geo: '',
    store: { name: '' },
    region: { name: '' },
    country: { name: '' }
  });

  const {
    _id,
    name,
    email,
    role,
    geo,
    store,
    region,
    country,
    isActive
  } = user;

  const customUsers = users.map(item =>
    item.country
      ? {
          ...item,
          geo: item.country && item.country.name,
          isActive:
            !item.isActive && item.desactivated
              ? 'Desactivated'
              : item.isActive
              ? 'Active'
              : 'Pending'
        }
      : item.store
      ? {
          ...item,
          geo: item.store.name,
          isActive:
            !item.isActive && item.desactivated
              ? 'Desactivated'
              : item.isActive
              ? 'Active'
              : 'Pending'
        }
      : item.region
      ? {
          ...item,
          geo: item.region.name,
          isActive:
            !item.isActive && item.desactivated
              ? 'Desactivated'
              : item.isActive
              ? 'Active'
              : 'Pending'
        }
      : {
          ...item,
          isActive:
            !item.isActive && item.desactivated
              ? 'Desactivated'
              : item.isActive
              ? 'Active'
              : 'Pending',
          geo: item.isActive ? 'admin' : ''
        }
  );

  console.log('users', users);
  console.log('customUser', customUsers);

  const editUser = id => {
    if (authContext.user.role === 'admin') {
      //updateUserAsAdmin(user) && getUsers();
      setCurrent(user, id);
      setEditable(!editable);
    } else {
      updateUser(user) && getUsers();
      setCurrent(user, id);
      setEditable(!editable);
    }
  };

  const [state, setState] = useState({
    columns: [
      { title: 'Name', field: 'name' },
      { title: 'Email', field: 'email' },
      {
        title: 'Role',
        field: 'role',
        lookup: { country: 'country', region: 'region', manager: 'manager' }
      },
      {
        title: 'Lien Géo',
        field: 'geo'
      },
      {
        title: 'Status',
        field: 'isActive',
        lookup: {
          Active: 'Active',
          Desactivated: 'Desactivated'
        },
        render: data =>
          data.isActive === 'Active' ? (
            <Button variant="contained" color="primary">
              Active
            </Button>
          ) : data.isActive === 'Desactivated' ? (
            <Button variant="contained" color="secondary">
              Desactivated
            </Button>
          ) : (
            <Button variant="contained" color="secondary">
              Pending
            </Button>
          )
      }
    ],
    data: customUsers
  });

  const [open, setOpen] = React.useState(false);

  const autoClose = () => setTimeout(() => setOpen(false), 5000);
  return (
    <Fragment>
      <MaterialTable
        icons={tableIcons}
        title="Users List"
        columns={state.columns}
        data={state.data}
        options={{
          actionsColumnIndex: -1
        }}
        editable={{
          // onRowAdd: newData =>
          //   new Promise(resolve => {
          //     setTimeout(() => {
          //       resolve();
          //       const data = [...state.data];
          //       data.push(newData);
          //       setState({ ...state, data });
          //     }, 600);
          //   }),
          onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                const data = [...state.data];
                data[data.indexOf(oldData)] = newData;
                console.log('oldData', oldData, 'newData', newData);
                setState({ ...state, data });
              }, 600);
            }),
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                const data = [...state.data];
                data.splice(data.indexOf(oldData), 1);
                setState({ ...state, data });
              }, 600);
            })
        }}
        actions={[
          {
            icon: AddBox,
            tooltip: 'Add User',
            isFreeAction: true,
            onClick: () => {
              setOpen(true);
              autoClose();
            }
          }
        ]}
      />
      {<UserForm open={open} />}
    </Fragment>
  );
};

const styles = theme => ({
  button: {
    margin: theme.spacing()
  }
});

export default withStyles(styles, { withTheme: true })(TableComponent);
