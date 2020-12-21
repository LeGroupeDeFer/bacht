import React from 'react';
import { BallTriangle } from '@agney/react-loading';


const Loader = BallTriangle;

export const Centered = props => (
  <div className="absolute-center">
    <Loader {...props} />
  </div>
);

Loader.Centered = Centered;


export default Loader;
