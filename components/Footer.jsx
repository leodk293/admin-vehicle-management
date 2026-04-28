import React from "react";

export default function Footer() {
  return (
    <footer className="w-full py-4 mt-10 bg-[#131924] text-center text-gray-400 text-sm">
      © {new Date().getFullYear()} Vehicle Management. All rights reserved.
    </footer>
  );
}
