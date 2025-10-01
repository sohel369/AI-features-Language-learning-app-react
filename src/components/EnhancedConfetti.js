import React, { useEffect, useState, useRef } from 'react';

const EnhancedConfetti = ({ show, onComplete }) => {
  const [particles, setParticles] = useState([]);
  const animationRef = useRef();

  useEffect(() => {
    if (show) {
      // Create more realistic confetti particles
      const newParticles = [];
      const colors = [
        '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', 
        '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
        '#ff6348', '#2ed573', '#1e90ff', '#ffa502', '#ff3838'
      ];
      
      // Create different shapes of confetti
      const shapes = ['circle', 'square', 'triangle', 'star'];
      
      for (let i = 0; i < 80; i++) {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: -20,
          vx: (Math.random() - 0.5) * 6,
          vy: Math.random() * 4 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 12 + 6,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 15,
          shape: shape,
          life: 1.0,
          decay: Math.random() * 0.02 + 0.01
        });
      }
      
      setParticles(newParticles);
      
      // Enhanced animation with physics
      const animate = () => {
        setParticles(prevParticles => {
          const updated = prevParticles.map(particle => {
            const newParticle = {
              ...particle,
              x: particle.x + particle.vx,
              y: particle.y + particle.vy,
              vy: particle.vy + 0.15, // gravity
              vx: particle.vx * 0.99, // air resistance
              rotation: particle.rotation + particle.rotationSpeed,
              life: particle.life - particle.decay
            };
            
            // Add some wind effect
            newParticle.vx += Math.sin(Date.now() * 0.001) * 0.1;
            
            return newParticle;
          });
          
          return updated.filter(particle => 
            particle.y < window.innerHeight + 100 && particle.life > 0
          );
        });
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
      
      // Stop animation after 3 seconds
      const timeout = setTimeout(() => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        setParticles([]);
        if (onComplete) onComplete();
      }, 3000);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        clearTimeout(timeout);
      };
    }
  }, [show, onComplete]);

  if (!show || particles.length === 0) return null;

  const getShapeStyle = (particle) => {
    const baseStyle = {
      position: 'absolute',
      left: particle.x,
      top: particle.y,
      width: particle.size,
      height: particle.size,
      backgroundColor: particle.color,
      transform: `rotate(${particle.rotation}deg)`,
      opacity: particle.life,
      transition: 'none'
    };

    switch (particle.shape) {
      case 'circle':
        return { ...baseStyle, borderRadius: '50%' };
      case 'square':
        return { ...baseStyle, borderRadius: '2px' };
      case 'triangle':
        return {
          ...baseStyle,
          width: 0,
          height: 0,
          backgroundColor: 'transparent',
          borderLeft: `${particle.size / 2}px solid transparent`,
          borderRight: `${particle.size / 2}px solid transparent`,
          borderBottom: `${particle.size}px solid ${particle.color}`,
          borderRadius: 0
        };
      case 'star':
        return {
          ...baseStyle,
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          style={getShapeStyle(particle)}
        />
      ))}
    </div>
  );
};

export default EnhancedConfetti;
