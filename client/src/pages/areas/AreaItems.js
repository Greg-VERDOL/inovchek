import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import AreaContext from '../../context/area/areaContext';
import Widget from '../../components/Widget/WidgetContainer';
import { Typography } from '../../components/Wrappers/Wrappers';
import { Grid, withStyles, Button, Menu, MenuItem } from '@material-ui/core';

const AreaItems = ({
  area,
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
  const areaContext = useContext(AreaContext);
  const { deleteArea, setCurrent, clearCurrent } = areaContext;

  const { _id, name, icon, color, country, checkpoint } = area;
  console.log('area', area);

  const onDelete = () => {
    deleteArea(_id);
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
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid item>
                <Typography color="textSecondary">Icon</Typography>
                <Typography size="xs">{icon}</Typography>
              </Grid>
              <Grid item>
                <Typography color="textSecondary">Color</Typography>
                <Typography size="xs">{color}</Typography>
              </Grid>
              <Grid item>
                <Typography color="textSecondary">Country</Typography>
                <Typography size="xs">{country ? country.name : ''}</Typography>
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
                onClick={() => setCurrent(area)}
              >
                Edit
              </Button>
            </Grid>
            <Menu
              id="widget-menu"
              open={props.isMoreMenuOpen}
              anchorEl={props.moreButtonRef}
              onClose={() => props.setMoreMenuOpen(false)}
              disableAutoFocusItem
            >
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

AreaItems.propTypes = {
  area: PropTypes.object.isRequired
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

export default withStyles(styles, { withTheme: true })(AreaItems);
