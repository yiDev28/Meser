import { defaultAlert } from "../components/Modals/AlertService";

export const useApp = () => {
  const handleExit = async () => {
    await window.electron.exitApp();
  };

  const minimizeWindow = async () => {
    await window.electron.minimizeWindow();
  };

  const maximizeWindow = async () => {
    await window.electron.maximizeWindow();
  };

  const closeWindow = async () => {
    defaultAlert({
      mode: "warning",
      title: "¿Cerrar aplicación?",
      body: "¿Estás seguro que deseas cerrar la aplicación?",
      successButton: true,
      textSuccessButton: "Sí, cerrar",
      onSuccess: () => {
        handleExit();
      },
      cancelButton: true,
    });
  };

  const isMaximized = async () => {
    return await window.electron.isMaximized();
  };

  const getWindowConfig = async () => {
    return await window.electron.getWindowConfig();
  };

  const restartApp = async () => {
    await window.electron.restartApp();
  };

  return {
    handleExit,
    minimizeWindow,
    maximizeWindow,
    closeWindow,
    isMaximized,
    getWindowConfig,
    restartApp,
  };
};
