interface GalleryImageProps {
  image: {
    id: number;
    title: string;
    image: string;
  };
  position: number;
  isMobile: boolean;
  onClick: () => void;
}

const GalleryImage = ({ image, position, isMobile, onClick }: GalleryImageProps) => {
  const getDesktopStyles = (position: number) => {
    const isActive = position === 0;
    const isPrev = position === -1;
    const isNext = position === 1;
    const isFarLeft = position < -1;
    const isFarRight = position > 1;

    let transform = '';
    let opacity = 0;
    let zIndex = 0;
    let scale = 0.8;

    if (isActive) {
      transform = 'translateX(0px) translateZ(0px) rotateY(0deg)';
      opacity = 1;
      zIndex = 3;
      scale = 1;
    } else if (isPrev) {
      transform = 'translateX(-120px) translateZ(-100px) rotateY(25deg)';
      opacity = 0.7;
      zIndex = 2;
      scale = 0.85;
    } else if (isNext) {
      transform = 'translateX(120px) translateZ(-100px) rotateY(-25deg)';
      opacity = 0.7;
      zIndex = 2;
      scale = 0.85;
    } else if (isFarLeft) {
      transform = 'translateX(-200px) translateZ(-200px) rotateY(45deg)';
      opacity = 0.3;
      zIndex = 1;
      scale = 0.7;
    } else if (isFarRight) {
      transform = 'translateX(200px) translateZ(-200px) rotateY(-45deg)';
      opacity = 0.3;
      zIndex = 1;
      scale = 0.7;
    }

    return {
      transform: `${transform} scale(${scale})`,
      opacity,
      zIndex,
      transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    };
  };

  const getMobileStyles = (position: number) => {
    const isActive = position === 0;
    const isPrev = position === -1;
    const isNext = position === 1;
    
    let transform = 'translateX(400px)';
    let opacity = 0;
    let zIndex = 0;
    let filter = 'blur(0px)';
    let scale = 1;
    
    if (isActive) {
      transform = 'translateX(0px)';
      opacity = 1;
      zIndex = 3;
      filter = 'blur(0px)';
      scale = 1;
    } else if (isPrev) {
      transform = 'translateX(-180px) scale(0.75)';
      opacity = 0.6;
      zIndex = 1;
      filter = 'blur(2px)';
      scale = 0.75;
    } else if (isNext) {
      transform = 'translateX(180px) scale(0.75)';
      opacity = 0.6;
      zIndex = 1;
      filter = 'blur(2px)';
      scale = 0.75;
    }
    
    return {
      transform: `translate(-50%, -50%) ${transform}`,
      opacity,
      zIndex,
      filter,
      transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    };
  };

  const styles = isMobile ? getMobileStyles(position) : getDesktopStyles(position);
  const containerClass = isMobile 
    ? "absolute top-1/2 left-1/2"
    : "absolute top-1/2 left-1/2 cursor-pointer";
  
  const imageClass = isMobile 
    ? "w-64 h-80 rounded-3xl bg-white border border-black overflow-hidden shadow-xl"
    : "w-80 h-96 rounded-3xl bg-white border border-black overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300";

  const containerStyles = isMobile 
    ? styles
    : {
        ...styles,
        transformOrigin: 'center center',
        marginLeft: '-160px',
        marginTop: '-200px',
      };

  return (
    <div
      className={containerClass}
      style={containerStyles}
      onClick={onClick}
    >
      <div className={imageClass}>
        <img
          src={image.image}
          alt={image.title}
          className="w-full h-full object-cover"
          style={{ aspectRatio: '4/5' }}
        />
      </div>
    </div>
  );
};

export default GalleryImage;
