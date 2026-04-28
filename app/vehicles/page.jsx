"use client";
import React from "react";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";

export default function Vehicles() {
  const supabase = useMemo(() => createClient(), []);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchVehicles = async () => {
      const { data, error } = await supabase.from("vehicules").select("*");

      if (error) {
        setMessage({
          type: "error",
          text: `Chargement des vehicules impossible: ${error.message}`,
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
    const confirmed = window.confirm("Supprimer ce vehicule ?");
    if (!confirmed) return;

    setMessage({ type: "", text: "" });
    const { error } = await supabase.from("vehicules").delete().eq("id", id);

    if (error) {
      setMessage({
        type: "error",
        text: `Suppression impossible: ${error.message}`,
      });
      return;
    }

    setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== id));
    setMessage({ type: "success", text: "Vehicule supprime avec succes." });
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 text-white">
      <h2 className="text-2xl font-semibold mb-6">Liste des vehicules</h2>

      {message.text && (
        <p
          className={
            message.type === "error"
              ? "mb-4 text-red-400"
              : "mb-4 text-green-400"
          }
        >
          {message.text}
        </p>
      )}

      {loading ? (
        <p className="text-gray-300">Chargement...</p>
      ) : vehicles.length === 0 ? (
        <p className="text-gray-300">Aucun vehicule trouve.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-800 bg-[#111218]">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-[#0b0c12]">
              <tr className="text-left">
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Immatriculation</th>
                <th className="px-4 py-3">Marque</th>
                <th className="px-4 py-3">Modele</th>
                <th className="px-4 py-3">Categorie</th>
                <th className="px-4 py-3">Transmission</th>
                <th className="px-4 py-3">Carburant</th>
                <th className="px-4 py-3">Prix/Jour</th>
                <th className="px-4 py-3">Disponible</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => {
                return (
                  <tr
                    key={vehicle.id}
                    className="border-t border-gray-800 align-top"
                  >
                    <td className="px-4 py-3">
                      {vehicle.image_url ? (
                        <Image
                          src={vehicle.image_url}
                          alt={`${vehicle.marque ?? "Vehicule"} ${
                            vehicle.modele ?? ""
                          }`}
                          width={80}
                          height={56}
                          unoptimized
                          className="h-14 w-20 rounded-md object-cover border border-gray-700"
                        />
                      ) : (
                        <span className="text-gray-400">Aucune image</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{vehicle.immatriculation}</td>
                    <td className="px-4 py-3">{vehicle.marque}</td>
                    <td className="px-4 py-3">{vehicle.modele}</td>
                    <td className="px-4 py-3">{vehicle.categorie}</td>
                    <td className="px-4 py-3">{vehicle.transmission}</td>
                    <td className="px-4 py-3">{vehicle.carburant}</td>
                    <td className="px-4 py-3">
                      {`${vehicle.prix_journalier ?? "-"} EUR`}
                    </td>
                    <td className="px-4 py-3">
                      {vehicle.disponible ? "Oui" : "Non"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/vehicles/${vehicle.id}/edit`}
                          className="rounded bg-blue-600 px-3 py-1"
                        >
                          Modifier
                        </Link>
                        <button
                          onClick={() => deleteVehicle(vehicle.id)}
                          className="rounded bg-red-600 px-3 py-1"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
