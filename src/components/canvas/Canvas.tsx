import { useEffect, useRef, useState } from "react";
import { LeafletFabricLayer } from "./leaflet-extensions.config";
import * as Leaflet from "leaflet";
import { fabric } from "fabric";
import { useSelector, useDispatch } from "react-redux";
import { getGamePlayers } from "../../redux/game/selectors";
import { deletePlayerAction } from "../../redux/game/reducer";
import { Player } from "../../redux/game/types";
import { getResolution } from "../../utils";

export default function Canvas({ map }: { map: Leaflet.Map }): null {
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const data = useSelector(getGamePlayers);
  const dispatch = useDispatch();

  // We need to use ref because of closure we pass into LeafletFabricLayer class.
  //We have 'old' this in that class
  const fabricCanvasRef = useRef<fabric.Canvas | null>();
  const dataRef = useRef<Player[] | null>(null);
  dataRef.current = data;
  fabricCanvasRef.current = fabricCanvas;

  const getPoint = (lat: number, long: number) => {
    return map.latLngToContainerPoint([lat, long]);
  };

  const renderPlayers = (canvas: fabric.Canvas) => {
    canvas.remove(...canvas.getObjects());
    const resolution = getResolution(map.getCenter(), map.getZoom())


    dataRef.current.map((player) => {
      const coordinates = getPoint(
        player.position.latitude,
        player.position.longitude
      );

      let elem;

      if (player.teamName === "red") {
        elem = new fabric.Rect({
          left: coordinates.x,
          top: coordinates.y,
          fill: "white",
          width: 7 /resolution,
          height: 7 / resolution,
          stroke: "red",
          strokeWidth: 1.5 /resolution
        });
      }
      if (player.teamName === "blue") {
        elem = new fabric.Circle({
          left: coordinates.x,
          top: coordinates.y,
          fill: "blue",
          radius: 4/resolution,
          stroke: "white",
          strokeWidth: 1.5 /resolution
        });
      }

      canvas.add(elem);
      elem.on("mousedown", (element) => {
        dispatch(deletePlayerAction(player.id));
      });
    });

    canvas.requestRenderAll();
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

    const onMove = () => {
      console.log("onMove");
      renderPlayers(fabricCanvasRef.current);
    };

    fabricLayer.delegate({
      onLayerDidMount: fabricLayerDidMount,
      onLayerDidMove: onMove,
    });
    fabricLayer.addTo(map);
  }, [map]);

  // in this use effect I delete all object and create new if state was changed
  useEffect(() => {
    if (fabricCanvasRef.current) {
      renderPlayers(fabricCanvasRef.current);
    }
  }, [data]);

  if (!fabricCanvas) return null;

  return null;
}
