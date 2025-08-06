import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaCamera, FaSearch, FaFilter } from 'react-icons/fa';
import { useSearch } from '../context/SearchContext';
import ImageUpload from '../components/ImageUpload';
import SearchResults from '../components/SearchResults';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorModal from '../components/ErrorModal';

const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const HeroSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const HeroContent = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    border-radius: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
    border-radius: 16px;
  }
`;

const HeroTitle = styled.h2`
  font-size: 2.75rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    letter-spacing: -0.5px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    letter-spacing: -0.25px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    max-width: 100%;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

const UploadContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const Home = () => {
  const { 
    uploadedImage, 
    searchResults, 
    productInfo, 
    loading, 
    loadingStage,
    error, 
    uploadImage, 
    searchProducts, 
    clearResults 
  } = useSearch();

  const [showCamera, setShowCamera] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      try {
        const file = acceptedFiles[0];
        const previewUrl = URL.createObjectURL(file);
        setImagePreviewUrl(previewUrl);
        
        const uploadResult = await uploadImage(file);
        if (uploadResult.success) {
          await searchProducts(uploadResult.filename);
        }
      } catch (error) {
        console.error('Upload failed:', error);
        setImagePreviewUrl(null);
      }
    }
  }, [uploadImage, searchProducts]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false
  });

  const handleCameraCapture = async (imageBlob) => {
    try {
      const file = new File([imageBlob], 'camera-capture.jpg', { type: 'image/jpeg' });
      const previewUrl = URL.createObjectURL(imageBlob);
      setImagePreviewUrl(previewUrl);
      
      const uploadResult = await uploadImage(file);
      if (uploadResult.success) {
        await searchProducts(uploadResult.filename);
      }
    } catch (error) {
      console.error('Camera capture failed:', error);
      setImagePreviewUrl(null);
    }
  };

  const handleRemoveImage = () => {
    setImagePreviewUrl(null);
    clearResults();
  };

  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <HeroTitle>
            Yapay Zeka Destekli Resim Arama ile Ürün Bul
          </HeroTitle>
          <HeroSubtitle>
            Bir resim yükle ve birden fazla pazaryerinde ürünleri keşfet, 
            fiyata göre en düşükten en yükseğe sıralanmış.
          </HeroSubtitle>
          
          <UploadContainer>
            <ImageUpload 
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              isDragActive={isDragActive}
              uploadedImage={imagePreviewUrl}
              onRemoveImage={handleRemoveImage}
            />
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ImageUpload 
                isCamera={true}
                showCamera={showCamera}
                setShowCamera={setShowCamera}
                onCameraCapture={handleCameraCapture}
                uploadedImage={imagePreviewUrl}
                onRemoveImage={handleRemoveImage}
              />
            </motion.div>
          </UploadContainer>
        </HeroContent>
      </HeroSection>

      {loading && <LoadingSpinner loadingStage={loadingStage} />}

      {searchResults && (
        <SearchResults 
          results={searchResults}
          productInfo={productInfo}
        />
      )}

      {error && (
        <ErrorModal 
          error={error}
        />
      )}
    </HomeContainer>
  );
};

export default Home; 