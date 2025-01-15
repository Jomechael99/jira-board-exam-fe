const Button = ({ column , openModal }: { column: string , openModal: () => void}) => {
  return (
    <button className="mt-4 w-full bg-white text-blue-500 py-2 px-4 rounded transition duration-300" onClick={openModal}
    >
      +
    </button>
  );
};

export default Button;
