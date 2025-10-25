"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Camera, Upload, X } from "lucide-react"

interface ImageUploadProps {
  onImageSelected: (file: File) => void
  onImageRemoved: () => void
  previewUrl: string | null
  className?: string
}

export default function ImageUpload({ onImageSelected, onImageRemoved, previewUrl, className = "" }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido")
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen es demasiado grande. El tamaño máximo es 5MB")
      return
    }

    onImageSelected(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido")
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen es demasiado grande. El tamaño máximo es 5MB")
      return
    }

    onImageSelected(file)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      {previewUrl ? (
        <div className="relative w-full h-48 mb-4 border rounded-md overflow-hidden">
          <Image src={previewUrl || "/placeholder.svg"} alt="Vista previa" fill className="object-contain" />
          <button
            type="button"
            onClick={onImageRemoved}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={triggerFileInput}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full h-48 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging ? "border-[#e41e26] bg-red-50" : "border-gray-300 hover:border-[#e41e26]"
          }`}
        >
          <Camera className="h-12 w-12 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Arrastra una imagen o haz clic para seleccionar</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG o JPEG (máx. 5MB)</p>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

      {!previewUrl && (
        <button
          type="button"
          onClick={triggerFileInput}
          className="mt-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e41e26]"
        >
          <Upload className="h-4 w-4 mr-2" />
          Seleccionar imagen
        </button>
      )}
    </div>
  )
}
