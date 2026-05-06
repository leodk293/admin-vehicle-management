"use client";
import React, { useState, useEffect } from "react";
import { Car, Users, Key, CheckCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [clients, setClients] = useState(0);
  const supabase = createClient();

  async function getVehicles() {
    try {
      const { data, error } = await supabase.from("vehicules").select("*");
      if (error) throw new Error(`An error has occurred : ${error.message}`);
      setVehicles(data || []);
    } catch (error) {
      console.error(error?.message ?? error);
      setVehicles([]);
    }
  }

  async function getClients() {
    try {
      const { data, error } = await supabase.from("clients").select("*");
      if (error) throw new Error(`An error has occurred : ${error.message}`);
      setClients(data?.length ?? 0);
    } catch (error) {
      console.error(error?.message ?? error);
      setClients(0);
    }
  }

  const rentedCount = vehicles.filter((v) => !v.disponible).length;
  const availableCount = vehicles.filter((v) => v.disponible).length;

  useEffect(() => {
    getVehicles();
    getClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen  text-white px-6 py-10 font-sans">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" />
          <span className="text-[11px] tracking-widest uppercase text-gray-500">
            Fleet Management
          </span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight mb-1">
          Locomote Admin
        </h1>
        <p className="text-sm text-gray-400">
          Welcome back,{" "}
          <span className="text-violet-400 font-medium">Admin</span>.
          Here&apos;s your fleet snapshot.
        </p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <KpiCard
          label="Total Vehicles"
          value={vehicles.length}
          icon={<Car size={18} />}
          accent="blue"
        />
        <KpiCard
          label="Total Clients"
          value={clients}
          icon={<Users size={18} />}
          accent="teal"
        />
        <KpiCard
          label="Vehicles Rented"
          value={rentedCount}
          icon={<Key size={18} />}
          accent="amber"
        />
        <KpiCard
          label="Available"
          value={availableCount}
          icon={<CheckCircle size={18} />}
          accent="green"
        />
      </div>

      {/* Fleet Section */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold tracking-tight text-white">
          Fleet Overview
        </h2>
        <span className="text-[11px] text-gray-500 bg-white/5 border border-white/10 rounded-full px-3 py-1">
          {vehicles.length > 0 ? `${vehicles.length} vehicles` : "Loading..."}
        </span>
      </div>

      {vehicles.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-600 gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-gray-700 border-t-violet-500 animate-spin" />
          <p className="text-sm">Loading vehicles...</p>
        </div>
      )}
    </div>
  );
}

// ─── KPI Card ────────────────────────────────────────────────────────────────

const accentMap = {
  blue: {
    bar: "bg-blue-500",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
  },
  teal: {
    bar: "bg-teal-500",
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-400",
  },
  amber: {
    bar: "bg-amber-500",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
  },
  green: {
    bar: "bg-green-500",
    iconBg: "bg-green-500/10",
    iconColor: "text-green-400",
  },
};

function KpiCard({ label, value, icon, accent }) {
  const { bar, iconBg, iconColor } = accentMap[accent];
  return (
    <div className="relative bg-[#131924] border border-white/[0.07] rounded-xl p-5 overflow-hidden">
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${bar}`} />
      {/* Icon */}
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center mb-4 ${iconBg} ${iconColor}`}
      >
        {icon}
      </div>
      <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-1">
        {label}
      </p>
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
    </div>
  );
}

// ─── Vehicle Card ─────────────────────────────────────────────────────────────

function VehicleCard({ vehicle }) {
  return (
    <div className="bg-[#131924] border border-white/[0.07] rounded-xl overflow-hidden hover:border-white/20 transition-colors group">
      {/* Image */}
      <div className="relative h-28 w-full bg-[#0f1520]">
        {vehicle.image_url ? (
          <Image
            src={vehicle.image_url}
            alt={vehicle.marque}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-700">
            <Car size={28} />
          </div>
        )}
        {/* Status badge */}
        <span
          className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            vehicle.disponible
              ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/30"
              : "bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30"
          }`}
        >
          {vehicle.disponible ? "Available" : "Rented"}
        </span>
      </div>

      {/* Body */}
      <div className="p-3">
        <p className="text-sm font-bold text-white truncate mb-0.5">
          {vehicle.marque}
        </p>
        <p className="text-[11px] text-gray-500 truncate mb-3">
          {vehicle.categorie || vehicle.catgorie}
        </p>
        <div className="flex items-center justify-between border-t border-white/[0.06] pt-2.5">
          <span className="text-[11px] text-gray-600">Per day</span>
          <span className="text-sm font-bold text-white">
            ${vehicle.prix_journalier}
          </span>
        </div>
      </div>
    </div>
  );
}
