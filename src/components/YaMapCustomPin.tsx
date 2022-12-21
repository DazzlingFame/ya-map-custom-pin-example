import React, { useEffect, useState } from "react";
import type { YMapsApi } from "react-yandex-maps";
import { Placemark } from "react-yandex-maps";
import { createPinTemplateFactory } from "./YaMapCustomPinStyles";
import { PinData } from "../types";

type Props = {
  data: PinData;
  isActive: boolean;
  onClick: (key: string) => void;
  mapInstanceRef: YMapsApi | null;
};

const Pin: React.FC<Props> = React.memo(
  ({ data, isActive, onClick, mapInstanceRef }) => {
    const [isViewed, setViewed] = useState(false);
    useEffect(() => {
      isActive && !isViewed && setViewed(true);
    }, [isActive, isViewed]);

    if (!mapInstanceRef) return null;

    const onClickCallback = () => {
      onClick(data.key);
    };

    const template = createPinTemplateFactory(mapInstanceRef)({
      onClick: onClickCallback,
      description: data.description,
      isActive,
      isViewed,
    });

    return (
      <Placemark
        geometry={[data.position.lat, data.position.lon]}
        options={{
          iconLayout: template,
          zIndex: isActive ? 100 : 99,
        }}
      />
    );
  }
);

export default Pin;
