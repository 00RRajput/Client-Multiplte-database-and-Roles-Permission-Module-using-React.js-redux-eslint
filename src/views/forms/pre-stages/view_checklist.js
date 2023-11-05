// material-ui
import { useState, React, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItemButton, ListItemText } from '@mui/material';

// // third-party
import * as yup from 'yup';

// ===============================|| UI DIALOG - FORMS ||=============================== //

export default function ViewChecklist({ data, onEmit }) {
    const theme = useTheme();
    const [editOpen, setEditOpen] = useState(true);
    const [checklists, setChecklists] = useState([]);

    useEffect(() => {
        setChecklists(data.checklists);
    }, [data]);
    const handleEditClose = () => {
        setEditOpen(false);
        onEmit(false);
    };

    return (
        <div>
            <Dialog open={editOpen} onClose={handleEditClose} aria-labelledby="form-dialog-title">
                <>
                    <DialogTitle id="form-dialog-title">Checklists:</DialogTitle>
                    <DialogContent style={{ width: '420px' }}>
                        <List component="nav" aria-label="main mailbox folders">
                            {checklists.map((item) => (
                                <ListItemButton>
                                    <ListItemText primary={item.name} />
                                </ListItemButton>
                            ))}
                        </List>
                    </DialogContent>
                    <DialogActions sx={{ pr: 2.5 }}>
                        <Button sx={{ color: theme.palette.error.dark }} onClick={handleEditClose} color="secondary">
                            Cancel
                        </Button>
                    </DialogActions>
                </>
            </Dialog>
        </div>
    );
}
