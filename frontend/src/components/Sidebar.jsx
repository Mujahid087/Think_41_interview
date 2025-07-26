import React from 'react';

const Sidebar = ({ sessions, onSelect, activeId }) => {
  return (
    <aside className="w-64 bg-white border-r overflow-y-auto">
      <div className="p-4 text-xl font-bold border-b">🕑 History</div>
      <ul>
        {sessions.map((s) => (
          <li
            key={s._id}
            onClick={() => onSelect(s)}
            className={`cursor-pointer px-4 py-2 hover:bg-gray-100 transition ${
              s._id === activeId ? 'bg-blue-100' : ''
            }`}
          >
            {`Session ${new Date(s.createdAt).toLocaleString()}`}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
