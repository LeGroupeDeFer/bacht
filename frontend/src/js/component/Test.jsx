import React, {useEffect, useState} from 'react';


/* --------------- Higher Order Component --------------- */

function MyComponent({ user, ...props }) {
  return (
    <h1>Hello, {user.name}!</h1>
  );
}


function HigherOrderComponent(Component) {

  let cpt = 0;
  function InnerComponent({ children, userId, ...props }) {

    const [user, setUser] = useState(null);

    useEffect(() => {
      api.user(userId).then(setUser);
    }, [userId]);

    if (user === null)
      return <>Loading...</>;

    return (
      <Component user={user} {...props}>
        {children}
      </Component>
    );

  }

  return InnerComponent;

}


export default MyComponent;


/* --------------- Custom Hooks --------------- */

import { useLocation } from 'react-router-dom';
// useState, useEffect, useLocation

function useCounter() {
  const [cpt, setCpt] = useState(0);
  const increment = () => setCpt(i => i + 1); // reducer function
  const decrement = () => setCpt(i => i - 1); // reducer function

  return { cpt, increment, decrement };
}

function MyCustomComponent({ ...props }) {
  const { increment:a } = useCounter();

  return (
    <>
      <h1>Counter = {cpt}</h1>
      <button onClick={a}>+</button>
    </>
  );

}

function Hybrid(Component) {

  const [cpt, setCpt] = useState(0);
  const increment = () => setCpt(i => i + 1); // reducer function

  return function(props) {
    return (
      <Component cpt={cpt} increment={increment} {...props} />
    );
  }

}
