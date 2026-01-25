export const useApp = () => {
  const handleExit = async () => {
    await window.electron.exitApp();
  };

  return {
    handleExit,
  };
};
