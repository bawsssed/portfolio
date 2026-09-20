const FormField = ({
  index,
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  as = "input",
}) => {
  const Control = as === "textarea" ? "textarea" : "input";

  return (
    <label
      className={`contact__field ${as === "textarea" ? "contact__field--message" : ""} ${
        error ? "contact__field--error" : ""
      }`}
    >
      <span className="contact__field-index">{index}</span>
      <span className="contact__field-label">{label}</span>
      <span className="contact__field-control">
        <Control
          type={as === "textarea" ? undefined : type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          data-cursor="text"
        />
        {error && (
          <span className="contact__error" id={`${name}-error`} role="alert">
            {error}
          </span>
        )}
      </span>
    </label>
  );
};

export default FormField;