import Button from "../button/Button";
import Map from "../map/Map";
import { useDispatch, useSelector } from "react-redux";
import { getIsShowLocation } from "../../redux/game/selectors";
import { toggleLocationAction } from "../../redux/game/reducer";

const Locations = () => {
  const disatch = useDispatch();
  const isSowLocation = useSelector(getIsShowLocation);
  const toggleLocationHandler = () => {
    disatch(toggleLocationAction());
  };

  return (
    <>
      <Map />
      <Button
        onClick={toggleLocationHandler}
        text={!isSowLocation ? "Show Locations" : "Hide Locations"}
        color={isSowLocation ? "red" : "blue"}
      />
    </>
  );
};

export default Locations;
