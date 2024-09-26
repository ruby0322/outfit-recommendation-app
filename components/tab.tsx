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
        "text-gray-700 text-sm rounded-t-md px-4 py-1 bg-white hover:bg-gray-100 cursor-pointer flex justify-between items-center",
        isSelected && "bg-gray-200/70 hover:bg-gray-200"
      )}
      onPointerDown={onClick}
    >
      {label}
    </div>
  );
};
