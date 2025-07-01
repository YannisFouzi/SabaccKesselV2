import React, { useEffect, useMemo, useState } from "react";
import { getCardImage } from "../constants/cardImages";

// Composant Skeleton pour le placeholder
const ImageSkeleton = ({ className }) => (
  <div
    className={`bg-gradient-to-br from-gray-300 to-gray-400 animate-pulse ${className}`}
    style={{
      backgroundImage: `
        radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 1px, transparent 1px),
        radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 1px, transparent 1px)
      `,
      backgroundSize: "20px 20px, 25px 25px",
    }}
  >
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gray-500 border-t-transparent rounded-full animate-spin opacity-50" />
    </div>
  </div>
);

const LazyImage = ({
  // Nouvelle API pour les cartes
  family,
  type,
  value,
  // Ancienne API pour les cas génériques
  loadImageFn,
  alt,
  className = "",
  fallbackClassName = "",
  onLoad,
  onError,
  ...props
}) => {
  const [imageState, setImageState] = useState({
    src: null,
    loading: true,
    error: false,
  });

  // Déterminer quelle API utiliser et mémoriser les paramètres
  const imageParams = useMemo(() => {
    if (loadImageFn) {
      return { type: "generic", loadImageFn };
    } else if (family && type !== undefined) {
      return { type: "card", family, cardType: type, value };
    } else {
      return { type: "error" };
    }
  }, [family, type, value, loadImageFn]);

  useEffect(() => {
    let cancelled = false;

    const loadImage = async () => {
      try {
        setImageState((prev) => ({ ...prev, loading: true, error: false }));

        let imageSrc;

        if (imageParams.type === "card") {
          imageSrc = await getCardImage(
            imageParams.family,
            imageParams.cardType,
            imageParams.value
          );
        } else if (imageParams.type === "generic") {
          imageSrc = await imageParams.loadImageFn();
        } else {
          throw new Error(
            "LazyImage: vous devez fournir soit loadImageFn soit family/type"
          );
        }

        if (!cancelled) {
          if (imageSrc) {
            setImageState({
              src: imageSrc,
              loading: false,
              error: false,
            });
            onLoad?.(imageSrc);
          } else {
            setImageState({
              src: null,
              loading: false,
              error: true,
            });
            onError?.();
          }
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Erreur lors du chargement de l'image:", error);
          setImageState({
            src: null,
            loading: false,
            error: true,
          });
          onError?.(error);
        }
      }
    };

    loadImage();

    return () => {
      cancelled = true;
    };
  }, [imageParams, onLoad, onError]);

  if (imageState.loading) {
    return <ImageSkeleton className={`${className} ${fallbackClassName}`} />;
  }

  if (imageState.error || !imageState.src) {
    return (
      <div
        className={`bg-red-100 border-2 border-red-300 border-dashed ${className} ${fallbackClassName} flex items-center justify-center`}
      >
        <span className="text-red-500 text-xs">❌</span>
      </div>
    );
  }

  return (
    <img src={imageState.src} alt={alt} className={className} {...props} />
  );
};

export default React.memo(LazyImage);
