import { PropTypes } from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Paper, Typography } from '@mui/material';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent
} from '@mui/lab';

// assets
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

// ==============================|| UI TIMELINE - CUSTOMIZED ||============================== //

export default function VendorlogTimeline({ data }) {
    const theme = useTheme();
    const paper = {
        p: 2.5,
        boxShadow: 'none',
        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
        border: '1px dashed',
        borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.dark : theme.palette.primary.dark
    };
    return (
        <Timeline position="alternate">
            {data.map((item) => (
                <TimelineItem>
                    <TimelineOppositeContent>
                        <Typography variant="body2" color="textSecondary" sx={{ paddingTop: '14px' }}>
                            {new Date(item.created_at).toLocaleString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric'
                            })}
                        </Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot color="secondary">
                            <TextSnippetIcon sx={{ color: '#fff' }} />
                        </TimelineDot>
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <Paper elevation={3} sx={paper}>
                            <Typography variant="h5" component="h1">
                                {item.text}
                            </Typography>
                            <Typography sx={{ paddingTop: '6px' }}>
                                {item?.user && 'updated by '}
                                {item?.user && item?.user.name}
                            </Typography>
                        </Paper>
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    );
}

VendorlogTimeline.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
            user: PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired
            }),
            vendor: PropTypes.shape({
                id: PropTypes.string.isRequired
            }).isRequired,
            by: PropTypes.string.isRequired,
            created_at: PropTypes.string.isRequired
        })
    ).isRequired
};
