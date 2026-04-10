import React, { useEffect, useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { Navigation } from "./router/Navigation";
import { useAlertService } from "./components/Modals/AlertService";
import { useVerifyApp } from "./modules/auth/hooks/useVerifyApp";
import RegisterAppPage from "./modules/auth/RegisterAppPage";
import TitleBar from "./components/Layout/TitleBar";
import ScreenSelector from "./components/Layout/ScreenSelector";
import { useAppConfig } from "./hooks/useAppConfig";

const App: React.FC = () => {
  const { isRegistered } = useVerifyApp();
  const { getConfig, getDisplays, detectDisplay, displays, reloadConfig } = useAppConfig();
  const [showScreenSelector, setShowScreenSelector] = useState(false);
  const [configLoaded, setConfigLoaded] = useState(false);

  useEffect(() => {
    const checkScreenConfig = async () => {
      await reloadConfig();
      await getDisplays();
      setConfigLoaded(true);
    };
    checkScreenConfig();
  }, [reloadConfig, getDisplays]);

  useEffect(() => {
    if (!configLoaded) return;

    const screenIndex = getConfig("screen_index");
    const autoDetect = getConfig("auto_detect_screen") === "true";
    const hasMultipleDisplays = displays.length > 1;

    if (autoDetect && hasMultipleDisplays) {
      detectDisplay().then((detectedIndex: number) => {
        if (screenIndex === undefined || parseInt(screenIndex, 10) !== detectedIndex) {
          window.electron.setScreenIndex(detectedIndex);
        }
      });
    } else if (screenIndex === undefined || parseInt(screenIndex, 10) >= displays.length) {
      if (hasMultipleDisplays) {
        setShowScreenSelector(true);
      }
    }
  }, [configLoaded, getConfig, displays, detectDisplay]);

  const hideTitleBar = getConfig("hide_titlebar") === "true";

  return (
    <>
      {useAlertService()}
      <div className="flex flex-col h-screen">
        {hideTitleBar && <TitleBar onScreenSelectorClick={() => setShowScreenSelector(true)} />}
        <div className="flex-1 overflow-hidden">
          {isRegistered ? (
            <AuthProvider>
              <Navigation />
            </AuthProvider>
          ) : (
            <RegisterAppPage />
          )}
        </div>
      </div>
      {hideTitleBar && showScreenSelector && (
        <ScreenSelector 
          onClose={() => setShowScreenSelector(false)} 
          onSelect={() => setShowScreenSelector(false)}
        />
      )}
    </>
  );
};

export default App;
