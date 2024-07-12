import React from 'react';
import { LoadingIconProps } from '../../types/Types';

const RefreshIcon: React.FC<LoadingIconProps> = ({ loading }) => (

    <lord-icon
        src="https://cdn.lordicon.com/ogkflacg.json"
        trigger={loading ? "loop" : "hover"}
        colors="primary:white"
        style={{ width: '17px', height: '17px' }}
    >
    </lord-icon>
)

export default RefreshIcon;