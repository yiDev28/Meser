import { TypeMsg } from "@/interfaces/app";
import { alertDicc } from "@/renderer/utils/alertDicc";

function AlertBanner({ alert }: { alert: TypeMsg }) {
  const alertConfig = alertDicc[alert.type];
  return (
    <div
      style={{
        backgroundColor: alertConfig.background,
        color: alertConfig.text,
        borderColor: alertConfig.text,
        borderWidth: "1px",
        borderStyle: "solid",
      }}
      className={`p-5 rounded-xl  mb-4 `}
    >
      <h3 className="font-bold">{alertConfig.title}</h3>
      <p className=" sm:inline ml-2">
        {alert.msg}</p>
    </div>
  );
}

export default AlertBanner;
