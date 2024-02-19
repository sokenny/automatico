import styles from './Nav.module.css';

const Nav = () => {
  return (
    <nav className={styles.container}>
      <ul>
        <li>MA8</li>
        <li>FAQ</li>
        <li>Docs</li>
        <li>Change Log</li>
        <li>Pricing</li>
      </ul>
      <ul>
        <li>Account</li>
      </ul>
    </nav>
  );
};

export default Nav;
