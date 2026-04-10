import { TableDTO } from "@/interfaces/table";
import React from "react";
import { MdOutlineTableBar, MdTableBar } from "react-icons/md";

interface CardTableProps {
  table: TableDTO;
  onClick?: () => void;
}
const CardTable: React.FC<CardTableProps> = ({ table, onClick }) => {
  const icons = [MdOutlineTableBar, MdTableBar];

  const IconComponent = table.id % 2 === 0 ? icons[1] : icons[0];
  return (
    <div
      className={`bg-secondary rounded-lg cursor-pointer text-neutral-gray p-6 animate-scaleIn
        hover:shadow-lg hover:scale-105 transition-all duration-200 ease-in-out`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-2xl text-neutral-light">
            {table.name}
          </h4>
          <p className="text-neutral-light mt-1 font-semibold text-lg underline">
            {table.seats} asientos
          </p>
        </div>

        <IconComponent
          size={55}
          className="z-10 bg-background  p-1 rounded-md"
        />
      </div>
    </div>
  );
};

export default CardTable;
