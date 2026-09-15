import { useRef, useState } from 'react';

export default function AssetUploader({ label, hint, currentSrc, onFileSelect }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFile(file) {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  }

  return (
    <div
      className={`asset-uploader ${dragOver ? 'is-dragover' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files?.[0]);
      }}
    >
      <div className="asset-preview">
        <img src={preview || currentSrc} alt="" />
      </div>

      <div className="asset-meta">
        <span className="asset-label">{label}</span>
        <span className="asset-hint">{hint}</span>
        <button type="button" className="asset-replace" onClick={() => inputRef.current?.click()}>
          Replace file
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp,image/x-icon"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
