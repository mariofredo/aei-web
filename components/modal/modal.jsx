import '@/styles/modal.scss';

export default function Modal({onBackdropPress, children}) {
  return (
    <div>
      <div
        className="overlay"
        id="overlay"
        onClick={onBackdropPress}
      ></div>
      <div className="modal" id="modal">
        {children}
      </div>
    </div>
  );
}
