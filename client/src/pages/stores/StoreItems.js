import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import StoreContext from '../../context/store/storeContext';
import Widget from '../../components/Widget';
import { Typography } from '../../components/Wrappers';
import {
  Grid,
  withStyles,
  Button,
  IconButton,
  Menu,
  MenuItem
} from '@material-ui/core';
import { MoreVert as MoreIcon } from '@material-ui/icons';

const StoreItems = ({
  store,
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
  const storeContext = useContext(StoreContext);
  const { deleteStore, setCurrent, clearCurrent } = storeContext;

  const { _id, name, address, phone, region, country, store_type } = store;

  const onDelete = () => {
    deleteStore(_id);
    clearCurrent();
  };
  return (
    <Fragment>
      <Grid container spacing={3}>
        <Grid item xs>
          <Widget
            title={name}
            upperTitle
            bodyClass={classes.fullHeightBody}
            className={classes.card}
          >
            {!disableWidgetMenu && (
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
            )}
            <div className={classes.address}>
              <Typography size="xs" weight="medium">
                {address}
              </Typography>
            </div>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid item>
                <Typography color="textSecondary">Phone</Typography>
                <Typography size="xs">{phone}</Typography>
              </Grid>
              <Grid item>
                <Typography color="textSecondary">Country</Typography>
                <Typography size="xs">{country.name}</Typography>
              </Grid>
              <Grid item>
                <Typography color="textSecondary">Region</Typography>
                <Typography size="xs">{region ? region.name : ''}</Typography>
              </Grid>
              <Grid item>
                <Typography color="textSecondary">Store Type</Typography>
                <Typography size="xs">
                  {store_type ? store_type.name : ''}
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
                onClick={() => setCurrent(store)}
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

StoreItems.propTypes = {
  store: PropTypes.object.isRequired
};

const styles = theme => ({
  card: {
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  address: {
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

export default withStyles(styles, { withTheme: true })(StoreItems);
