import type { GeoObjectGeometry, YMapsApi } from "react-yandex-maps";
import { Description } from "../types";
import "./YaMapCustomPlacemarks.css";

const DESCRIPTION_BLOCK_HEIGHT = 20;
const PIN_TOP_MARGIN = 4;
const PIN_LEFT_MARGIN = 10;

const PIN_SIZE = 12;
const PIN_EXPANDED_INSET = 3;

type PinLayoutGetterParams = {
  onClick: (map: YMapsApi) => void;
  description: Description;
  isActive?: boolean;
  isViewed?: boolean;
};
export type PinLayoutGetter = (
  params: PinLayoutGetterParams
) => GeoObjectGeometry;
type PinTemplateFactoryCreator = (ymaps: YMapsApi) => PinLayoutGetter;

// eslint-disable-next-line max-lines-per-function
export const createPinTemplateFactory: PinTemplateFactoryCreator = (ymaps) => {
  // eslint-disable-next-line max-lines-per-function
  return ({ onClick, description = { title: "" }, isActive, isViewed }) => {
    const layout = ymaps.templateLayoutFactory.createClass(
      `<div class="pin-container">
            <div class="placemark-description">
                <p class="placemark-description__title">${description.title}</p>
            </div>
            <div class="pin-container__pin">
                <div class="placemark__background"></div>
            </div>
      </div>`,
      {
        // eslint-disable-next-line complexity
        build: function () {
          layout.superclass.build.call(this);

          // GET ELEMENTS

          const pinContainer =
            this.getParentElement().getElementsByClassName("pin-container")[0];

          const backgroundElement =
            this.getParentElement().getElementsByClassName(
              "placemark__background"
            )[0];

          const descriptionElement =
            this.getParentElement().getElementsByClassName(
              "placemark-description"
            )[0];

          // INITIAL STATE LAYOUT

          const pinSize = isActive ? PIN_SIZE + PIN_EXPANDED_INSET : PIN_SIZE;
          const elementHeight =
            pinSize + DESCRIPTION_BLOCK_HEIGHT + PIN_TOP_MARGIN;
          const isDescriptionHidden = description?.isHidden;

          const inset = isActive ? -PIN_EXPANDED_INSET : 0;
          // if placemark is already in active state at initial render, set active styles
          backgroundElement.style.top = inset + "px";
          backgroundElement.style.bottom = inset + "px";
          backgroundElement.style.left = inset + "px";
          backgroundElement.style.right = inset + "px";

          descriptionElement.style.transform = `translateY(${inset}px)`;
          if (!isDescriptionHidden || isActive) {
            descriptionElement.classList.add("placemark-description_visible");
          }

          // Initial placemark position relatively to coordinates is top left edge of parent component points to coordinates point.
          // In case of pin we want to have coordinates point in the middle of pin component
          const translateLeft = PIN_LEFT_MARGIN + PIN_SIZE / 2;
          let translateTop =
            DESCRIPTION_BLOCK_HEIGHT + PIN_TOP_MARGIN + PIN_SIZE / 2;
          pinContainer.style.transform = `translate(-${translateLeft}px, -${translateTop}px)`;

          if (isActive) {
            // description active state layout
            descriptionElement.classList.add("placemark-description_active");

            // ACTIVE STATE ANIMATION

            // add extraTranslateTop to initial translate
            // Extra translate is the value on which we have to raise pin so its tail will be in place of its center in un active state.
            // This value is a half of diagonal of the square with side = size of pin. Or sqrt(2)/2 * pinSize or pinSize * 0.7
            translateTop = translateTop + pinSize * 0.7;
            setTimeout(() => {
              pinContainer.style.transform = `translate(-${translateLeft}px, -${translateTop}px)`;

              // make tailed pin from the round one
              backgroundElement.style.borderRadius = "50% 50% 1px 50%";
            });
          }

          // HOVER LAYOUT

          this.getData().geoObject.events.add(
            "mouseenter",
            () => {
              backgroundElement.style.top = `-${PIN_EXPANDED_INSET}px`;
              backgroundElement.style.bottom = `-${PIN_EXPANDED_INSET}px`;
              backgroundElement.style.left = `-${PIN_EXPANDED_INSET}px`;
              backgroundElement.style.right = `-${PIN_EXPANDED_INSET}px`;

              descriptionElement.style.transform = `translateY(-${PIN_EXPANDED_INSET}px)`;
              if (isDescriptionHidden) {
                descriptionElement.style.opacity = 1;
              }
            },
            this
          );

          this.getData().geoObject.events.add(
            "mouseleave",
            () => {
              // if placemark is active leave hover layout unaffected
              if (!isActive) {
                backgroundElement.style.top = "0px";
                backgroundElement.style.bottom = "0px";
                backgroundElement.style.left = "0px";
                backgroundElement.style.right = "0px";

                descriptionElement.style.transform = "translateY(0px)";
                if (isDescriptionHidden) {
                  descriptionElement.style.opacity = 0;
                }
              }
            },
            this
          );

          // TOUCHABLE ZONE SHAPE
          if (isDescriptionHidden) {
            this.getData().options.set("shape", {
              type: "Circle",
              coordinates: [0, PIN_TOP_MARGIN],
              radius: (pinSize + PIN_EXPANDED_INSET * 2) / 2,
            });
          } else {
            this.getData().options.set("shape", {
              type: "Rectangle",
              coordinates: [
                [-translateLeft, -translateTop],
                [
                  descriptionElement.offsetWidth - translateLeft,
                  elementHeight -
                    translateTop +
                    PIN_EXPANDED_INSET +
                    PIN_TOP_MARGIN,
                ],
              ],
            });
          }

          // VIEWED STATE LAYOUT
          if (isViewed && !isActive) {
            backgroundElement.style.backgroundColor = "#64656E";
            descriptionElement.style.color = "#64656E";
          }

          this.getData().geoObject.events.types.click = [];
          this.getData().geoObject.events.add("click", onClick, this);
        },
      }
    );
    return layout;
  };
};
