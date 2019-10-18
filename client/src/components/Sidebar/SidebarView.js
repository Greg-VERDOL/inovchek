import React, { useContext } from 'react';
import { Drawer, IconButton, List, withStyles } from '@material-ui/core';
import {
  Home as HomeIcon,
  NotificationsNone as NotificationsIcon,
  FormatSize as TypographyIcon,
  FilterNone as UIElementsIcon,
  BorderAll as TableIcon,
  QuestionAnswer as SupportIcon,
  LibraryBooks as LibraryIcon,
  HelpOutline as FAQIcon,
  ArrowBack as ArrowBackIcon,
  Store as StoreIcon,
  People as UserIcon,
  Explore as ExploreIcon
} from '@material-ui/icons';
import classNames from 'classnames';
import AuthContext from '../../context/auth/authContext';

import SidebarLink from './components/SidebarLink/SidebarLinkContainer';
// import Dot from './components/Dot';

const structure = [
  {
    id: 0,
    label: 'Dashboard',
    link: '/app/dashboard',
    icon: <HomeIcon />,
    role: ['admin', 'country', 'region', 'manager']
  },
  {
    id: 1,
    label: 'Typography',
    link: '/app/typography',
    icon: <TypographyIcon />,
    role: ['admin', 'country', 'region', 'manager']
  },
  {
    id: 2,
    label: 'Tables',
    link: '/app/tables',
    icon: <TableIcon />,
    role: ['admin', 'country', 'region', 'manager']
  },
  {
    id: 3,
    label: 'Notifications',
    link: '/app/notifications',
    icon: <NotificationsIcon />,
    role: ['admin', 'country', 'region', 'manager']
  },
  {
    id: 4,
    label: 'UI Elements',
    link: '/app/ui',
    icon: <UIElementsIcon />,
    children: [
      { label: 'Icons', link: '/app/ui/icons' },
      { label: 'Charts', link: '/app/ui/charts' },
      { label: 'Maps', link: '/app/ui/maps' }
    ],
    role: ['admin', 'country', 'region', 'manager']
  },
  {
    id: 12,
    label: 'Explore Stores',
    link: '/app/ui',
    icon: <ExploreIcon />,
    children: [
      { label: 'Regions', link: '/app/regions' },
      { label: 'Country', link: '/app/countries' }
    ],
    role: ['admin', 'country', 'region', 'manager']
  },
  {
    id: 10,
    label: 'Stores',
    link: '/app/stores',
    icon: <StoreIcon />,
    role: ['admin', 'country', 'region', 'manager']
  },
  {
    id: 11,
    label: 'Users',
    link: '/app/users',
    icon: <UserIcon />,
    role: ['admin', 'country', 'region']
  },
  { id: 5, type: 'divider' },
  { id: 6, type: 'title', label: 'HELP' },
  { id: 7, label: 'Library', link: '', icon: <LibraryIcon /> },
  { id: 8, label: 'Support', link: '', icon: <SupportIcon /> },
  { id: 9, label: 'FAQ', link: '', icon: <FAQIcon /> }
  // { id: 10, type: 'divider' },
  // { id: 11, type: 'title', label: 'PROJECTS' },
  // {
  //   id: 12,
  //   label: 'My recent',
  //   link: '',
  //   icon: <Dot size="large" color="error" />
  // },
  // {
  //   id: 13,
  //   label: 'Starred',
  //   link: '',
  //   icon: <Dot size="large" color="primary" />
  // },
  // {
  //   id: 14,
  //   label: 'Background',
  //   link: '',
  //   icon: <Dot size="large" color="secondary" />
  // }
];

// const SidebarView = ({
//   classes,
//   theme,
//   toggleSidebar,
//   isSidebarOpened,
//   isPermanent,
//   location
// }) => {
//   const authContext = useContext(AuthContext);
//   authContext.user && console.log(authContext.user.role);
//   return (
//     <Drawer
//       variant={isPermanent ? 'permanent' : 'temporary'}
//       className={classNames(classes.drawer, {
//         [classes.drawerOpen]: isSidebarOpened,
//         [classes.drawerClose]: !isSidebarOpened
//       })}
//       classes={{
//         paper: classNames({
//           [classes.drawerOpen]: isSidebarOpened,
//           [classes.drawerClose]: !isSidebarOpened
//         })
//       }}
//       open={isSidebarOpened}
//     >
//       <div className={classes.toolbar} />
//       <div className={classes.mobileBackButton}>
//         <IconButton onClick={toggleSidebar}>
//           <ArrowBackIcon
//             classes={{
//               root: classNames(classes.headerIcon, classes.headerIconCollapse)
//             }}
//           />
//         </IconButton>
//       </div>
//       <List className={classes.sidebarList}>
//         {structure.map(
//           link =>
//             link &&
//             link.role &&
//             link.role.includes(authContext.user && authContext.user.role) && (
//               <SidebarLink
//                 key={link.id}
//                 location={location}
//                 isSidebarOpened={isSidebarOpened}
//                 {...link}
//               />
//             )
//         )}
//       </List>
//     </Drawer>
//   );
// };

const SidebarView = ({
  classes,
  theme,
  toggleSidebar,
  isSidebarOpened,
  isPermanent,
  location
}) => {
  return (
    <Drawer
      variant={isPermanent ? 'permanent' : 'temporary'}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened
        })
      }}
      open={isSidebarOpened}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={toggleSidebar}>
          <ArrowBackIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse)
            }}
          />
        </IconButton>
      </div>
      <List className={classes.sidebarList}>
        {structure.map(link => (
          <SidebarLink
            key={link.id}
            location={location}
            isSidebarOpened={isSidebarOpened}
            {...link}
          />
        ))}
      </List>
    </Drawer>
  );
};

const drawerWidth = 240;

const styles = theme => ({
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 40,
    [theme.breakpoints.down('sm')]: {
      width: drawerWidth
    }
  },
  toolbar: {
    ...theme.mixins.toolbar,
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  sidebarList: {
    marginTop: theme.spacing(6)
  },
  mobileBackButton: {
    marginTop: theme.spacing(0.5),
    marginLeft: theme.spacing(3),
    [theme.breakpoints.only('sm')]: {
      marginTop: theme.spacing(0.625)
    },
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  }
});

export default withStyles(styles, { withTheme: true })(SidebarView);
