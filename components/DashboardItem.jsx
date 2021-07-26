import styles from '../styles/DashboardItem.module.scss';

function DashboardItem({ list, header, empty, onOpen, onAdd }) {
  return (
    <div className={styles.main}>
      <div className={styles.main__header}>
        <h2>{header}</h2>
        <button onClick={onAdd}>
          <svg viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </button>
      </div>
      {list.length !== 0 ? (
        <ul className="slider">
          {list.map((item) => (
            <li
              key={item.id}
              className="slider__item"
              onClick={() => onOpen(item.id)}
            >
              {item.title}
            </li>
          ))}
        </ul>
      ) : (
        <p className="slider--empty">{empty}</p>
      )}
    </div>
  );
}

export default DashboardItem;
