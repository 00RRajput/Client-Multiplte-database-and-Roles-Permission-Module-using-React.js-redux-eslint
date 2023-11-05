import { PropTypes } from 'prop-types';

// material-ui
import { List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';

// project imports
import Avatar from 'ui-component/extended/Avatar';

// assets
// import ImageIcon from '@mui/icons-material/ImageTwoTone';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
// ================================|| UI LIST - FOLDER ||================================ //

export default function LogList({ data }) {
    return (
        <List>
            {data.map((item) => (
                <ListItem>
                    <ListItemAvatar>
                        <Avatar size="xs" color="secondary" outline>
                            <TextSnippetIcon sx={{ fontSize: '1.1rem' }} />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={item.text}
                        secondary={`${new Date(item.created_at).toLocaleString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric'
                        })} ${item?.user && ' by'} ${item?.user && item?.user.name}`}
                    />
                </ListItem>
            ))}
        </List>
    );
}

LogList.propTypes = {
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
