export const Icon = ({ name, size = 22 }) => {
  const stroke = 'currentColor';
  const sw = 1.4;
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'pen':   return <svg {...props}><path d="M3 21l4-1 11-11-3-3L4 17l-1 4z"/><path d="M14 6l4 4"/></svg>;
    case 'crane': return <svg {...props}><path d="M4 22V8m0 0h14M4 8l-1-3h6"/><path d="M9 14h9M9 14v8m9-8v8"/></svg>;
    case 'city':  return <svg {...props}><path d="M3 22h18"/><path d="M5 22V10l4-2v14"/><path d="M9 22V6l5-2v18"/><path d="M14 22V11l5 2v9"/></svg>;
    case 'chart': return <svg {...props}><path d="M3 21h18"/><path d="M6 17v-4M11 17v-7M16 17v-3M21 17V8"/></svg>;
    case 'arch':  return <svg {...props}><path d="M4 22V12a8 8 0 0 1 16 0v10"/><path d="M4 22h16"/><path d="M8 22v-6M16 22v-6"/></svg>;
    case 'cube':  return <svg {...props}><path d="M12 3l9 5v8l-9 5-9-5V8l9-5z"/><path d="M12 12l9-5M12 12l-9-5M12 12v9"/></svg>;
    case 'leaf':  return <svg {...props}><path d="M5 21c0-7 4-13 14-15-1 10-6 15-14 15z"/><path d="M5 21c3-3 7-5 11-7"/></svg>;
    case 'solar': return <svg {...props}><path d="M3 9h18l-2 11H5L3 9z"/><path d="M3 9l2-5h14l2 5"/><path d="M8 9v11M16 9v11M12 4v16"/></svg>;
    case 'recycle': return <svg {...props}><path d="M7 19l-3-3 3-3"/><path d="M4 16h10a3 3 0 0 0 3-3v-1"/><path d="M17 5l3 3-3 3"/><path d="M20 8H10a3 3 0 0 0-3 3v1"/></svg>;
    case 'sensor': return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M5 12a7 7 0 0 1 14 0M2 12a10 10 0 0 1 20 0"/></svg>;
    case 'arrow': return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case 'arrow-down': return <svg {...props}><path d="M12 5v14M6 13l6 6 6-6"/></svg>;
    case 'play':  return <svg {...props} fill="currentColor" stroke="none"><path d="M8 5v14l11-7L8 5z"/></svg>;
    case 'plus':  return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'check': return <svg {...props}><path d="M5 12l5 5 9-11"/></svg>;
    case 'map':   return <svg {...props}><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z"/><path d="M9 4v16M15 6v16"/></svg>;
    case 'mail':  return <svg {...props}><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 6l9 7 9-7"/></svg>;
    case 'phone': return <svg {...props}><path d="M5 4h3l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>;
    default: return null;
  }
};
