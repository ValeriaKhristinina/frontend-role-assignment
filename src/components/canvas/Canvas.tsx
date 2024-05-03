import { useEffect, useState } from "react";
import { LeafletFabricLayer } from "./leaflet-extensions.config";
import * as Leaflet from "leaflet";
import { fabric } from "fabric";
import { useSelector } from "react-redux";
import { getGamePlayers } from "../../redux/game/selectors";

export default function Canvas({ map }: { map: Leaflet.Map }): null {
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const data = useSelector(getGamePlayers);

  const getPoint = (lat: number, long: number) => {
    return map.latLngToLayerPoint([lat, long]);
  };

  useEffect(() => {
    const fabricLayer = new LeafletFabricLayer();
    const fabricLayerDidMount = () => {
      const fabricCanvas = new fabric.Canvas(fabricLayer._canvas);
      data.map((player) => {
        const coordinates = getPoint(
          player.position.latitude,
          player.position.longitude
        );

        if (player.teamName === "red") {
          const rect = new fabric.Rect({
            left: coordinates.x,
            top: coordinates.y,
            fill: "white",
            width: 20,
            height: 20,
            stroke: "red",
            strokeWidth: 4
          });
          fabricCanvas.add(rect);
        }
        if (player.teamName === "blue") {
          const circle = new fabric.Circle({
            left: coordinates.x,
            top: coordinates.y,
            fill: "blue",
            radius: 12,
            stroke: "white",
            strokeWidth: 5
          });
          fabricCanvas.add(circle);
        }
      });
      fabricLayer.setFabricCanvas(fabricCanvas);
      fabricCanvas.requestRenderAll();
      setFabricCanvas(fabricCanvas);
    };

    fabricLayer.delegate({
      onLayerDidMount: fabricLayerDidMount
    });
    fabricLayer.addTo(map);
  }, [map]);

  if (!fabricCanvas) return null;

  return null;
}
