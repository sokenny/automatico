import styles from './Nav.module.css';

const Nav = () => {
  return (
    <nav className={styles.container}>
      <ul>
        <li>Auto</li>
        <li>FAQ</li>
        <li>Pricing</li>
      </ul>
      <ul>
        <li>Account</li>
      </ul>
    </nav>
  );
};

export default Nav;
