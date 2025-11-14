import './Input.css'

function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  error = '',
  label = '',
  className = '',
  ...props
}) {
  return (
    <div className={`input-wrapper ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`input ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && <span className="input-error-text">{error}</span>}
    </div>
  )
}

export default Input

