import React, { useState, useRef } from 'react'

interface MultipleImageUploadProps {
  onImagesChange: (images: string[]) => void
  currentImages?: string[]
  className?: string
}

export default function MultipleImageUpload({
  onImagesChange,
  currentImages = [],
  className = '',
}: MultipleImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<string[]>(currentImages)

  // Local upload function - converts image to base64
  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        const result = reader.result as string
        resolve(result)
      }

      reader.onerror = () => {
        reject(new Error('Greška pri čitanju datoteke'))
      }

      // Convert to base64 data URL
      reader.readAsDataURL(file)
    })
  }

  const handleFileSelect = async (files: FileList) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith('image/')
    )

    if (imageFiles.length === 0) {
      alert('Molim odaberite slike (JPG, PNG, WebP)')
      return
    }

    // Check file sizes
    const oversizedFiles = imageFiles.filter(
      (file) => file.size > 5 * 1024 * 1024
    )
    if (oversizedFiles.length > 0) {
      alert(
        'Neke slike su prevelike. Maksimalna veličina je 5MB po slici.'
      )
      return
    }

    setUploading(true)
    try {
      const uploadedImages = await Promise.all(
        imageFiles.map((file) => uploadImage(file))
      )
      const newImages = [...images, ...uploadedImages]
      setImages(newImages)
      onImagesChange(newImages)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Greška pri obradi slika. Molim pokušajte ponovno.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files)
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onImagesChange(newImages)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [removed] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, removed)
    setImages(newImages)
    onImagesChange(newImages)
  }

  // Update images when currentImages prop changes
  React.useEffect(() => {
    if (currentImages && currentImages.length > 0) {
      setImages(currentImages)
    }
  }, [currentImages])

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Slike proizvoda
        <span className="text-xs text-gray-500 ml-2">
          (Prva slika je glavna)
        </span>
      </label>

      {/* Current images preview */}
      {images.length > 0 && (
        <div className="space-y-3">
          {images.map((image, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg bg-gray-50"
            >
              <div className="flex-shrink-0">
                <img
                  src={image}
                  alt={`Slika ${index + 1}`}
                  className="w-20 h-20 object-cover rounded border border-gray-300"
                />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-700">
                  {index === 0 ? (
                    <span className="text-green-600">⭐ Glavna slika</span>
                  ) : (
                    <span className="text-gray-500">Slika {index + 1}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                    title="Pomakni gore"
                  >
                    ↑
                  </button>
                )}
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index + 1)}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                    title="Pomakni dolje"
                  >
                    ↓
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                  title="Ukloni"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${
            dragOver
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
          }
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!uploading ? handleClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-sm text-gray-600">Obrađujem slike...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-green-600">
                Kliknite za odabir slika
              </span>{' '}
              ili povucite slike ovdje
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, WebP do 5MB (možete odabrati više slika odjednom)
            </p>
          </div>
        )}
      </div>

      {/* Info message */}
      {images.length > 0 && !uploading && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✅ {images.length} slika{' '}
            {images.length === 1 ? 'je' : 'su'} uspješno{' '}
            {images.length === 1 ? 'učitana' : 'učitane'}. Prva slika će biti
            glavna.
          </p>
        </div>
      )}
    </div>
  )
}

