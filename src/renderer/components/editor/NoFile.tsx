import { Box, Typography } from '@mui/material';

export const NoFile: React.FC = () => {
	return (
		<Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
			<Typography component="span" color="text.disabled">
				No file selected
			</Typography>
		</Box>
	);
};
