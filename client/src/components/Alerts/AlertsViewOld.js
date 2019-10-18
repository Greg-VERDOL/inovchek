import React, { useContext } from 'react';
import AlertContext from '../../context/alert/alertContext';
import { withStyles } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CloseButton = ({ closeToast, className }) => (
  <CloseIcon className={className} onClick={closeToast} />
);

const AlertsView = classes => {
  const alertContext = useContext(AlertContext);

  return (
    alertContext.alerts.length > 0 &&
    alertContext.alerts.map(alert => (
      <div key={alert.id}>
        {console.log(classes)}
        <ToastContainer
          position="top-right"
          hideProgressBar={true}
          autoClose={false}
          closeButton={
            <CloseButton className={classes.notificationCloseButton} />
          }
          closeOnClick={false}
          progressClassName={classes.notificationProgress}
          newestOnTop={false}
          draggable={true}
          rtl={true}
        />
      </div>
    ))
  );
};

const styles = theme => ({
  notificationCloseButton: {
    position: 'absolute',
    right: theme.spacing(2)
  }
});

// export default AlertsView;

export default withStyles(styles, { withTheme: true })(AlertsView);
