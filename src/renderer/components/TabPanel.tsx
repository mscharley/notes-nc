export interface TabPanelProps {
  name: string;
  hidden: boolean;
}

export const TabPanel: React.FC<TabPanelProps> = ({ name, hidden, children }) => {
  return (
    <div role='tabpanel' hidden={hidden} id={`simple-tabpanel-${name}`} aria-labelledby={`simple-tab-${name}`}>
      {hidden ? <></> : <>{children}</>}
    </div>
  );
};
