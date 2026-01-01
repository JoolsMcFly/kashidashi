interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export default function Label(props: LabelProps) {
  return (
    <label
      className="block text-gray-700 font-medium mb-2 text-sm"
      {...props}
    />
  );
}
