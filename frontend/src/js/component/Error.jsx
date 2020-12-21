import React from 'react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'

const Error = ({ error, variant }) => error ? (
  <p className={`text-${variant} error`}>
    <Icon icon={faExclamationCircle} className="mr-2" />
    {error.message || error.reason || error.code}
  </p>
) : null;

Error.defaultProps = {
  variant: 'danger'
};

export default Error;
