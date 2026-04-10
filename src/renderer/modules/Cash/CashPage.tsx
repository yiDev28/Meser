import { useEffect, useState } from "react";
import { CashProvider } from "./context/CashContext";
import { useCash } from "./hooks/useCash";
import { CardCashStatus } from "./components/CardCashStatus";
import { ModalOpenCash } from "./components/ModalOpenCash";
import { ModalCloseCash } from "./components/ModalCloseCash";
import { ModalNewMovement } from "./components/ModalNewMovement";
import { CardMovement } from "./components/CardMovement";
import { CashSummary } from "./components/CashSummary";
import AlertBanner from "@/renderer/components/Alerts/AlertBanner";
import { LoaderPulse } from "@/renderer/components/Loaders/Loader";

function CashPageContent() {
  const {
    cashRegister,
    movements,
    typeMovements,
    summary,
    isLoading,
    isOpening,
    isClosing,
    isCreatingMovement,
    alert,
    openCash,
    closeCash,
    createMovement,
    refreshCash,
    filter,
    setFilter,
  } = useCash();

  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);

  useEffect(() => {
    refreshCash();
  }, [refreshCash]);

  const handleOpenCash = () => {
    setShowOpenModal(true);
  };

  console.log("CashPage render:", {
    cashRegister,
    isLoading,
    movements,
    summary,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoaderPulse />
      </div>
    );
  }
  return (
    <div className="w-full px-3 ">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 ">
        {alert && <AlertBanner alert={alert} />}
        <div className="space-y-3 ">
          <CardCashStatus
            cashRegister={
              cashRegister || {
                id: "",
                openedAt: "",
                initialAmount: 0,
                currentAmount: 0,
                isOpen: false,
                userId: 0,
                status: 0,
              }
            }
            onOpenCash={handleOpenCash}
            onCloseCash={() => setShowCloseModal(true)}
            onNewMovement={() => setShowMovementModal(true)}
          />
          {cashRegister && cashRegister.isOpen && summary && (
            <CashSummary
              summary={summary}
              typeMovements={typeMovements}
              filter={filter}
              onFilterChange={setFilter}
            />
          )}
        </div>

        <div>
          {cashRegister && cashRegister.isOpen && (
            <div className="bg-neutral-light rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-neutral-dark ">
                Movimientos
              </h3>

              {movements.length === 0 ? (
                <p className="text-center text-lg text-neutral-gray py-8">
                  No hay movimientos registrados
                </p>
              ) : (
                <div className="max-h-[calc(100vh-230px)] overflow-y-auto ">
                  {movements
                    .filter(
                      (m) => filter === null || m.typeMovement?.id === filter,
                    )
                    .map((movement) => (
                      <CardMovement key={movement.id} movement={movement} />
                    ))}
                </div>
              )}
            </div>
          )}

          {!cashRegister && (
            <div className="bg-neutral-light rounded-lg text-lg shadow-lg p-8 ">
              <p className="text-neutral-dark/70">
                No hay caja abierta. Debe abrir la caja para comenzar a
                registrar movimientos.
              </p>
            </div>
          )}
        </div>

        <ModalOpenCash
          isOpen={showOpenModal}
          onClose={() => setShowOpenModal(false)}
          onSubmit={openCash}
          isLoading={isOpening}
        />

        <ModalCloseCash
          isOpen={showCloseModal}
          onClose={() => setShowCloseModal(false)}
          onSubmit={closeCash}
          currentAmount={cashRegister?.currentAmount || 0}
          isLoading={isClosing}
        />

        <ModalNewMovement
          isOpen={showMovementModal}
          onClose={() => setShowMovementModal(false)}
          onSubmit={createMovement}
          typeMovements={typeMovements}
          isLoading={isCreatingMovement}
        />
      </div>
    </div>
  );
}

export default function CashPage() {
  return (
    <CashProvider>
      <CashPageContent />
    </CashProvider>
  );
}
