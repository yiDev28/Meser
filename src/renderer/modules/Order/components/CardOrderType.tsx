import { OrderTypeDTO } from "@/interfaces/order";
import { iconCardOrder } from "@/renderer/utils/iconsDicc";
import React from "react";

interface CardOrderTypeProps {
  orderType: OrderTypeDTO;
  onClick?: () => void;
}
const CardOrderType: React.FC<CardOrderTypeProps> = ({
  orderType,
  onClick,
}) => {
  const IconComponent = iconCardOrder[orderType.paramType];
  return (
    <div
      className={`bg-neutral-dark rounded-lg cursor-pointer text-neutral-dark p-4 border border-neutral-gray/40
        hover:shadow-xl hover:scale-105 transition-all duration-200 ease-in-out`}
      onClick={onClick}
      style={{
        background: `linear-gradient(to bottom, ${orderType.colorLabel}, var(--color-background) )`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-xl text-neutral-dark">
          {orderType.name}
        </h4>
        <IconComponent
          size={55}
          className="z-10 bg-background  p-1 rounded-md"
          style={{
            color: `${orderType.colorLabel}`,
          }}
        />
      </div>
      <p className="text-base text-neutral-dark">{orderType.description}</p>
    </div>
  );
};

export default CardOrderType;
