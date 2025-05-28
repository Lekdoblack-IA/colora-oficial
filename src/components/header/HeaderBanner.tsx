
interface HeaderBannerProps {
  isDashboard: boolean;
  isScrolled: boolean;
}

export const HeaderBanner = ({ isDashboard, isScrolled }: HeaderBannerProps) => {
  if (isDashboard) {
    return null;
  }

  return (
    <div className={`bg-gradient-to-r from-purple-600/80 via-pink-600/80 to-red-600/80 backdrop-blur-sm text-white text-center text-sm transition-all duration-300 overflow-hidden ${isScrolled ? 'h-0 py-0' : 'h-auto py-2'}`}>
      <div className={`transition-opacity duration-300 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}>
        <span className="animate-pulse-heart bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text font-medium text-slate-50">
          Veja o resultado e só pague se amar
        </span>
      </div>
    </div>
  );
};
