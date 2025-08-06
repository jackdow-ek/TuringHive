import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaSpinner, FaCheck, FaSearch, FaBrain, FaList } from 'react-icons/fa';

const LoadingOverlay = styled.div`
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

const LoadingContent = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 500px;
  width: 90%;
  
  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 20px;
    max-width: 90%;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem;
    border-radius: 16px;
    max-width: 95%;
  }
`;

const LoadingTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const LoadingText = styled.p`
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const Spinner = styled(motion.div)`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(102, 126, 234, 0.2);
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    gap: 0.8rem;
    margin-top: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.6rem;
    margin-top: 1rem;
  }
`;

const Step = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
  
  ${props => props.active && `
    background: rgba(102, 126, 234, 0.1);
    border-color: #667eea;
    transform: scale(1.02);
  `}
  
  ${props => props.completed && `
    background: rgba(39, 174, 96, 0.1);
    border-color: #27ae60;
  `}
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    gap: 0.8rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem;
    gap: 0.6rem;
  }
`;

const StepIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  color: white;
  background: ${props => {
    if (props.className === 'completed') return '#27ae60';
    if (props.className === 'active') return '#667eea';
    return '#ccc';
  }};
  animation: ${props => props.className === 'active' ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
    font-size: 0.7rem;
  }
`;

const StepText = styled.span`
  color: #333;
  font-weight: 500;
  font-size: 0.95rem;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(102, 126, 234, 0.2);
  border-radius: 3px;
  margin: 1rem 0;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 5px;
    margin: 0.8rem 0;
  }
  
  @media (max-width: 480px) {
    height: 4px;
    margin: 0.6rem 0;
  }
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 3px;
`;

const LoadingSpinner = ({ loadingStage }) => {
  const getCurrentStep = () => {
    if (loadingStage?.includes('yükleniyor')) return 1;
    if (loadingStage?.includes('başarıyla')) return 2;
    if (loadingStage?.includes('analiz')) return 2;
    if (loadingStage?.includes('derleniyor')) return 3;
    return 1;
  };

  const getProgressPercentage = () => {
    const step = getCurrentStep();
    return (step / 3) * 100;
  };

  const currentStep = getCurrentStep();

  const steps = [
    { id: 1, text: 'Resim yükleniyor', icon: <FaSpinner /> },
    { id: 2, text: 'Yapay zeka ile ürün analiz ediliyor', icon: <FaBrain /> },
    { id: 3, text: 'Sonuçlar derleniyor', icon: <FaList /> }
  ];

  return (
    <LoadingOverlay>
      <LoadingContent
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <LoadingTitle>
          {loadingStage || 'Resminiz işleniyor...'}
        </LoadingTitle>
        <LoadingText>
          En iyi fırsatlar için pazaryerlerinde aranıyor
        </LoadingText>
        
        <SpinnerContainer>
          <Spinner />
        </SpinnerContainer>
        
        <ProgressBar>
          <ProgressFill
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 0.5 }}
          />
        </ProgressBar>
        
        <StepsContainer>
          {steps.map((step) => (
            <Step
              key={step.id}
              active={currentStep === step.id}
              completed={currentStep > step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: step.id * 0.1 }}
            >
              <StepIcon className={currentStep > step.id ? 'completed' : currentStep === step.id ? 'active' : 'pending'}>
                {currentStep > step.id ? <FaCheck /> : step.icon}
              </StepIcon>
              <StepText>{step.text}</StepText>
            </Step>
          ))}
        </StepsContainer>
      </LoadingContent>
    </LoadingOverlay>
  );
};

export default LoadingSpinner; 