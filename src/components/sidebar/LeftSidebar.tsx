import LogoButton from '@/components/share/LogoButton';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function LeftSidebar() {
  const [activeItem, setActiveItem] = useState('My task');
  const [bgColorIndex, setBgColorIndex] = useState(0);
  const bgColors = ['#F7F8FA'];

  const cycleBackground = () => {
    setBgColorIndex((prev) => (prev + 1) % bgColors.length);
  };

  return (
    <aside
      className={`w-64 shadow-md p-4 transition-all duration-300 ease-in-out`}
      style={{ backgroundColor: bgColors[bgColorIndex], color: '#787878' }}
    >
      <LogoButton />
      <div className="mt-6">
        <Button
          variant={activeItem === 'My task' ? 'default' : 'ghost'}
          className={`w-full mb-2 justify-start ${
            activeItem === 'My task' ? 'bg-[#DCDCDC] text-black' : ''
          }`}
          onClick={() => setActiveItem('My task')}
        >
          My task
        </Button>
        <Button
          variant={activeItem === 'Notification' ? 'default' : 'ghost'}
          className={`w-full mb-2 justify-start ${
            activeItem === 'Notification' ? 'bg-[#DCDCDC] text-black' : ''
          }`}
          onClick={() => setActiveItem('Notification')}
        >
          Notification
        </Button>
        <Button
          variant={activeItem === 'Review' ? 'default' : 'ghost'}
          className={`w-full mb-2 justify-start ${
            activeItem === 'Review' ? 'bg-[#DCDCDC] text-black' : ''
          }`}
          onClick={() => setActiveItem('Review')}
        >
          Review
        </Button>
        <div className="mt-6 font-bold" style={{ padding: '0px 12px', color: '#787878' }}>WORKSPACE</div>
        <Button
          variant={activeItem === 'Your projects' ? 'default' : 'ghost'}
          className={`w-full mb-2 justify-start ${
            activeItem === 'Your projects' ? 'bg-[#DCDCDC] text-black' : ''
          }`}
          onClick={() => setActiveItem('Your projects')}
        >
          Your projects
        </Button>
      </div>
    </aside>
  );
}