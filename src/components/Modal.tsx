import { PropsWithChildren } from 'react';

interface Props {
  onClose: () => void;
}

const Modal = ({ children, onClose }: PropsWithChildren<Props>) => (
  <div className="modal-backdrop" onClick={onClose}>
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      onClick={(event) => event.stopPropagation()}
    >
      <button className="close-btn" type="button" onClick={onClose}>
        ✕
      </button>
      {children}
    </div>
  </div>
);

export default Modal;

