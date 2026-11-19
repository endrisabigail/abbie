import { lazy, Suspense } from "react";

const CritterStage = lazy(() => import("./CritterStage.jsx"));

export default function LazyCritter(props) {
  return (
    <Suspense
      fallback={
        <div className="critter-stage-placeholder">
          <span>Loading…</span>
        </div>
      }
    >
      <CritterStage {...props} />
    </Suspense>
  );
}
