import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface Photo {
  id: string;
  src: string;
  alt: string;
  tags: string[];
  category: string;
  size: string;
  uploadedAt: string;
}

interface PhotoLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (imageSrc: string) => void;
  maxSelection?: number;
  allowUpload?: boolean;
  showCategories?: boolean;
  showTags?: boolean;
  className?: string;
}

const PhotoLibrary: React.FC<PhotoLibraryProps> = ({
  isOpen,
  onClose,
  onInsert,
  maxSelection = 1,
  allowUpload = true,
  showCategories = true,
  showTags = true,
  className = '',
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [previewImage, setPreviewImage] = useState<Photo | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Sample data - in a real app, this would come from an API
  const [photos, setPhotos] = useState<Photo[]>([
    { id: '1', src: '/assets/image-1.png', alt: 'Mountain landscape', tags: ['nature', 'mountain'], category: 'nature', size: '1.2 MB', uploadedAt: '2023-05-15' },
    { id: '2', src: '/assets/image-2.png', alt: 'City skyline', tags: ['city', 'urban'], category: 'urban', size: '2.5 MB', uploadedAt: '2023-05-14' },
    { id: '3', src: '/assets/image-3.png', alt: 'Beach sunset', tags: ['beach', 'sunset'], category: 'nature', size: '1.8 MB', uploadedAt: '2023-05-13' },
    { id: '4', src: '/assets/image-4.png', alt: 'Forest path', tags: ['forest', 'nature'], category: 'nature', size: '2.1 MB', uploadedAt: '2023-05-12' },
    { id: '5', src: '/assets/image-5.png', alt: 'Modern architecture', tags: ['architecture', 'modern'], category: 'architecture', size: '1.5 MB', uploadedAt: '2023-05-11' },
    { id: '6', src: '/assets/image-6.png', alt: 'Desert landscape', tags: ['desert', 'nature'], category: 'nature', size: '1.9 MB', uploadedAt: '2023-05-10' },
    { id: '7', src: '/assets/image-7.png', alt: 'Night city lights', tags: ['city', 'night'], category: 'urban', size: '2.3 MB', uploadedAt: '2023-05-09' },
    { id: '8', src: '/assets/image-8.png', alt: 'Ocean waves', tags: ['ocean', 'water'], category: 'nature', size: '1.7 MB', uploadedAt: '2023-05-08' },
  ]);

  const categories = [
    { id: 'all', name: t('photoLibrary.allPhotos'), icon: '📷' },
    { id: 'nature', name: t('photoLibrary.nature'), icon: '🌳' },
    { id: 'urban', name: t('photoLibrary.urban'), icon: '🏙️' },
    { id: 'architecture', name: t('photoLibrary.architecture'), icon: '🏛️' },
  ];

  // Close modal when pressing Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Filter photos based on search term and category
  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = searchTerm === '' || 
      photo.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory === 'all' || photo.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Load more photos (infinite scroll simulation)
  const loadMorePhotos = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, you'd fetch more photos from an API
      // For this example, we'll just stop loading more
      setHasMore(false);
      setIsLoading(false);
    }, 1000);
  }, [isLoading, hasMore]);

  // Handle image selection
  const handleImageClick = (photoId: string) => {
    if (selectedImages.includes(photoId)) {
      setSelectedImages(selectedImages.filter(id => id !== photoId));
    } else if (selectedImages.length < maxSelection) {
      setSelectedImages([...selectedImages, photoId]);
    }
  };

  // Handle image preview
  const handleImagePreview = (photo: Photo) => {
    setPreviewImage(photo);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      // In a real app, you'd upload the files to a server
      // For this example, we'll just add them to the local state
      const newPhotos: Photo[] = Array.from(files).map((file, index) => ({
        id: `upload-${Date.now()}-${index}`,
        src: URL.createObjectURL(file),
        alt: file.name,
        tags: [],
        category: 'user-upload',
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadedAt: new Date().toISOString().split('T')[0],
      }));
      
      setPhotos([...newPhotos, ...photos]);
      setIsUploading(false);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 1500);
  };

  // Handle insert
  const handleInsert = () => {
    if (selectedImages.length > 0) {
      // Get the first selected image's src
      const selectedPhoto = photos.find(photo => photo.id === selectedImages[0]);
      if (selectedPhoto) {
        onInsert(selectedPhoto.src);
        setSelectedImages([]);
        onClose();
      }
    }
  };

  // Handle scroll for infinite loading
  const handleScroll = () => {
    if (!gridRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = gridRef.current;
    
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      loadMorePhotos();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        ></div>

        {/* Modal panel */}
        <div
          ref={modalRef}
          className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full ${className}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="photo-library-title"
          tabIndex={-1}
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 id="photo-library-title" className="text-lg leading-6 font-medium text-gray-900">
                {t('photoLibrary.title')}
              </h3>
              <button
                type="button"
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                onClick={onClose}
                aria-label="Close"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search and upload */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder={t('photoLibrary.searchPhotos')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                </div>
              </div>
              
              {allowUpload && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isUploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('photoLibrary.uploading')}
                      </>
                    ) : (
                      <>
                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {t('photoLibrary.upload')}
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>

            {/* Usage statistics */}
            <div className="bg-gray-50 p-3 rounded-md mb-4">
              <p className="text-sm text-gray-600">{t('photoLibrary.proPhotosInDatabase')}: {photos.length}</p>
              <p className="text-sm text-gray-600">{t('photoLibrary.usedPhotosPerMonth')}: 42</p>
            </div>

            {/* Categories */}
            {showCategories && (
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      activeCategory === category.id
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            )}

            {/* Photo grid */}
            <div 
              ref={gridRef}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-1"
              onScroll={handleScroll}
            >
              {filteredPhotos.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">{t('photoLibrary.noPhotosFound')}</p>
                </div>
              ) : (
                filteredPhotos.map(photo => (
                  <div
                    key={photo.id}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden ${
                      selectedImages.includes(photo.id) ? 'ring-2 ring-teal-500' : ''
                    }`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-32 object-cover"
                      onClick={() => handleImageClick(photo.id)}
                      onDoubleClick={() => handleImagePreview(photo)}
                    />
                    
                    {/* Selection indicator */}
                    {selectedImages.includes(photo.id) && (
                      <div className="absolute top-2 right-2 bg-teal-500 text-white rounded-full p-1">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                      <button
                        onClick={() => handleImagePreview(photo)}
                        className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 rounded-full p-1 mr-1 transition-opacity"
                        aria-label={t('photoLibrary.preview')}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleImageClick(photo.id)}
                        className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 rounded-full p-1 transition-opacity"
                        aria-label={selectedImages.includes(photo.id) ? t('photoLibrary.deselect') : t('photoLibrary.select')}
                      >
                        {selectedImages.includes(photo.id) ? (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="col-span-full flex justify-center py-4">
                  <svg className="animate-spin h-6 w-6 text-teal-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer with action buttons */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleInsert}
              disabled={selectedImages.length === 0}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('photoLibrary.insert')} {selectedImages.length > 0 && `(${selectedImages.length})`}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {t('photoLibrary.cancel')}
            </button>
          </div>
        </div>
      </div>

      {/* Image preview modal */}
      {previewImage && (
        <div className="fixed inset-0 z-60 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
              onClick={() => setPreviewImage(null)}
              aria-hidden="true"
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {previewImage.alt}
                  </h3>
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    onClick={() => setPreviewImage(null)}
                    aria-label="Close preview"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-4">
                  <img
                    src={previewImage.src}
                    alt={previewImage.alt}
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">{t('photoLibrary.size')}:</span> {previewImage.size}
                  </div>
                  <div>
                    <span className="font-medium">{t('photoLibrary.uploaded')}:</span> {previewImage.uploadedAt}
                  </div>
                </div>
                
                {showTags && previewImage.tags.length > 0 && (
                  <div className="mt-2">
                    <span className="font-medium text-sm text-gray-500">{t('photoLibrary.tags')}:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {previewImage.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    onInsert(previewImage.src);
                    setPreviewImage(null);
                    onClose();
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {t('photoLibrary.insert')}
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {t('photoLibrary.close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoLibrary;