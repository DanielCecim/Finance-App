import './Select.css'

function Select({
  value,
  onChange,
  options = [],
  disabled = false,
  label = '',
  className = '',
  ...props
}) {
  return (
    <div className={`select-wrapper ${className}`}>
      {label && <label className="select-label">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="select"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select

