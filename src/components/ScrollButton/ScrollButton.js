"use client";

function ScrollButton({ targetId, children, className }) {
  const handleScroll = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <button className={className} onClick={handleScroll}>
      {children}
    </button>
  );
}

export default ScrollButton;
