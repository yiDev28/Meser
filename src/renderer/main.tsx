import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { LoadingProvider } from "./context/LoadingContext.tsx";
import { RegisterProvider } from "./context/RegisterContext.tsx";
import { LoaderPulse } from "./components/Loaders/Loader.tsx";
import ThemeToggle from "./components/ThemeToggle.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  //<React.StrictMode>
    <LoadingProvider>
      <LoaderPulse />
      {/* <ThemeToggle /> */}
      <RegisterProvider>
        <App />
      </RegisterProvider>
    </LoadingProvider>
  // </React.StrictMode>
);

