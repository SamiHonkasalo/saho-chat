import { useContext, useCallback } from 'react';
import { UIContext } from '../../store/ui/uiContext';
import { UITypes } from '../../store/ui/uiReducer';

function useNotification() {
  const { dispatch } = useContext(UIContext);

  const notify = useCallback(
    (notification: NotificationType) => {
      dispatch({
        type: UITypes.ADD_NOTIFICATION,
        payload: {
          message: notification.message,
          hideDuration: notification.hideDuration,
          type: notification.type,
        },
      });
    },
    [dispatch]
  );
  return notify;
}

export default useNotification;
