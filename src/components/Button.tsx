type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ className, ...props }: ButtonProps) => {
  return <button {...props} className={`bg-background rounded-md px-4 py-2 text-2xl font-bold ${className}`} />;
};
export default Button;
