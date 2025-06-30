import { SmallLocation } from "../../models/location";
import { SmallLocationViewModel } from "../../view-model/location.view-model";

export function originsGenerator (
  origins: Array<SmallLocation>
): Array<SmallLocationViewModel>{
  return origins;
}
