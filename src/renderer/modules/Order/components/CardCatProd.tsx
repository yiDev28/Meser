import { ProductCategoryDTO } from "@/interfaces/product";
import { TableDTO } from "@/interfaces/table";
import React from "react";
import { MdOutlineTableBar, MdTableBar } from "react-icons/md";

interface CardCatProdProps {
  category: ProductCategoryDTO;
  onClick?: () => void;
  isSelected?: boolean;
}
const CardCatProd: React.FC<CardCatProdProps> = ({
  category,
  onClick,
  isSelected,
}) => {
  return (
    <div
      className={` ${
        isSelected ? "bg-secondary" : "bg-neutral-light"
      } rounded-lg cursor-pointer text-neutral-dark py-4 
        hover:shadow-xl hover:bg-neutral-gray/70 hover:text-neutral-light `}
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center">
        <img
          src={category.urlImage}
          alt={`Logo categoría ${category.name}`}
          width={50}
          onError={(e) => {
            e.currentTarget.src = "/electron-vite.animate.svg";
          }}
        />
        <h4 className="font-bold text-lg mt-3 text-center">{category.name}</h4>
      </div>
    </div>
  );
};

export default CardCatProd;
