import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContent = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 0;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(231, 76, 60, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
`;

const ModalTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: white;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
  color: #333;
`;

const ErrorMessage = styled.p`
  margin-bottom: 1rem;
  line-height: 1.6;
  font-size: 1.1rem;
  color: #666;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }
`;

const ErrorModal = ({ error, onClose }) => {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <ModalOverlay>
      <ModalContent
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ModalHeader>
          <ModalTitle>
            <FaExclamationTriangle />
            Hata
          </ModalTitle>
          <CloseButton onClick={handleClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <ErrorMessage>
            İsteğiniz işlenirken bir hata oluştu. Lütfen tekrar deneyin.
          </ErrorMessage>
          
          {error && (
            <div style={{ 
              background: 'rgba(231, 76, 60, 0.1)', 
              padding: '1rem', 
              borderRadius: '8px', 
              marginTop: '1rem',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              color: '#e74c3c'
            }}>
              {error}
            </div>
          )}
          
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <ActionButton onClick={handleClose}>
              Tamam
            </ActionButton>
          </div>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ErrorModal; 