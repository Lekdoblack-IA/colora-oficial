
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export interface ScratchCardProps {
  isLoggedIn?: boolean;
  onAuthModalOpen?: () => void;
}
