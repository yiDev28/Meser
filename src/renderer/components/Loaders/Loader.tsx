import { useLoading } from "../../context/LoadingContext";
import "./Loader.css";
export function LoaderPulse() {
  const { isLoading } = useLoading();

  if (!isLoading) {
    return null;
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-light">
      <span className="loader-pulse"></span>
    </div>
  );
}
