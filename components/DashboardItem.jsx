import styles from '../styles/DashboardItem.module.scss';

function DashboardItem({ list, header, empty, openBook }) {
  return (
    <div className={styles.main}>
      <div className={styles.main__header}>
        <h2>{header}</h2>
        {/* TODO: add plus svg and replace this with button*/}
        <span>+</span>
      </div>
      {list.length !== 0 ? (
        <ul className={styles.main__slider}>
          {list.map((item) => (
            <li
              key={item.id}
              className={styles.main__slider__item}
              onClick={() => openBook(item.id)}
            >
              {item.title}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.main__slider__empty}>{empty}</p>
      )}
    </div>
  );
}

export default DashboardItem;
