import "./button.css";

const Button = ({ children, className, type = "button", onClick }) => {
  const buttonClass = `btn ${className}`.trim();

  return (
    <button type={type} className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
