import React from "react";

export default function PageVideoBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10" data-testid="page-video-background">
      <video
        className="h-full w-full object-cover opacity-40"
        src="https://media.base44.com/videos/public/6aae26965c22f8ce890f0526/412e5915e_cosmos_1082992569.mp4"
        autoPlay muted loop playsInline
      />
      <div className="absolute inset-0 bg-background/80" />
    </div>
  );
}