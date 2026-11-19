import { lazy, Suspense } from "react";

const MeStage = lazy(() => import("./MeStage.jsx"));

export default function LazyMe() {
  return (
    <Suspense fallback={<div className="me-stage" />}>
      <MeStage />
    </Suspense>
  );
}
