import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

const NavItem = ({ text, isActive, onClick }) => (
  <div className={`w-full cursor-pointer ${isActive ? 'bg-white' : ''}`} onClick={onClick}>
    <div className="px-6 py-3">
      <span className={`text-base ${isActive ? 'text-black' : 'text-white/90'}`}>{text}</span>
    </div>
  </div>
);

const JobCard = ({ company, title, recruiter, location, salary }) => (
  <div className="bg-black rounded-lg overflow-hidden">
    <div className="p-6">
      <div className="text-gray-300 text-sm mb-1">{company}</div>
      <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
      <div className="text-gray-400 text-sm mb-4">Recruiter: {recruiter}</div>
      <div className="flex justify-between items-center">
        <div className="flex items-center text-gray-400 text-sm">
          <MapPin size={16} strokeWidth={1.5} className="mr-1 flex-shrink-0" />
          <span>{location}</span>
        </div>
        <span className="text-white text-sm">{salary}</span>
      </div>
    </div>
  </div>
);

const StatusCard = ({ company, title, location, salary, status }) => (
  <div className="bg-black rounded-lg overflow-hidden">
    <div className="p-6">
      <div className="text-gray-300 text-sm mb-1">{company}</div>
      <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
      <div className={`text-sm mb-4 ${
        status === 'Accepted' ? 'text-green-400' : 
        status === 'Rejected' ? 'text-red-400' : 
        'text-gray-400 italic'
      }`}>{status}</div>
      <div className="flex justify-between items-center">
        <div className="flex items-center text-gray-400 text-sm">
          <MapPin size={16} strokeWidth={1.5} className="mr-1 flex-shrink-0" />
          <span>{location}</span>
        </div>
        <span className="text-white text-sm">{salary}</span>
      </div>
    </div>
  </div>
);

const ViewMoreButton = ({ text }) => (
  <button className="mx-auto block bg-gray-600/50 hover:bg-gray-600 transition-colors text-white px-8 py-2 rounded-full my-8">
    {text} -->
  </button>
);

const JobBoard = () => {
  const [activeNav, setActiveNav] = useState('Home');
  
  const placeholderOpportunities = [
    {
      company: 'OpenAI',
      title: 'Product Director Internship',
      recruiter: 'John Banks',
      location: 'San Francisco, CA',
      salary: '$71-95/hr'
    },
    {
      company: 'McDonalds',
      title: 'Paid Loitering Intern',
      recruiter: 'Josh Liu',
      location: 'Stanford, MS',
      salary: '$1.75'
    },
    {
      company: "Fry's Food Stores",
      title: 'Director of Goods',
      recruiter: 'Spencer Goons',
      location: 'New Haven, CT',
      salary: '$134,000/yr'
    }
  ];

  const applications = [
    {
      company: 'Albertos Gym',
      title: 'Training Team Member',
      location: 'Boston, MA',
      salary: '$17.50/hr',
      status: 'In Progress'
    },
    {
      company: 'Adidas Inc.',
      title: 'Design Engineer',
      location: 'Berkeley, CA',
      salary: '$25.90/hr',
      status: 'Rejected'
    },
    {
      company: 'Google Corp.',
      title: 'Network Designer',
      location: 'New York, NY',
      salary: '$190,000/yr',
      status: 'Accepted'
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#1A1A1A]">
      {/* Navigation */}
      <div className="fixed left-0 top-0 w-48 h-full bg-black">
        {/* Logo space */}
        <div className="h-24 border-b border-zinc-800 flex items-center justify-center">
          <div className="text-white text-xl font-bold">Jobify</div>
        </div>
        
        {/* Navigation items */}
        <div className="mt-4">
          <NavItem text="Home" isActive={activeNav === 'Home'} onClick={() => setActiveNav('Home')} />
          <NavItem text="Search for Jobs" isActive={activeNav === 'Search'} onClick={() => setActiveNav('Search')} />
          <NavItem text="Applications" isActive={activeNav === 'Applications'} onClick={() => setActiveNav('Applications')} />
          <NavItem text="Profile" isActive={activeNav === 'Profile'} onClick={() => setActiveNav('Profile')} />
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-48 flex-1 p-8">
        <div className="mb-12">
          <h2 className="text-white text-2xl font-bold mb-6">Top Opportunities</h2>
          
          {/* Jobs container - can be populated dynamically */}
          <div id="jobsContainer" className="grid grid-cols-3 gap-4">
            {placeholderOpportunities.map((job, index) => (
              <JobCard key={index} {...job} />
            ))}
          </div>
          
          <ViewMoreButton text="View All Opportunities" />
        </div>

        <hr className="border-zinc-800 mb-12" />

        <div>
          <h2 className="text-white text-2xl font-bold mb-6">Application Status</h2>
          <div className="grid grid-cols-3 gap-4">
            {applications.map((app, index) => (
              <StatusCard key={index} {...app} />
            ))}
          </div>
          <ViewMoreButton text="All Application Statuses" />
        </div>
      </div>
    </div>
  );
};

export default JobBoard;
