import { GlobalStyles as MuiGlobalStyles } from '@mui/material';

const GlobalStyles = () => (
  <MuiGlobalStyles
    styles={{
      '@import': "url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap')",
      '@keyframes fadeIn': {
        from: { opacity: 0, transform: 'translateY(8px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
      },
      '@keyframes slideIn': {
        from: { opacity: 0, transform: 'translateX(-16px)' },
        to: { opacity: 1, transform: 'translateX(0)' },
      },
      '@keyframes scaleIn': {
        from: { opacity: 0, transform: 'scale(0.96)' },
        to: { opacity: 1, transform: 'scale(1)' },
      },
      p: {
        color: 'var(--color-text-secondary)',
        fontWeight: 500,
      },
      'h1, h2, h3': {
        margin: 0,
      },
      '#root': {
        backgroundColor: 'var(--color-background)',
        minHeight: '100vh',
      },
      'input, select, textarea, button': {
        transition: 'all var(--transition-base)',
      },
      'input:focus, select:focus, textarea:focus': {
        borderColor: 'var(--color-accent)',
        boxShadow: '0 0 0 3px rgba(4, 52, 107, 0.1)',
        outline: 'none',
      },
      'table tbody tr, .MuiTableBody-root .MuiTableRow-root': {
        transition: 'background-color 0.2s ease',
      },
      'table tbody tr:hover, .MuiTableBody-root .MuiTableRow-root:hover': {
        backgroundColor: 'rgba(4, 52, 107, 0.03)',
      },
      '.MuiButton-root': {
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1) !important',
      },
      '.MuiCard-root': {
        animation: 'fadeIn 0.35s ease',
      },
      '.MuiChip-root': {
        transition: 'all 0.2s ease !important',
      },
      '.MuiListItemButton-root': {
        transition: 'all 0.2s ease !important',
      },
      '.MuiPaper-root': {
        animation: 'scaleIn 0.25s ease',
      },
      '.MuiSvgIcon-root': {
        transition: 'color 0.2s ease',
      },
      '::-webkit-scrollbar': {
        width: '10px',
        height: '10px',
      },
      '::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '::-webkit-scrollbar-thumb': {
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '3px',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: 'rgba(0,0,0,0.45)',
      },
    }}
  />
);

export default GlobalStyles;
