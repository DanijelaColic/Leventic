import React, { useState, useRef } from 'react'

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  currentImage?: string
  className?: string
}

export default function ImageUpload({ 
  onImageUploaded, 
  currentImage, 
  className = '' 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Molim odaberite sliku (JPG, PNG, WebP)')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Slika je prevelika. Maksimalna veličina je 5MB.')
      return
    }

    setUploading(true)
    try {
      const imageUrl = await uploadImage(file)
      onImageUploaded(imageUrl)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Greška pri obradi slike. Molim pokušajte s manjom slikom.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
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
      handleFileSelect(files[0])
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Slika proizvoda
      </label>
      
      {/* Current image preview */}
      {currentImage && !uploading && (
        <div className="mb-4">
          <img
            src={currentImage}
            alt="Current product image"
            className="w-32 h-32 object-cover rounded-lg border border-gray-300"
          />
          <p className="text-xs text-gray-500 mt-1">Trenutna slika</p>
        </div>
      )}

      {/* Upload area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${dragOver 
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
          onChange={handleFileInputChange}
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-sm text-gray-600">Obrađujem sliku...</p>
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
              <span className="font-medium text-green-600">Kliknite za odabir slike</span>
              {' '}ili povucite sliku ovdje
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, WebP do 5MB
            </p>
          </div>
        )}
      </div>

      {/* Success message */}
      {currentImage && !uploading && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✅ Slika je uspješno učitana i spremna za spremanje
          </p>
        </div>
      )}
    </div>
  )
}
