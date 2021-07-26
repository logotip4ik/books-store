import styles from '../styles/DashboardMenu.module.scss';

function DashboardMenu({ name, books }) {
  return (
    <div className={styles.menu}>
      <h2 className={styles.menu__header}>{name}</h2>
      <ol className={styles.menu__list}>
        <li className={styles.menu__list__item}>Dashboard</li>
        {books.map((book) => (
          <li key={book.id} className={styles.menu__list__item}>
            {book.name}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default DashboardMenu;
