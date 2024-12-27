'use client'

import { ReactNode } from "react";
import {
    AppBar,
    Box,
    Button,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ThemeProvider,
    Toolbar,
    Typography,
} from '@mui/material';
import {Logout as LogoutIcon, Menu as MenuIcon} from '@mui/icons-material';
 
export default function InventoryLayout({children}: {children: ReactNode}) {
    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton>
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{flexGrow: 1}}
                    >
                        在庫管理システム
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<LogoutIcon />}
                    >
                        ログアウト
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer anchor="left">
                <Box sx={{ width: 240 }}>
                    <Toolbar />
                    <Divider />
                    <List>
                        <ListItem component="a" href="/inventry/products" disablePadding>
                            <ListItemButton>
                                <ListItemText primary='商品一覧' />
                            </ListItemButton>
                        </ListItem>
                        <Divider />
                        <ListItem component="a" href="/inventry/import_sales" disablePadding>
                            <ListItemButton>
                                <ListItemText primary='売上一括登録' />
                            </ListItemButton>
                        </ListItem>
                        <Divider />
                    </List>
                </Box>
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    //AppBarと被るため下にずらしている
                    marginTop: "64px",
                    width: "100%",
                    background: "white",
                }}
            >
                {children}
            </Box>
            <Box
                component="footer"
                sx={{
                    width: "100%",
                    position: "fixed",
                    textAlign: "center",
                    bottom: 0,
                    background: "#1976d2",
                }}
            >
                <Typography variant="caption" color="white">
                     ©2023 full stack web development
                </Typography>
            </Box>
        </Box>
    );
}