"use client";
import React, { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { Car } from "lucide-react";

const thClass =
  "px-4 py-3 text-[11px] uppercase tracking-widest text-gray-500 font-medium text-left";

const tdClass = "px-4 py-3 text-[13px] text-gray-300 align-middle";

export default function Vehicles() {
  const supabase = useMemo(() => createClient(), []);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      const { data, error } = await supabase.from("vehicules").select("*");
      if (error) {
        setMessage({
          type: "error",
          text: `Chargement des véhicules impossible: ${error.message}`,
        });
        setVehicles([]);
      } else {
        setVehicles(data ?? []);
      }
      setLoading(false);
    };
    fetchVehicles();
  }, [supabase]);

  const deleteVehicle = async (id) => {
    const confirmed = window.confirm("Supprimer ce véhicule ?");
    if (!confirmed) return;

    setDeletingId(id);
    setMessage({ type: "", text: "" });

    const { error } = await supabase.from("vehicules").delete().eq("id", id);

    if (error) {
      setMessage({
        type: "error",
        text: `Suppression impossible: ${error.message}`,
      });
    } else {
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      setMessage({ type: "success", text: "Véhicule supprimé avec succès." });
    }
    setDeletingId(null);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" />
          <span className="text-[11px] tracking-widest uppercase text-gray-500">
            Gestion de flotte
          </span>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Liste des véhicules
          </h2>
          <span className="text-[11px] text-gray-500 bg-white/[0.04] border border-white/[0.07] rounded-full px-3 py-1">
            {vehicles.length} véhicule{vehicles.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Feedback banner */}
      {message.text && (
        <div
          className={`flex items-center gap-2 text-[13px] px-4 py-3 rounded-lg border mb-6 ${
            message.type === "error"
              ? "bg-red-500/10 border-red-500/20 text-red-400"
              : "bg-green-500/10 border-green-500/20 text-green-400"
          }`}
        >
          <span>{message.type === "error" ? "⚠" : "✓"}</span>
          {message.text}
        </div>
      )}

      {/* States */}
      {loading ? (
        <div className="flex items-center gap-3 text-gray-500 py-16 justify-center">
          <div className="w-5 h-5 rounded-full border-2 border-gray-700 border-t-violet-500 animate-spin" />
          <span className="text-sm">Chargement des véhicules...</span>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-600 gap-3">
          <Car size={32} />
          <p className="text-sm">Aucun véhicule trouvé.</p>
          <Link
            href="/create"
            className="text-[13px] text-violet-400 hover:text-violet-300 transition-colors"
          >
            Ajouter un véhicule →
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/[0.07] bg-[#131924]">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-white/[0.06] bg-[#0b0f1a]/60">
                <th className={thClass}>Image</th>
                <th className={thClass}>Immatriculation</th>
                <th className={thClass}>Marque</th>
                <th className={thClass}>Modèle</th>
                <th className={thClass}>Catégorie</th>
                <th className={thClass}>Transmission</th>
                <th className={thClass}>Carburant</th>
                <th className={thClass}>Prix / Jour</th>
                <th className={thClass}>Statut</th>
                <th className={thClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  className="border-t border-white/[0.05] hover:bg-white/[0.02] transition-colors duration-100 group"
                >
                  {/* Image */}
                  <td className={tdClass}>
                    {vehicle.image_url ? (
                      <Image
                        src={vehicle.image_url}
                        alt={`${vehicle.marque ?? "Véhicule"} ${
                          vehicle.modele ?? ""
                        }`}
                        width={72}
                        height={48}
                        unoptimized
                        className="h-12 w-[72px] rounded-lg object-cover border border-white/[0.07]"
                      />
                    ) : (
                      <div className="h-12 w-[72px] rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-gray-600">
                        <Car size={16} />
                      </div>
                    )}
                  </td>

                  {/* Immatriculation */}
                  <td className={tdClass}>
                    <span className="font-mono text-[12px] text-white bg-white/[0.06] border border-white/[0.07] px-2 py-0.5 rounded">
                      {vehicle.immatriculation}
                    </span>
                  </td>

                  {/* Marque */}
                  <td className={tdClass}>
                    <span className="font-medium text-white">
                      {vehicle.marque}
                    </span>
                  </td>

                  {/* Modèle */}
                  <td className={tdClass}>{vehicle.modele}</td>

                  {/* Catégorie */}
                  <td className={tdClass}>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                      {vehicle.categorie}
                    </span>
                  </td>

                  {/* Transmission */}
                  <td className={tdClass}>{vehicle.transmission}</td>

                  {/* Carburant */}
                  <td className={tdClass}>{vehicle.carburant}</td>

                  {/* Prix */}
                  <td className={tdClass}>
                    <span className="font-semibold text-white">
                      {vehicle.prix_journalier ?? "—"}
                    </span>
                    <span className="text-[11px] text-gray-600 ml-1">EUR</span>
                  </td>

                  {/* Statut */}
                  <td className={tdClass}>
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                        vehicle.disponible
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {vehicle.disponible ? "Disponible" : "Loué"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className={tdClass}>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/vehicles/${vehicle.id}/edit`}
                        className="text-[12px] font-medium text-gray-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/[0.07] hover:border-white/20 hover:bg-white/5 transition-all duration-150"
                      >
                        Modifier
                      </Link>
                      <button
                        onClick={() => deleteVehicle(vehicle.id)}
                        disabled={deletingId === vehicle.id}
                        className="text-[12px] font-medium text-red-500/70 hover:text-red-400 px-3 py-1.5 rounded-lg border border-red-500/10 hover:border-red-500/30 hover:bg-red-500/5 disabled:opacity-40 transition-all duration-150 cursor-pointer"
                      >
                        {deletingId === vehicle.id ? (
                          <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full border border-red-500/30 border-t-red-400 animate-spin" />
                            Suppression...
                          </span>
                        ) : (
                          "Supprimer"
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
