import { MagnifyingGlass } from 'react-loader-spinner';

const SearchLoading = ({
    visible = true,
    height = 80,
    width = 80,
    glassColor = "#becbff",
    color = "#5b5b5b",
    wrapperStyle = {},
    wrapperClass = "magnifying-glass-wrapper"
}) => {
    return (
        <MagnifyingGlass
            visible={visible}
            height={height}
            width={width}
            ariaLabel="magnifying-glass-loading"
            wrapperStyle={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                ...wrapperStyle
            }}
            wrapperClass={wrapperClass}
            glassColor={glassColor}
            color={color}
        />
    );
};

export default SearchLoading;
