import { YMaps } from "react-yandex-maps";
import type { YMapsApi } from "react-yandex-maps";
import React, { useCallback, useState } from "react";
import { Container, StyledMap } from "./MapStyles";
import YaMapCustomPin from "./YaMapCustomPin";
import { PinData } from "../types";

export type MapProps = {
  // className - style for the Container. However, it's preferred to create a new container above CommonMap because of problems with generic type components and styled
  className?: string;
  // data - data to render map markers via renderMarker function
  data: PinData[] | undefined;
};

export const Map = ({ className, data }: MapProps) => {
  const mapInstanceRef = React.useRef<YMapsApi>();
  const [ymaps, setYmaps] = useState<YMapsApi | null>(null);
  const [activePinKey, setActivePinKey] = useState<string>();

  const onMapLoaded = useCallback(
    (ymaps: YMapsApi) => {
      setYmaps(ymaps);
    },
    [setYmaps]
  );

  return (
    <Container className={className}>
      <YMaps>
        <StyledMap
          onLoad={onMapLoaded}
          instanceRef={mapInstanceRef}
          modules={["templateLayoutFactory"]}
          behaviors={["default", "scrollZoom"]}
          defaultState={{ center: [55.700552, 37.927958], zoom: 10 }}
        >
          {data?.map((item) => (
            <YaMapCustomPin
              key={item.key}
              data={item}
              isActive={item.key === activePinKey}
              mapInstanceRef={ymaps}
              onClick={setActivePinKey}
            />
          ))}
        </StyledMap>
      </YMaps>
    </Container>
  );
};
