"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const inputClass =
  "w-full rounded-lg border border-white/[0.07] bg-[#0b0f1a] px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all duration-150";

const labelClass = "flex flex-col gap-1.5 text-[13px] text-gray-400";

export default function Create() {
  const supabase = createClient();
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
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
  };

  const resetForm = () => {
    setFormData({
      immatriculation: "",
      marque: "",
      modele: "",
      categorie: "Citadine",
      transmission: "Manuelle",
      carburant: "Diesel",
      prix_journalier: "",
      disponible: true,
    });
    setImageFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      let imageUrl = null;

      if (imageFile) {
        const safeFileName = imageFile.name.replace(/\s+/g, "_");
        const imagePath = `vehicules/${Date.now()}-${safeFileName}`;

        const { error: uploadError } = await supabase.storage
          .from("vehicle_image")
          .upload(imagePath, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError)
          throw new Error(`Upload image impossible: ${uploadError.message}`);

        const { data } = supabase.storage
          .from("vehicle_image")
          .getPublicUrl(imagePath);
        imageUrl = data.publicUrl;
      }

      const { error: insertError } = await supabase.from("vehicules").insert({
        ...formData,
        prix_journalier: Number(formData.prix_journalier),
        image_url: imageUrl,
      });

      if (insertError)
        throw new Error(
          `Creation du vehicule impossible: ${insertError.message}`,
        );

      setMessage({ type: "success", text: "Vehicule créé avec succès." });
      resetForm();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Une erreur est survenue.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" />
          <span className="text-[11px] tracking-widest uppercase text-gray-500">
            Gestion de flotte
          </span>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white">
          Ajouter un véhicule
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#131924] border border-white/[0.07] rounded-xl p-6 space-y-6"
      >
        {/* Section: Identité */}
        <fieldset className="space-y-4">
          <legend className="text-[11px] uppercase tracking-widest text-gray-600 mb-3">
            Identité
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className={labelClass}>
              Immatriculation
              <input
                required
                name="immatriculation"
                value={formData.immatriculation}
                onChange={handleChange}
                className={inputClass}
                placeholder="AA-123-BB"
              />
            </label>
            <label className={labelClass}>
              Marque
              <input
                required
                name="marque"
                value={formData.marque}
                onChange={handleChange}
                className={inputClass}
                placeholder="Peugeot"
              />
            </label>
            <label className={labelClass}>
              Modèle
              <input
                required
                name="modele"
                value={formData.modele}
                onChange={handleChange}
                className={inputClass}
                placeholder="208"
              />
            </label>
          </div>
        </fieldset>

        {/* Divider */}
        <div className="border-t border-white/[0.06]" />

        {/* Section: Caractéristiques */}
        <fieldset className="space-y-4">
          <legend className="text-[11px] uppercase tracking-widest text-gray-600 mb-3">
            Caractéristiques
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className={labelClass}>
              Catégorie
              <select
                name="categorie"
                value={formData.categorie}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Citadine">Citadine</option>
                <option value="Berline">Berline</option>
                <option value="SUV">SUV</option>
                <option value="Luxe">Luxe</option>
              </select>
            </label>
            <label className={labelClass}>
              Transmission
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Manuelle">Manuelle</option>
                <option value="Automatique">Automatique</option>
              </select>
            </label>
            <label className={labelClass}>
              Carburant
              <select
                name="carburant"
                value={formData.carburant}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Diesel">Diesel</option>
                <option value="Essence">Essence</option>
                <option value="Hybride">Hybride</option>
                <option value="Electrique">Électrique</option>
              </select>
            </label>
          </div>
        </fieldset>

        {/* Divider */}
        <div className="border-t border-white/[0.06]" />

        {/* Section: Tarif & Image */}
        <fieldset className="space-y-4">
          <legend className="text-[11px] uppercase tracking-widest text-gray-600 mb-3">
            Tarif & Image
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className={labelClass}>
              Prix journalier (EUR)
              <input
                required
                min="0"
                step="0.01"
                type="number"
                name="prix_journalier"
                value={formData.prix_journalier}
                onChange={handleChange}
                className={inputClass}
                placeholder="69.99"
              />
            </label>
            <label className={labelClass}>
              Photo du véhicule
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-lg border border-white/[0.07] bg-[#0b0f1a] px-3 py-2 text-sm text-gray-500 outline-none cursor-pointer
                  file:mr-3 file:rounded-md file:border-0 file:bg-violet-600 file:px-3 file:py-1
                  file:text-[12px] file:font-medium file:text-white file:cursor-pointer
                  hover:border-violet-500/40 transition-all duration-150"
              />
            </label>
          </div>

          {/* Image preview */}
          {previewUrl && (
            <div className="relative w-fit rounded-xl overflow-hidden border border-white/[0.07] group">
              <Image
                src={previewUrl}
                alt="Aperçu du véhicule"
                width={240}
                height={150}
                className="object-cover block"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center">
                <span className="text-[11px] text-white/70">Aperçu</span>
              </div>
            </div>
          )}
        </fieldset>

        {/* Divider */}
        <div className="border-t border-white/[0.06]" />

        {/* Disponibilité */}
        <label className="flex items-center gap-3 cursor-pointer w-fit group">
          <div className="relative">
            <input
              type="checkbox"
              name="disponible"
              checked={formData.disponible}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-9 h-5 rounded-full bg-white/10 peer-checked:bg-violet-600 border border-white/10 peer-checked:border-violet-500 transition-all duration-200" />
            <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white/40 peer-checked:bg-white peer-checked:translate-x-4 transition-all duration-200" />
          </div>
          <span className="text-[13px] text-gray-400 group-hover:text-gray-300 transition-colors">
            Véhicule disponible à la location
          </span>
        </label>

        {/* Feedback message */}
        {message.text && (
          <div
            className={`flex items-center gap-2 text-[13px] px-4 py-3 rounded-lg border ${
              message.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-green-500/10 border-green-500/20 text-green-400"
            }`}
          >
            <span>{message.type === "error" ? "⚠" : "✓"}</span>
            {message.text}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg transition-colors duration-150 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Création...
              </>
            ) : (
              "Créer le véhicule"
            )}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="text-[13px] text-gray-500 hover:text-gray-300 px-4 py-2.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/[0.07] transition-all duration-150 cursor-pointer"
          >
            Réinitialiser
          </button>
        </div>
      </form>
    </section>
  );
}
