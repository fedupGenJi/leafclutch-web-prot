import Modal from './Modal.jsx';
import Icon from '../Icon.jsx';

/**
 * A single, reusable "are you sure?" popup. Every save and every delete in
 * the admin dashboard routes through this rather than firing straight off,
 * so nothing is written or removed without an explicit second click.
 */
export default function ConfirmDialog({
  open,
  tone = 'default', // 'default' | 'danger'
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  busy = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      size="sm"
      closeOnBackdrop={!busy}
      footer={
        <>
          <button type="button" className="admin-cancel-btn" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={tone === 'danger' ? 'admin-danger-btn' : 'admin-save-btn'}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? 'Working…' : confirmLabel}
          </button>
        </>
      }
    >
      <div className={`confirm-dialog confirm-${tone}`}>
        <div className="confirm-icon">
          <Icon name={tone === 'danger' ? 'trash' : 'alert'} size={22} />
        </div>
        <p className="confirm-message">{message}</p>
      </div>
    </Modal>
  );
}