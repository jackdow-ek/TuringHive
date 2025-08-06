import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaCamera, FaTimes, FaCheck } from 'react-icons/fa';

const UploadArea = styled(motion.div)`
  background: ${props => props.isDragActive ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255, 255, 255, 0.9)'};
  border: 2px dashed ${props => props.isDragActive ? '#667eea' : 'rgba(102, 126, 234, 0.3)'};
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  
  &:hover {
    border-color: #667eea;
    background: rgba(255, 255, 255, 0.95);
    transform: translateY(-4px);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 2rem;
    min-height: 180px;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem;
    min-height: 160px;
  }
`;

const UploadIcon = styled.div`
  font-size: 3.5rem;
  color: #667eea;
  margin-bottom: 1rem;
  filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3));
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

const UploadTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #333;
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const UploadText = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    line-height: 1.4;
  }
`;

const ImagePreview = styled.div`
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  position: relative;
  
  @media (max-width: 768px) {
    max-width: 250px;
  }
  
  @media (max-width: 480px) {
    max-width: 200px;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(102, 126, 234, 0.2);
  
  @media (max-width: 768px) {
    height: 160px;
  }
  
  @media (max-width: 480px) {
    height: 140px;
  }
`;

const SuccessOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(39, 174, 96, 0.9);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    background: #c0392b;
  }
  
  @media (max-width: 480px) {
    width: 25px;
    height: 25px;
    font-size: 0.7rem;
  }
`;

const CameraButton = styled.button`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 auto;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
    gap: 0.5rem;
  }
`;

const CameraContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    max-width: 280px;
  }
  
  @media (max-width: 480px) {
    max-width: 240px;
  }
`;

const CameraVideo = styled.video`
  width: 100%;
  border-radius: 15px;
  margin-top: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const CameraCanvas = styled.canvas`
  display: none;
`;

const CameraControls = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: center;
  
  @media (max-width: 480px) {
    gap: 0.5rem;
    margin-top: 1rem;
  }
`;

const CameraBtn = styled.button`
  background: ${props => props.primary ? 
    'linear-gradient(135deg, #667eea, #764ba2)' : 
    'rgba(255, 255, 255, 0.9)'};
  color: ${props => props.primary ? 'white' : '#333'};
  border: ${props => props.primary ? 'none' : '2px solid rgba(102, 126, 234, 0.3)'};
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: ${props => props.primary ? '0 6px 20px rgba(102, 126, 234, 0.3)' : '0 4px 15px rgba(0, 0, 0, 0.1)'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.primary ? '0 8px 25px rgba(102, 126, 234, 0.4)' : '0 6px 20px rgba(0, 0, 0, 0.15)'};
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    gap: 0.3rem;
  }
`;

const ImageUpload = ({ 
  isCamera = false, 
  showCamera = false, 
  setShowCamera, 
  onCameraCapture,
  getRootProps, 
  getInputProps, 
  isDragActive,
  uploadedImage = null,
  onRemoveImage
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);

  useEffect(() => {
    if (uploadedImage) {
      setImagePreview(uploadedImage);
      setIsUploaded(true);
    }
  }, [uploadedImage]);

  const handleRemoveImage = () => {
    setImagePreview(null);
    setIsUploaded(false);
    if (onRemoveImage) {
      onRemoveImage();
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'environment'
        } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera access failed:', error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (onCameraCapture) {
          onCameraCapture(blob);
        }
        stopCamera();
        setShowCamera(false);
      }, 'image/jpeg', 0.8);
    }
  };

  const handleCameraToggle = () => {
    if (showCamera) {
      stopCamera();
      setShowCamera(false);
    } else {
      setShowCamera(true);
      setTimeout(startCamera, 100);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (isCamera) {
    return (
      <UploadArea
        isDragActive={isDragActive}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {!showCamera ? (
          <>
            <UploadIcon>
              <FaCamera />
            </UploadIcon>
            <UploadTitle>Fotoğraf Çek</UploadTitle>
            <UploadText>
              Ürün resmini çekmek için kameranı kullan
            </UploadText>
            <CameraButton onClick={handleCameraToggle}>
              <FaCamera />
              Kamerayı Aç
            </CameraButton>
          </>
        ) : (
          <CameraContainer>
            <UploadTitle>Kamera</UploadTitle>
            <CameraVideo ref={videoRef} autoPlay playsInline />
            <CameraCanvas ref={canvasRef} />
            <CameraControls>
              <CameraBtn onClick={capturePhoto} primary>
                <FaCamera />
                Çek
              </CameraBtn>
              <CameraBtn onClick={handleCameraToggle}>
                <FaTimes />
                İptal
              </CameraBtn>
            </CameraControls>
          </CameraContainer>
        )}
      </UploadArea>
    );
  }

  if (imagePreview && isUploaded) {
    return (
      <UploadArea
        isDragActive={isDragActive}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ImagePreview>
          <PreviewImage src={imagePreview} alt="Uploaded image" />
          <SuccessOverlay>
            <FaCheck />
          </SuccessOverlay>
          <RemoveButton onClick={handleRemoveImage}>
            <FaTimes />
          </RemoveButton>
        </ImagePreview>
        <UploadTitle style={{ marginTop: '1rem', color: '#27ae60' }}>
          Resim Başarıyla Yüklendi!
        </UploadTitle>
        <UploadText>
          Resim analiz ediliyor...
        </UploadText>
      </UploadArea>
    );
  }

  return (
    <UploadArea
      {...getRootProps()}
      isDragActive={isDragActive}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <input {...getInputProps()} />
      <UploadIcon>
        <FaCloudUploadAlt />
      </UploadIcon>
      <UploadTitle>Resim Yükle</UploadTitle>
      <UploadText>
        {isDragActive 
          ? 'Resmi buraya bırak' 
          : 'Resmini buraya sürükle ve bırak veya göz atmak için tıkla'
        }
      </UploadText>
    </UploadArea>
  );
};

export default ImageUpload; 