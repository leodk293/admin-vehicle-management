"use client";
import React, { useState, useEffect } from "react";
import { Car, Users, Toolbox, AlertOctagon } from "lucide-react"; // Example icons
import { createClient } from "@/utils/supabase/client";
import { nanoid } from "nanoid";
import Image from "next/image";

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const supabase = createClient();
  async function getVehicles() {
    try {
      const { data, error } = await supabase.from("vehicules").select("*");
      if (error) {
        throw new Error(`An error has occurred : ${error.message}`);
      }
      setVehicles(data || []);
    } catch (error) {
      console.error(error?.message ?? error);
      setVehicles([]);
    }
  }

  useEffect(() => {
    getVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex flex-col w-full items-center text-white p-8">
      {/* Header Section */}
      <header className="mb-12 flex flex-col items-center w-full">
        <h1 className="text-5xl text-center font-extrabold tracking-tight pb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
          Vehicle Management System
        </h1>
        <p className="text-lg text-gray-300">
          Welcome back,{" "}
          <span className="font-semibold text-indigo-400">Admin</span>. Here is
          what&apos;s happening with the fleet today.
        </p>
        <div className="mt-2">
          <span className="inline-block bg-slate-800/60 text-indigo-200 px-4 py-1 rounded-full shadow-sm text-md font-medium">
            {vehicles.length > 0
              ? `A total of ${vehicles.length} vehicles`
              : "Loading vehicle data..."}
          </span>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="flex flex-wrap justify-center w-full gap-7 mb-14">
        <StatCard
          title="Total Vehicles"
          value={vehicles.length}
          icon={<Car size={32} />}
          color="from-blue-600 to-indigo-400"
        />
        <StatCard
          title="Total Clients"
          value="89"
          icon={<Users size={32} />}
          color="from-green-600 to-teal-400"
        />
        <StatCard
          title="In Service"
          value="12"
          icon={<Toolbox size={32} />}
          color="from-yellow-500 to-orange-400"
        />
        <StatCard
          title="Vehicles Available"
          value={
            vehicles.length
              ? vehicles.filter((v) => !v.en_service).length
              : "--"
          }
          icon={<Car size={32} />}
          color="from-cyan-500 to-green-400"
        />
      </div>

      {vehicles.length > 0 ? (
        <section className="w-full max-w-6xl">
          <h2 className="text-2xl font-bold mb-5 text-indigo-200 text-center">
            Fleet Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-[#131924]/80 border border-indigo-500/20 rounded-2xl overflow-hidden shadow-xl transition-transform hover:scale-105"
              >
                <div className="relative h-40 w-full bg-gray-900">
                  <Image
                    src={vehicle.image_url}
                    alt={vehicle.marque}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 350px"
                  />
                  <span
                    className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full
                    ${
                      vehicle.en_service
                        ? "bg-amber-300 text-amber-900"
                        : "bg-green-300 text-green-900"
                    } 
                    backdrop-blur-2xl font-semibold shadow-md`}
                  >
                    {vehicle.en_service ? "In Service" : "Available"}
                  </span>
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <p className="text-xl font-medium text-pink-200 truncate">
                    {vehicle.marque}
                  </p>
                  <p className="text-sm text-gray-300 font-light truncate">
                    <span className="font-medium text-indigo-300">
                      Category:
                    </span>{" "}
                    {vehicle.categorie || vehicle.catgorie}
                  </p>
                  <div className="flex items-center justify-between border-t border-indigo-200/15 mt-2 pt-2">
                    <span className="text-xs text-slate-400">Daily Price:</span>
                    <span className="text-lg font-bold text-indigo-400">
                      ${vehicle.prix_journalier}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center mt-14 text-indigo-200">
          <svg
            className="w-16 h-16 mb-4 animate-spin"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle className="opacity-50" cx="12" cy="12" r="10" />
            <path className="opacity-75" d="M4 12a8 8 0 018-8" />
          </svg>
          <p className="text-xl">Loading fleet vehicles...</p>
        </div>
      )}
    </div>
  );
}

// Reusable Stat Card Component
function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-gray-900 w-[20%] border border-gray-800 p-6 rounded-2xl hover:border-gray-600 transition-all">
      <div className={`mb-4 ${color}`}>{icon}</div>
      <h3 className="text-gray-400 text-sm font-medium uppercase">{title}</h3>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}
