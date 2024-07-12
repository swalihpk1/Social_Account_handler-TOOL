import React from 'react';
import { LoadingIconProps } from '../../types/Types';

const HttpIcon: React.FC<LoadingIconProps> = ({ loading }) => (

    <lord-icon
        src="https://cdn.lordicon.com/sqhiykyz.json"
        trigger={loading ? "loop" : "hover"}
        colors="primary:#104891"
        style={{ width: '20px', height: '20px' }}
    >
    </lord-icon>

);

export default HttpIcon;