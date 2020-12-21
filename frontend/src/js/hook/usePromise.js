import { useState, useEffect } from 'react';


function usePromise(promise) {
  const [state, setState] = useState([true, null, null]);

  useEffect(() => {

    let isSubscribed = true;

    promise
      .then(response => isSubscribed
        ? setState([false, response, null])
        : undefined
      )
      .catch(error => isSubscribed
        ? setState([false, null, error])
        : undefined
      );

    return () => isSubscribed = false;

  }, [promise]);

  return state;
}


export default usePromise;
