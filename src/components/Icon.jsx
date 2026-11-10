export const Icon = ({ name, size = 22 }) => {
  const stroke = 'currentColor';
  const sw = 1.4;
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'pen':        return <svg {...props}><path d="M3 21l4-1 11-11-3-3L4 17l-1 4z"/><path d="M14 6l4 4"/></svg>;
    case 'crane':      return <svg {...props}><path d="M4 22V8m0 0h14M4 8l-1-3h6"/><path d="M9 14h9M9 14v8m9-8v8"/></svg>;
    case 'city':       return <svg {...props}><path d="M3 22h18"/><path d="M5 22V10l4-2v14"/><path d="M9 22V6l5-2v18"/><path d="M14 22V11l5 2v9"/></svg>;
    case 'chart':      return <svg {...props}><path d="M3 21h18"/><path d="M6 17v-4M11 17v-7M16 17v-3M21 17V8"/></svg>;
    case 'arch':       return <svg {...props}><path d="M4 22V12a8 8 0 0 1 16 0v10"/><path d="M4 22h16"/><path d="M8 22v-6M16 22v-6"/></svg>;
    case 'cube':       return <svg {...props}><path d="M12 3l9 5v8l-9 5-9-5V8l9-5z"/><path d="M12 12l9-5M12 12l-9-5M12 12v9"/></svg>;
    case 'leaf':       return <svg {...props}><path d="M5 21c0-7 4-13 14-15-1 10-6 15-14 15z"/><path d="M5 21c3-3 7-5 11-7"/></svg>;
    case 'solar':      return <svg {...props}><path d="M3 9h18l-2 11H5L3 9z"/><path d="M3 9l2-5h14l2 5"/><path d="M8 9v11M16 9v11M12 4v16"/></svg>;
    case 'recycle':    return <svg {...props}><path d="M7 19l-3-3 3-3"/><path d="M4 16h10a3 3 0 0 0 3-3v-1"/><path d="M17 5l3 3-3 3"/><path d="M20 8H10a3 3 0 0 0-3 3v1"/></svg>;
    case 'sensor':     return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M5 12a7 7 0 0 1 14 0M2 12a10 10 0 0 1 20 0"/></svg>;
    case 'arrow':      return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case 'arrow-down': return <svg {...props}><path d="M12 5v14M6 13l6 6 6-6"/></svg>;
    case 'play':       return <svg {...props} fill="currentColor" stroke="none"><path d="M8 5v14l11-7L8 5z"/></svg>;
    case 'plus':       return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'check':      return <svg {...props}><path d="M5 12l5 5 9-11"/></svg>;
    case 'map':        return <svg {...props}><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z"/><path d="M9 4v16M15 6v16"/></svg>;
    case 'mail':       return <svg {...props}><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 6l9 7 9-7"/></svg>;
    case 'phone':      return <svg {...props}><path d="M5 4h3l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>;
    case 'lock':       return <svg {...props}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><circle cx="12" cy="16" r="1"/></svg>;
    case 'shield':     return <svg {...props}><path d="M12 3l8 3v6c0 5.2-3.4 8.8-8 10-4.6-1.2-8-4.8-8-10V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>;
    case 'settings':   return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.77 1.02 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
    case 'trash':      return <svg {...props}><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 14h10l1-14"/><path d="M10 11v6M14 11v6"/></svg>;
    case 'eye':        return <svg {...props}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'logout':     return <svg {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>;
    case 'users':      return <svg {...props}><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-3-3.85"/></svg>;
    case 'refresh':    return <svg {...props}><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>;
    default: return null;
  }
};
