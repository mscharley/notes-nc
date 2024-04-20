import cn from 'classnames';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { styled } from '@mui/material';
import { useDebouncedState } from '~renderer/hooks/index.js';
import { useEffect } from 'react';

const Icon = styled(RefreshIcon)`
  &.spin {
    animation-name: spin;
    animation-duration: 1000ms;
    animation-timing-function: linear;
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export interface SpinningRefreshIconProps {
	spinning: boolean;
	minimumSpinTime?: number;
}

export const SpinningRefreshIcon: React.FC<SpinningRefreshIconProps> = ({ spinning, minimumSpinTime = 1_000 }) => {
	const [spinningState, setSpinning, flushSpinning] = useDebouncedState(false, minimumSpinTime);

	useEffect(() => {
		setSpinning(spinning);
		if (spinning) {
			flushSpinning();
		}
	}, [spinning, setSpinning, flushSpinning]);

	return <Icon className={cn({ spin: spinningState })} />;
};
