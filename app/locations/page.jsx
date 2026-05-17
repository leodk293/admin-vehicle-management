"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Car } from "lucide-react";
import Image from "next/image";

export default function Locations() {
  const supabase = createClient();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to determine if a rental is still in process.
  function isActiveRental(location) {
    // try common end date field names
    const endDateRaw =
      location.end_date ||
      location.endDate ||
      location.date_fin ||
      location.dateFin ||
      location.fin_date ||
      location.rental_end ||
      location.rental_end_date ||
      null;

    if (!endDateRaw) {
      // If no end date is available, treat as active (so it's visible in "in process")
      return true;
    }

    const end = new Date(endDateRaw);
    if (Number.isNaN(end.getTime())) return true;

    const now = new Date();
    // Active if end date is in the future (or today)
    return end >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  async function getLocations() {
    try {
      const { data, error } = await supabase.from("locations").select("*");
      if (error) throw new Error(`An error has occurred: ${error.message}`);
      setLocations(data ?? []);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" />
          <span className="text-[11px] tracking-widest uppercase text-gray-500">
            Fleet mangement
          </span>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Rentals
          </h2>
          {!loading && (
            <span className="text-[11px] text-gray-500 bg-white/[0.04] border border-white/[0.07] rounded-full px-3 py-1">
              {locations.length} rental{locations.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center gap-3 text-gray-500 py-16 justify-center">
          <div className="w-5 h-5 rounded-full border-2 border-gray-700 border-t-violet-500 animate-spin" />
          <span className="text-sm">Rentals loading...</span>
        </div>
      ) : /* Empty state */ locations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-600">
          <Car size={32} />
          <p className="text-sm">No rentals found.</p>
        </div>
      ) : (
        <> 
          {/* Rentals in process */}
          {(() => {
            const active = locations.filter(isActiveRental);
            const history = locations.filter((l) => !isActiveRental(l));
            return (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">In process</h3>
                  {active.length === 0 ? (
                    <div className="text-sm text-gray-500">No ongoing rentals.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {active.map((location) => (
                        <div
                          key={location.id}
                          className="bg-[#131924] border border-white/[0.07] rounded-xl overflow-hidden hover:border-white/20 transition-colors group"
                        >
                          <div className="relative w-full h-44 bg-[#0b0f1a]">
                            <Image
                              src={location.vehicle_image}
                              alt={location.vehicle_marque || "Vehicle"}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, 400px"
                            />
                            <span className="absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30">
                              Rented
                            </span>
                          </div>

                          <div className="p-4 flex flex-col gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/[0.07] shrink-0">
                                <Image
                                  src={location.client_avatar}
                                  alt={location.nom_client}
                                  fill
                                  className="object-cover"
                                  sizes="32px"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-white truncate">
                                  {location.nom_client}
                                </p>
                                <p className="text-[11px] text-gray-500">Client</p>
                              </div>
                            </div>

                            <div className="border-t border-white/[0.06]" />

                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-gray-500">
                                {location.vehicle_marque ?? "—"}
                              </span>
                              {location.rental_date && (
                                <span className="text-[11px] text-gray-500">
                                  <span className="text-gray-600 mr-1">Date:</span>
                                  <span className="text-gray-300 font-medium">
                                    {location.rental_date}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* History */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-white mb-3">Rental History</h3>
                  {history.length === 0 ? (
                    <div className="text-sm text-gray-500">No past rentals.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {history.map((location) => (
                        <div
                          key={location.id}
                          className="bg-[#0f1620] border border-white/[0.04] rounded-xl overflow-hidden group"
                        >
                          <div className="p-3 flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-md overflow-hidden border border-white/[0.06] shrink-0">
                              <Image
                                src={location.vehicle_image}
                                alt={location.vehicle_marque || "Vehicle"}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                            <div className="min-w-0">
                              
                              <Image
                              alt={location.nom_client}
                              src={location.client_avatar}
                              width={30}
                              height={30}
                              className="rounded-full border border-white object-cover"
                              />
                              <p className="text-[12px] pt-2 text-gray-500 truncate">
                                {location.nom_client}
                              </p>
                              {location.rental_date && (
                                <p className="text-[11px] text-gray-500 mt-1">
                                  <span className="text-gray-600 mr-1">From:</span>
                                  <span className="text-gray-300">{location.rental_date}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </>
      )}
    </section>
  );
}
