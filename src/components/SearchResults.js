import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaSearch, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import MarketplaceSearchCard from './MarketplaceSearchCard';

const ResultsContainer = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const ResultsContent = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
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

const ResultsTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
    letter-spacing: -0.25px;
  }
`;

const ProductInfo = styled.div`
  background: rgba(102, 126, 234, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
  border: 1px solid rgba(102, 126, 234, 0.2);
  
  strong {
    color: #667eea;
    font-weight: 700;
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.8rem;
    font-size: 0.8rem;
    line-height: 1.4;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
    margin-bottom: 1.5rem;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.8rem;
  }
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #667eea;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const StatLabel = styled.div`
  color: #666;
  font-weight: 600;
  font-size: 0.95rem;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const MarketplaceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.2rem;
  font-weight: 500;
  
  @media (max-width: 768px) {
    padding: 2rem;
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem;
    font-size: 0.9rem;
  }
`;

const ClearButton = styled.button`
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
  margin-top: 2rem;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
    margin-top: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    margin-top: 1rem;
  }
`;

const SearchResults = ({ results, productInfo }) => {
  const marketplaceSearches = results?.marketplace_searches || [];
  
  const getStats = () => {
    const totalMarketplaces = marketplaceSearches.length;
    const totalEstimatedResults = marketplaceSearches.reduce((sum, mp) => sum + (mp.estimated_results || 0), 0);
    const productName = productInfo?.product_name || 'Bilinmeyen Ürün';
    
    return {
      totalMarketplaces,
      totalEstimatedResults,
      productName
    };
  };

  const stats = getStats();

  return (
    <ResultsContainer>
      <ResultsContent
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ResultsTitle>Arama Sonuçları</ResultsTitle>
        
        {productInfo && (
          <ProductInfo>
            <strong>Ürün:</strong> {productInfo.product_name} | 
            <strong> Tür:</strong> {productInfo.product_type} | 
            <strong> Marka:</strong> {productInfo.brand}
          </ProductInfo>
        )}
        
        <StatsContainer>
          <StatCard>
            <StatNumber>{stats.totalMarketplaces}</StatNumber>
            <StatLabel>Pazaryeri</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.totalEstimatedResults.toLocaleString()}</StatNumber>
            <StatLabel>Tahmini Sonuç</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.productName}</StatNumber>
            <StatLabel>Bulunan Ürün</StatLabel>
          </StatCard>
        </StatsContainer>
        
        {marketplaceSearches.length > 0 ? (
          <MarketplaceGrid>
            {marketplaceSearches.map((marketplace) => (
              <MarketplaceSearchCard 
                key={marketplace.id}
                marketplace={marketplace}
              />
            ))}
          </MarketplaceGrid>
        ) : (
          <NoResults>
            Pazaryeri araması mevcut değil.
          </NoResults>
        )}
      </ResultsContent>
    </ResultsContainer>
  );
};

export default SearchResults; 