
import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, ChevronDown } from './icons';

interface ContactFormProps {
  isVisible: boolean;
  onClose: () => void;
}

const sourceOptions = [
  'Search Engine (Google, etc.)',
  'Social Media',
  'LinkedIn',
  'Word of Mouth / Colleague',
  'News Article / Blog Post',
  'Advertisement',
  'Other',
];

const ContactForm: React.FC<ContactFormProps> = ({ isVisible, onClose }) => {
  const [isRendered, setIsRendered] = useState(isVisible);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    source: sourceOptions[0],
    message: '',
  });
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      setIsRendered(true);
    }
  }, [isVisible]);

  // Effect to close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);


  const handleAnimationEnd = () => {
    if (!isVisible) {
      setIsRendered(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSourceSelect = (option: string) => {
    setFormData(prev => ({ ...prev, source: option }));
    setDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your interest! We will be in touch shortly.');
    onClose();
     // Reset form state after closing
    setFormData({
        name: '',
        email: '',
        source: sourceOptions[0],
        message: '',
    });
  };

  if (!isRendered) {
    return null;
  }

  return (
    <div 
      className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[100] w-[calc(100%-2rem)] max-w-sm ${isVisible ? 'animate-slide-in' : 'animate-slide-out'}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="bg-slate-800/80 backdrop-blur-lg border border-slate-700 rounded-2xl shadow-2xl text-slate-200 overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b border-slate-700">
          <h3 className="font-bold text-lg text-white">Request Early Access</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-accent-cyan"
            aria-label="Close contact form"
          >
            <X className="w-5 h-5" />
          </button>
        </header>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-400">Full Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full bg-slate-700/50 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-accent-cyan focus:border-accent-cyan" 
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-400">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full bg-slate-700/50 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-accent-cyan focus:border-accent-cyan" 
            />
          </div>
          
          {/* Custom Dropdown */}
          <div>
            <label id="source-label" className="block text-sm font-medium text-slate-400">Where did you hear about us?</label>
            <div className="relative mt-1" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(prev => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
                aria-labelledby="source-label"
                className="relative w-full cursor-default rounded-md bg-slate-700/50 py-2 px-3 text-left text-white shadow-sm border border-slate-600 focus:outline-none focus:ring-1 focus:ring-accent-cyan"
              >
                <span className="block truncate">{formData.source}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </span>
              </button>

              {isDropdownOpen && (
                <ul
                  role="listbox"
                  aria-labelledby="source-label"
                  className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-slate-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-slate-600"
                >
                  {sourceOptions.map((option) => (
                    <li
                      key={option}
                      onClick={() => handleSourceSelect(option)}
                      role="option"
                      aria-selected={formData.source === option}
                      className="text-slate-300 relative cursor-pointer select-none py-2 px-4 hover:bg-slate-700 hover:text-white transition-colors duration-150"
                    >
                      <span className="block truncate">{option}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

           <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-400">Message (Optional)</label>
            <textarea 
              id="message" 
              name="message" 
              rows={3}
              value={formData.message}
              onChange={handleInputChange}
              className="mt-1 block w-full bg-slate-700/50 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-accent-cyan focus:border-accent-cyan"
            ></textarea>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-brand-primary text-white font-bold rounded-lg shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
            >
              Submit Request
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
