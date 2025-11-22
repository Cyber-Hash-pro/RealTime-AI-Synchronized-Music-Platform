import React from 'react';

const Input = ({ label, type = 'text', placeholder, value, onChange, name, icon: Icon, ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="text-sm font-medium text-(--color-text-secondary)">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-(--color-text-secondary)">
            <Icon size={20} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-(--color-bg-card) border border-(--color-border-subtle) rounded-lg px-4 py-3 text-white placeholder-(--color-text-secondary) focus:outline-none focus:border-(--color-accent-green) focus:ring-1 focus:ring-(--color-accent-green) transition-all duration-300 ${Icon ? 'pl-12' : ''}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;
