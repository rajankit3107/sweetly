interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export default function Input(props: InputProps) {
  return (
    <input
      {...props}
      className={`w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-700 placeholder-slate-400 
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
        transition-colors duration-200 bg-white/80 backdrop-blur-sm
        disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed
        ${props.className || ""}`}
    />
  );
}
