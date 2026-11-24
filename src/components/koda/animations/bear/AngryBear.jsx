import { AngryRig } from "../panda/AngryPanda";
import { BearMood } from "./bearRig";

export default function AngryBear(props) {
  return <BearMood {...props} modelUrl={(import.meta.env.BASE_URL + "models/characters/bear/angry.glb")} Rig={AngryRig} />;
}
