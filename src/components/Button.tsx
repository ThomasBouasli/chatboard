type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ className, ...props }: ButtonProps) => {
  return <button {...props} className={`rounded-md bg-background px-4 py-2 text-xl font-bold ${className}`} />;
};
export default Button;
