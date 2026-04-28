"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { nanoid } from "nanoid";
import Image from "next/image";

export default function Locations() {
  const supabase = createClient();
  const [locations, setLocations] = useState([]);

  async function getLocations() {
    try {
      const { data: locations, error } = await supabase
        .from("locations")
        .select("*");
      if (error) {
        throw new Error(`An error has occurred : ${error.message}`);
      }
      setLocations(locations);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    getLocations();
  }, []);
  return (
    <div className="flex flex-col items-center w-full px-4 py-8 gap-7 text-white min-h-[70vh] ">
      <h1 className="text-4xl font-extrabold tracking-tight pb-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">
        Current User Locations
      </h1>
      {locations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {locations.map((element) => (
            <div
              key={nanoid(10)}
              className="bg-[#1e263a]/80 border border-indigo-500/20 rounded-2xl overflow-hidden shadow-md transition-transform hover:scale-[1.03]"
            >
              <div className="relative w-full h-44 bg-gray-900">
                <Image
                  src={element.vehicle_image}
                  alt={element.vehicle_marque || "Vehicle image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <span className="absolute top-2 right-2 bg-indigo-300/90 text-indigo-900 text-xs px-3 py-1 rounded-full font-semibold shadow">
                  Rented Vehicle
                </span>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-indigo-400">
                    <Image
                      src={element.client_avatar}
                      alt={element.nom_client}
                      fill
                      className="object-cover"
                      sizes="36px"
                    />
                  </div>
                  <span className="font-medium text-lg text-pink-200 truncate">
                    {element.nom_client}
                  </span>
                </div>

                {element.rental_date && (
                  <div className="flex text-xs text-indigo-200/70 mt-1">
                    <span>
                      Rental Date:{" "}
                      <span className="font-semibold">
                        {element.rental_date}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-56 text-indigo-200">
          <svg
            className="w-14 h-14 mb-4 animate-pulse text-indigo-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              d="M9 21h6a2 2 0 0 0 2-2v-5h2.59a1 1 0 0 0 .7-1.71l-8.3-8.29a1 1 0 0 0-1.41 0l-8.3 8.29A1 1 0 0 0 4.41 14H7v5a2 2 0 0 0 2 2Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-lg font-medium">
            No active locations found.
          </span>
        </div>
      )}
    </div>
  );
}
