import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaSearch, FaExternalLinkAlt } from 'react-icons/fa';

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.2);
    border-color: rgba(102, 126, 234, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const MarketplaceLogo = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 16px;
  object-fit: contain;
  margin-bottom: 1.5rem;
  background: white;
  padding: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    margin-bottom: 1rem;
    padding: 10px;
  }
  
  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    margin-bottom: 0.8rem;
    padding: 8px;
  }
`;

const MarketplaceName = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #333;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const MarketplaceDescription = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.4;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
    margin-bottom: 0.8rem;
    line-height: 1.3;
  }
`;

const EstimatedResults = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #667eea;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  
  svg {
    font-size: 0.8rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
    margin-bottom: 0.8rem;
    
    svg {
      font-size: 0.7rem;
    }
  }
`;

const SearchButton = styled.button`
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

const MarketplaceSearchCard = ({ marketplace }) => {
  const handleSearch = () => {
    window.open(marketplace.search_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card
      onClick={handleSearch}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <MarketplaceLogo 
        src={marketplace.logo} 
        alt={`${marketplace.name} logo`}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
      
      <MarketplaceName>{marketplace.name}</MarketplaceName>
      
      <MarketplaceDescription>
        {marketplace.description}
      </MarketplaceDescription>
      
      <EstimatedResults>
        <FaSearch />
        ~{marketplace.estimated_results} tahmini sonuç
      </EstimatedResults>
      
      <SearchButton>
        <FaExternalLinkAlt />
        {marketplace.name}'de Ara
      </SearchButton>
    </Card>
  );
};

export default MarketplaceSearchCard; 