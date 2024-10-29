import { Typography } from "@mui/material";

const ReplaceLinksAndHashtags = (text: string, shortenedLinks: string[]) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const hashtagRegex = /#(\w+)/g;
    let linkIndex = 0;

    const parts = text.split(/(https?:\/\/[^\s]+|#\w+)/g);

    return parts.map((part, index) => {
        if (part.match(urlRegex) && linkIndex < shortenedLinks.length) {
            const replacedLink = shortenedLinks[linkIndex];
            linkIndex += 1;
            return (
                <Typography key={index} component="span" sx={{ fontSize: 'small', color: '#0087da', fontWeight: '300' }
                }>
                    {replacedLink}
                </Typography>
            );
        } else if (part.match(hashtagRegex)) {
            return (
                <Typography key={index} component="span" sx={{ fontSize: 'small', color: '#0087da', fontWeight: '300' }
                }>
                    {part}
                </Typography>
            );
        }
        return <span key={index}> {part} </span>;
    });
};

export default ReplaceLinksAndHashtags;