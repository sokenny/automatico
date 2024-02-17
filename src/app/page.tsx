import SignIn from './components/SignIn';
import styles from './page.module.css';

function HomePage() {
  return <div className={styles.container}>
   <SignIn />
  </div>;
}

export default HomePage;
