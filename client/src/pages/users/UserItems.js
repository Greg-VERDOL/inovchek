import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import UserContext from '../../context/user/userContext';
import Widget from '../../components/Widget/WidgetContainer';
import { Typography } from '../../components/Wrappers/Wrappers';
import { Grid, withStyles, Button, Menu, MenuItem } from '@material-ui/core';
const UserItems = ({
  user,
  classes,
  theme,
  disableWidgetMenu,
  children,
  title,
  noBodyPadding,
  bodyClass,
  className,
  ...props
}) => {
  const userContext = useContext(UserContext);
  const { deleteUser, setCurrent, clearCurrent } = userContext;

  const { _id, name, email, role, store, country, region } = user;

  const onDelete = () => {
    deleteUser(_id);
    clearCurrent();
  };
  return (
    <Fragment>
      <Grid container spacing={3}>
        <Grid item xs>
          <Widget
            title={name ? name : 'ACTIVATION IN PROGRESS'}
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            {/* {!disableWidgetMenu && (
              <IconButton
                color="primary"
                classes={{ root: classes.moreButton }}
                aria-owns="widget-menu"
                aria-haspopup="true"
                onClick={() => console.log(props)}
                buttonRef={props.setMoreButtonRef}
              >
                <MoreIcon />
              </IconButton>
            )} */}
            <div className={classes.email}>
              <Typography size="xs" weight="medium">
                {email}
              </Typography>
            </div>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid item>
                <Typography color="textSecondary">Role</Typography>
                <Typography size="xs">{role}</Typography>
              </Grid>
              <Grid item>
                <Typography color="textSecondary">
                  {store
                    ? 'Store'
                    : region
                    ? 'Region'
                    : country
                    ? 'Country'
                    : ''}
                </Typography>
                <Typography size="xs">
                  {store
                    ? store.name
                    : region
                    ? region.name
                    : country
                    ? country.name
                    : ''}
                </Typography>
              </Grid>
            </Grid>
            <Grid container className={classes.margin}>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                className={classes.margin}
                onClick={onDelete}
              >
                Delete
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                className={classes.margin}
                onClick={() => setCurrent(user)}
              >
                Edit
              </Button>
            </Grid>
            <Menu>
              <MenuItem>
                <Typography>Edit</Typography>
              </MenuItem>
              <MenuItem>
                <Typography>Delete</Typography>
              </MenuItem>
            </Menu>
          </Widget>
        </Grid>
      </Grid>
    </Fragment>
  );
};

UserItems.propTypes = {
  user: PropTypes.object.isRequired
};

const styles = theme => ({
  card: {
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  email: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    paddingBottom: theme.spacing(1)
  },
  fullHeightBody: {
    display: 'flex',
    flexGrow: 2,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  tableWidget: {
    overflowX: 'auto'
  },
  button: {
    margin: theme.spacing()
  },
  widgetWrapper: {
    display: 'flex',
    minHeight: '100%'
  },
  widgetHeader: {
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  widgetRoot: {
    boxShadow: theme.customShadows.widget
  },
  widgetBody: {
    paddingBottom: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3)
  },
  noPadding: {
    padding: 0
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'hidden'
  },
  moreButton: {
    margin: -theme.spacing(1),
    padding: 0,
    width: 40,
    height: 40,
    color: theme.palette.text.hint,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: 'rgba(255, 255, 255, 0.35)'
    }
  }
});

export default withStyles(styles, { withTheme: true })(UserItems);
