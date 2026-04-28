"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function EditVehiclePage() {
  const supabase = useMemo(() => createClient(), []);
  const params = useParams();
  const router = useRouter();
  const vehicleId = params?.vehicle_id;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [formData, setFormData] = useState({
    immatriculation: "",
    marque: "",
    modele: "",
    categorie: "Citadine",
    transmission: "Manuelle",
    carburant: "Diesel",
    prix_journalier: "",
    disponible: true,
  });

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!vehicleId) return;

      const { data, error } = await supabase
        .from("vehicules")
        .select("*")
        .eq("id", vehicleId)
        .single();

      if (error || !data) {
        setMessage({
          type: "error",
          text: `Chargement du vehicule impossible: ${error?.message ?? "Introuvable"}`,
        });
        setLoading(false);
        return;
      }

      setFormData({
        immatriculation: data.immatriculation ?? "",
        marque: data.marque ?? "",
        modele: data.modele ?? "",
        categorie: data.categorie ?? "Citadine",
        transmission: data.transmission ?? "Manuelle",
        carburant: data.carburant ?? "Diesel",
        prix_journalier: data.prix_journalier ?? "",
        disponible: Boolean(data.disponible),
      });
      setPreviewUrl(data.image_url ?? "");
      setLoading(false);
    };

    fetchVehicle();
  }, [supabase, vehicleId]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] ?? null;

    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!vehicleId) return;

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      let imageUrl = previewUrl;

      if (imageFile) {
        const safeFileName = imageFile.name.replace(/\s+/g, "_");
        const imagePath = `vehicules/${Date.now()}-${safeFileName}`;

        const { error: uploadError } = await supabase.storage
          .from("vehicle_image")
          .upload(imagePath, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Upload image impossible: ${uploadError.message}`);
        }

        const { data } = supabase.storage
          .from("vehicle_image")
          .getPublicUrl(imagePath);
        imageUrl = data.publicUrl;
      }

      const payload = {
        ...formData,
        prix_journalier: Number(formData.prix_journalier),
        image_url: imageUrl || null,
      };

      const { error: updateError } = await supabase
        .from("vehicules")
        .update(payload)
        .eq("id", vehicleId);

      if (updateError) {
        throw new Error(`Modification impossible: ${updateError.message}`);
      }

      setMessage({ type: "success", text: "Vehicule modifie avec succes." });
      router.push("/vehicles");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Une erreur est survenue.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="max-w-3xl mx-auto px-4 py-10 text-white">
        Chargement...
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Modifier un vehicule</h2>
        <Link href="/vehicles" className="text-sm text-gray-300 hover:text-white">
          Retour a la liste
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 text-white bg-[#111218] border border-gray-800 rounded-xl p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2 text-sm">
            <span>Immatriculation</span>
            <input
              required
              name="immatriculation"
              value={formData.immatriculation}
              onChange={handleChange}
              className="rounded-md border border-gray-700 bg-[#0b0c12] px-3 py-2"
              placeholder="AA-123-BB"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span>Marque</span>
            <input
              required
              name="marque"
              value={formData.marque}
              onChange={handleChange}
              className="rounded-md border border-gray-700 bg-[#0b0c12] px-3 py-2"
              placeholder="Peugeot"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span>Modele</span>
            <input
              required
              name="modele"
              value={formData.modele}
              onChange={handleChange}
              className="rounded-md border border-gray-700 bg-[#0b0c12] px-3 py-2"
              placeholder="208"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span>Categorie</span>
            <select
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              className="rounded-md border border-gray-700 bg-[#0b0c12] px-3 py-2"
            >
              <option value="Citadine">Citadine</option>
              <option value="Berline">Berline</option>
              <option value="SUV">SUV</option>
              <option value="Luxe">Luxe</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span>Transmission</span>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="rounded-md border border-gray-700 bg-[#0b0c12] px-3 py-2"
            >
              <option value="Manuelle">Manuelle</option>
              <option value="Automatique">Automatique</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span>Carburant</span>
            <select
              name="carburant"
              value={formData.carburant}
              onChange={handleChange}
              className="rounded-md border border-gray-700 bg-[#0b0c12] px-3 py-2"
            >
              <option value="Diesel">Diesel</option>
              <option value="Essence">Essence</option>
              <option value="Hybride">Hybride</option>
              <option value="Electrique">Electrique</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span>Prix journalier (EUR)</span>
            <input
              required
              min="0"
              step="0.01"
              type="number"
              name="prix_journalier"
              value={formData.prix_journalier}
              onChange={handleChange}
              className="rounded-md border border-gray-700 bg-[#0b0c12] px-3 py-2"
              placeholder="69.99"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span>Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="rounded-md border border-gray-700 bg-[#0b0c12] px-3 py-2 file:mr-3 file:rounded file:border-0 file:bg-gray-200 file:px-3 file:py-1 file:text-black"
            />
          </label>
        </div>

        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="disponible"
            checked={formData.disponible}
            onChange={handleChange}
            className="h-4 w-4 accent-white"
          />
          Vehicule disponible
        </label>

        {previewUrl && (
          <div className="rounded-lg overflow-hidden border border-gray-800 w-fit">
            <Image
              src={previewUrl}
              alt="Apercu du vehicule"
              width={220}
              height={140}
              unoptimized
              className="object-cover"
            />
          </div>
        )}

        {message.text && (
          <p className={message.type === "error" ? "text-red-400" : "text-green-400"}>
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-white text-black px-4 py-2 font-medium disabled:opacity-60"
        >
          {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </form>
    </section>
  );
}
