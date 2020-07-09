import * as React from 'react';
import untypedStyles from './styles.module.scss';
import logo from './logo.svg';

function AppJs(props) {
  // eslint-disable-next-line react/prop-types
  const { name } = props;
  return (
    <div className={untypedStyles.app}>
      <h1>
        Hello from
        {' '}
        {name}
      </h1>
      <img src={logo} className={untypedStyles.logo} alt="logo" />
    </div>
  );
}

export default AppJs;
