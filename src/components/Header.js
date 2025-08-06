import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 0.8rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem 0.8rem;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #667eea;
  
  h1 {
    font-size: 1.75rem;
    font-weight: 800;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.5px;
  }
  
  svg {
    font-size: 1.75rem;
    filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3));
  }
  
  @media (max-width: 768px) {
    gap: 0.5rem;
    
    h1 {
      font-size: 1.5rem;
      letter-spacing: -0.25px;
    }
    
    svg {
      font-size: 1.5rem;
    }
  }
  
  @media (max-width: 480px) {
    gap: 0.4rem;
    
    h1 {
      font-size: 1.2rem;
      letter-spacing: -0.2px;
    }
    
    svg {
      font-size: 1.2rem;
    }
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const Header = () => {
  const location = useLocation();

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo>
          <FaSearch />
          <h1>ResimArama</h1>
        </Logo>
        
        <Nav>
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header; 