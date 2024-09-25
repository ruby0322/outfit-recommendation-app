import { cn } from "@/lib/utils";

interface Props {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export const Tab = ({ label, onClick, isSelected }: Props) => {
  return (
    <div
      id={label}
      className={cn(
        "rounded-t-2 p-4 bg-white cursor-pointer flex justify-between items-center",
        isSelected && "bg-gray-100"
      )}
      onPointerDown={onClick}
    >
      {label}
    </div>
  );
};
