// components/ActionButton.tsx
interface ActionButtonProps {
    label: string;
  }
  
  const ActionButton: React.FC<ActionButtonProps> = ({ label }) => (
    <button className="bg-black text-white px-6 py-2 rounded-full font-bold text-lg">
      {label}
    </button>
  );
  
  export default ActionButton;
  