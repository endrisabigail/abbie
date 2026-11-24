import { SleepingRig } from "../panda/SleepingPanda";
import { BearMood } from "./bearRig";

export default function SleepingBear(props) {
  return <BearMood {...props} modelUrl={(import.meta.env.BASE_URL + "models/characters/bear/sleeping.glb")} Rig={SleepingRig} />;
}
