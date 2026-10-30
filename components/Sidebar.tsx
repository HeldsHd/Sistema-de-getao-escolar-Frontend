"use client";

import { use, useState } from "react";

export default function Sidebar() {
  useState(false);

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Perfil</h2>
      </div>
    </div>
  );
}
