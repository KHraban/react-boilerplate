import * as React from 'react';
import untypedStyles from './styles.module.scss';
import logo from './logo.svg';

interface IProps {
  name: string,
}
type Css = { readonly [key: string]: string };

function App(props: IProps) {
  const styles = untypedStyles as Css;
  const { name } = props;
  return (
    <div className={styles.app}>
      <h1>
        Hello from
        {' '}
        {name}
      </h1>
      <img src={logo} className={styles.logo} alt="logo" />
    </div>
  );
}

export default App;
