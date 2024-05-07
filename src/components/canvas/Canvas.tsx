import { useEffect, useRef, useState } from "react";
import { LeafletFabricLayer } from "./leaflet-extensions.config";
import * as Leaflet from "leaflet";
import { fabric } from "fabric";
import { useSelector, useDispatch } from "react-redux";
import { getVisiblePlayers } from "../../redux/game/selectors";
import { deletePlayerAction } from "../../redux/game/reducer";
import { getResolution } from "../../utils/utils";

export default function Canvas({ map }: { map: Leaflet.Map }): null {
  const [fabricLayer, setFabricLayer] = useState(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const data = useSelector(getVisiblePlayers);
  const dispatch = useDispatch();

  const getPoint = (lat: number, long: number) => {
    return map.latLngToContainerPoint([lat, long]);
  };

  const renderPlayers = (canvas: fabric.Canvas) => {
    canvas.remove(...canvas.getObjects());

    const resolution = getResolution(map.getCenter(), map.getZoom());
    data.map((player) => {
      const coordinates = getPoint(
        player.position.latitude,
        player.position.longitude
      );

      let elem;
      const strokeWidth = 1.5 / resolution;

      if (player.teamName === "red") {
        const size = 7 / resolution;

        elem = new fabric.Rect({
          left: coordinates.x,
          top: coordinates.y,
          fill: "white",
          width: size,
          height: size,
          stroke: "red",
          strokeWidth
        });
      }
      if (player.teamName === "blue") {
        elem = new fabric.Circle({
          left: coordinates.x,
          top: coordinates.y,
          fill: "blue",
          radius: 4 / resolution,
          stroke: "white",
          strokeWidth
        });
      }

      canvas.add(elem);
      elem.on("mousedown", () => {
        dispatch(deletePlayerAction(player.id));
      });
    });
  };

  useEffect(() => {
    const fabricLayer = new LeafletFabricLayer();
    const fabricLayerDidMount = () => {
      const fabricCanvas = new fabric.Canvas(fabricLayer._canvas);
      renderPlayers(fabricCanvas);
      fabricLayer.setFabricCanvas(fabricCanvas);
      fabricCanvas.requestRenderAll();
      setFabricCanvas(fabricCanvas);
    };
    setFabricLayer(fabricLayer);

    fabricLayer.delegate({
      onLayerDidMount: fabricLayerDidMount
    });
    fabricLayer.addTo(map);
  }, [map]);

  // in this use effect I delete all object and create new if state was changed
  // and recreate callback onMove
  useEffect(() => {
    const onMove = () => {
      renderPlayers(fabricCanvas);
    };

    if (fabricCanvas) {
      renderPlayers(fabricCanvas);
    }

    fabricLayer?.delegate({
      onLayerDidMove: onMove
    });
  }, [data, fabricCanvas, fabricLayer]);

  if (!fabricCanvas) return null;

  return null;
}
