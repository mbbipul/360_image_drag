import { Close, Add} from '@mui/icons-material';
import { Fab, Grow, Tooltip } from '@mui/material';
import React, { useState } from 'react';

const Fabmenu = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <Grow
                in={isOpen}
                style={{ transformOrigin: '0 0 0' }}
                {...(isOpen ? { timeout: 1000 } : {})}
            >
                <div style={{
                    position: "absolute",
                    bottom:  100,
                    right: 20,
                    zIndex: 9999,
                    display: "flex",
                    flexDirection: "column",
                    gap: 5
                }}>
                    {
                        props.fabs.map((fab, index) => {
                            return (
                                <Tooltip title={fab.title} key={fab.title+index} placement='left'>
                                    <Fab
                                        color={fab.color}
                                        onClick={fab.onClick || null}
                                    >
                                        {fab.icon}
                                    </Fab>
                                </Tooltip>
                            );
                        })
                    }
                </div>
            </Grow>
            <Fab 
				sx={{
					position: "absolute",
					bottom:  20,
					right: 20,
					zIndex: 9999,
				}}
				color="primary" 
				aria-label="add"
                onClick={() => setIsOpen(!isOpen)}
			>
                {
                    isOpen ? (
                        <Grow
                            in={isOpen}
                            style={{ transformOrigin: '0 0 0' }}
                            {...(isOpen ? { timeout: 1000 } : {})}
                        >
                            <Close />
                        </Grow>
                    ) : (
                        <Grow
                            in={!isOpen}
                            style={{ transformOrigin: '0 0 0' }}
                            {...(!isOpen ? { timeout: 1000 } : {})}
                        >
                            <Add />
                        </Grow>
                    )
                }
                
			</Fab>
        </div>
    );
};

export default Fabmenu;