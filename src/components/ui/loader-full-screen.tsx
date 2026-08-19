interface LoaderProps {
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "accent";
  text?: string;
}

import { useEffect } from "react";
import { createPortal } from "react-dom";

export function FullScreenLoader({
  size = "medium",
  color = "primary",
  text,
}: LoaderProps) {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  const colorClasses = {
    primary: "border-blue-500",
    secondary: "border-gray-500",
    accent: "border-purple-500",
  };

  // Bloquear el scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Crear portal en el body (fuera de cualquier stacking context)
  return createPortal(
    <div
      className="fixed inset-0 z-[2147483647] bg-black/70 flex flex-col items-center justify-center gap-3"
      aria-busy="true"
      aria-live="assertive"
    >
      <div
        className={`
          ${sizeClasses[size]}
          ${colorClasses[color]}
          border-2
          border-t-transparent
          rounded-full
          animate-spin
        `}
      />
      {text && (
        <p className="text-white font-medium max-w-xs text-center">{text}</p>
      )}
    </div>,
    document.body // Renderizar directamente en el body
  );
}

// export function FullScreenLoader({ size = "medium", color = "primary", text }: LoaderProps) {
//   const sizeClasses = {
//     small: "w-4 h-4",
//     medium: "w-8 h-8",
//     large: "w-12 h-12",
//   }

//   const colorClasses = {
//     primary: "border-blue-500",
//     secondary: "border-gray-500",
//     accent: "border-purple-500",
//   }

//   return (
//     <div className="fixed inset-0 z-50 bg-black/70 flex flex-col items-center justify-center gap-3">
//       <div
//         className={`
//           ${sizeClasses[size]}
//           ${colorClasses[color]}
//           border-2
//           border-t-transparent
//           rounded-full
//           animate-spin
//         `}
//       />
//       { text && <p className="text-white">{text}</p>}
//     </div>
//   )
// }
