import Box from '@mui/material/Box';

export interface TabPanelProps {
  index: number;
  value: number;
}

export const TabPanel: React.FC<TabPanelProps> = ({ index, value, children }) => {
  const hidden = index !== value;

  return (
    <div role='tabpanel' hidden={hidden} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`}>
      {hidden ? <></> : <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};
