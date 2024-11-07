import React from 'react';

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <div className="w-[347px] text-[#27272e] text-3xl font-semibold leading-[40.81px]">
      {title}
    </div>
  );
};

export default SectionHeader;