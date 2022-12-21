import { PinData } from "./types";

export const MOCK_MAP_DATA: PinData[] = [
  {
    key: "1",
    position: { lat: 55.700552, lon: 37.927958 },
    description: { title: "pin 1" },
  },
  {
    key: "2",
    position: { lat: 55.900552, lon: 37.927958 },
    description: { title: "pin 2" },
  },
  {
    key: "3",
    position: { lat: 55.700552, lon: 37.427958 },
    description: { title: "pin 3 with hidden desc", isHidden: true },
  },
  {
    key: "4",
    position: { lat: 55.500552, lon: 37.427958 },
    description: { title: "Pin with long title 4" },
  },
];
