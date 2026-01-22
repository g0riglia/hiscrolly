import styles from "./Modal.module.css";
import FocusLock from "react-focus-lock";
import { RemoveScroll } from "react-remove-scroll";

function Modal({ children, className = "", ...delegated }) {
  return (
    <FocusLock returnFocus={true}>
      <RemoveScroll>
        <div className={styles.backdrop}></div>
        <div className={styles.wrapper}>
          <div className={`${styles.modal} ${className}`} {...delegated}>
            {children}
          </div>
        </div>
      </RemoveScroll>
    </FocusLock>
  );
}

export default Modal;
