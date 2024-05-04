export function getResolution(center: any, zoom: number) {
  // Resolution in meters per pixel. 40075016 is the length of the equator in meters.
  return (
      (Math.cos((center.lat * Math.PI) / 180) * 40075016) /
      (256 * Math.pow(2, zoom))
  );
}