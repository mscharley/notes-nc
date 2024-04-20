import { Chip, ClickAwayListener, styled, TextField } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { setFatalError } from '~renderer/redux/index.js';
import type { TextFieldProps } from '@mui/material';
import { useAppDispatch } from '~renderer/hooks/index.js';
import { useState } from 'react';

export interface AddCategoryChipProps {
	folder: string;
}

const InlineTextField = styled(TextField)<TextFieldProps>(() => ({
	'& input': {
		fontSize: '0.8125rem',
		padding: '0px 0.5em',
	},
	'& fieldset': {
		visibility: 'hidden',
	},
}));

const AddCategoryChip: React.FC<AddCategoryChipProps> = ({ folder }) => {
	const dispatch = useAppDispatch();
	const [value, setValue] = useState('');
	const [adding, setEditing] = useState(false);

	const handleClickAway = (): void => {
		setValue('');
		setEditing(false);
		window.editorApi.addCategory(folder, value).catch((e) => dispatch(setFatalError(e)));
	};
	const label = !adding
		? (
				''
			)
		: (
			<ClickAwayListener onClickAway={handleClickAway}>
				<InlineTextField
					size="small"
					autoFocus
					value={value}
					onChange={(ev): void => setValue(ev.target.value)}
					onKeyUp={(ev): void => {
						if (ev.key === 'Escape') {
							ev.preventDefault();
							setValue('');
							setEditing(false);
						}
					}}
					onKeyPress={(ev): void => {
						if (ev.key === 'Enter') {
							ev.preventDefault();
							handleClickAway();
						}
					}}
				/>
			</ClickAwayListener>
			);

	return (
		<Chip
			icon={<AddIcon sx={{ marginRight: '-13px !important' }} />}
			label={label}
			size="small"
			sx={{ marginRight: 2 }}
			onClick={(): void => setEditing(true)}
		/>
	);
};

export default AddCategoryChip;
