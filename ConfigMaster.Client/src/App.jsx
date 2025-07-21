import React, { useState, useEffect } from 'react';
import {
    Box, Button, Container, Dialog, DialogActions, DialogContent,
    DialogTitle, IconButton, List, ListItem, ListItemText,
    TextField, Typography, Paper, Divider,
    AppBar, Toolbar, InputAdornment,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Checkbox, Select, MenuItem, FormControl, InputLabel,
    Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import AppsIcon from '@mui/icons-material/Apps';
import CloseIcon from '@mui/icons-material/Close';

const apiBase = '/api';

// Enum for EnvType (matching C# enum values)
const EnvType = {
    TEST: 0,
    PREPRODUCTION: 1,
    PRODUCTION: 2,
};

// Helper function to get EnvType name from value
const getEnvTypeName = (value) => {
    switch (value) {
        case EnvType.TEST: return 'Test';
        case EnvType.PREPRODUCTION: return 'Pre-Production';
        case EnvType.PRODUCTION: return 'Production';
        default: return 'Unknown';
    }
};

// ConfigType Enum/Sabitleri
const ConfigType = {
    APPSETTINGS: 0,
    SECRET: 1,
};

// Helper function to get ConfigType name from value
const getConfigTypeName = (value) => {
    switch (value) {
        case ConfigType.APPSETTINGS: return 'App Settings';
        case ConfigType.SECRET: return 'Secret';
        default: return 'Unknown Type';
    }
};


// Temporary Application Data (IDs match application_id in tempConfigData)
const tempData = [
    { id: '1', name: 'ProductCatalogService', domain: 'api.product.com', port: 8080 },
    { id: '2', name: 'OrderManagementAPI', domain: 'api.order.net', port: 5000 },
    { id: '3', name: 'UserAuthService', domain: 'auth.mycorp.org', port: 3000 },
    { id: '4', name: 'PaymentGateway', domain: 'pay.gateway.dev', port: 443 },
];

// Temporary Configuration Data (config field is plain text, config_type updated)
const tempConfigData = {
    '1': [
        { id: '1', application_id: '1', env_type: EnvType.TEST, config_type: ConfigType.APPSETTINGS, config: 'Database:ConnectionString=Server=testsql;Database=Products_Test' },
        { id: '2', application_id: '1', env_type: EnvType.TEST, config_type: ConfigType.APPSETTINGS, config: 'Logging:LogLevel:Default=Debug' },
        { id: '3', application_id: '1', env_type: EnvType.PRODUCTION, config_type: ConfigType.APPSETTINGS, config: 'Service:TimeoutSeconds=30' },
        { id: '4', application_id: '1', env_type: EnvType.PRODUCTION, config_type: ConfigType.SECRET, config: 'DB_PASSWORD_PROD=supersecret123' },
    ],
    '2': [
        { id: '5', application_id: '2', env_type: EnvType.PREPRODUCTION, config_type: ConfigType.APPSETTINGS, config: 'Queue:Endpoint=sqs.aws.com/orders_preprod' },
        { id: '6', application_id: '2', env_type: EnvType.PRODUCTION, config_type: ConfigType.APPSETTINGS, config: 'FeatureToggles:NewOrderFlow=true' },
    ],
    '3': [
        { id: '7', application_id: '3', env_type: EnvType.TEST, config_type: ConfigType.SECRET, config: 'JWT_KEY_TEST=mysafetestkey' },
        { id: '8', application_id: '3', env_type: EnvType.PRODUCTION, config_type: ConfigType.APPSETTINGS, config: 'Auth:Provider=AzureAD' },
    ],
    '4': [
        { id: '9', application_id: '4', env_type: EnvType.PRODUCTION, config_type: ConfigType.SECRET, config: 'Stripe:ApiKey=pk_prod_abcdef_secret' },
        { id: '10', application_id: '4', env_type: EnvType.TEST, config_type: ConfigType.APPSETTINGS, config: 'Currency:Default=EUR' },
    ],
};


function NewApplicationDialog({ open, onClose, onAdd }) {
    const [name, setName] = useState('');
    const [domain, setDomain] = useState('');
    const [port, setPort] = useState('');

    const handleAdd = async () => {
        if (!name || !domain || !port) return alert('Please fill in all fields.');

        const newApp = {
            id: `temp-app-${Date.now()}`,
            name,
            domain,
            port: Number(port)
        };
        onAdd(newApp);
        setName(''); setDomain(''); setPort('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ pb: 1, borderBottom: '1px solid #e0e0e0', fontWeight: 'bold' }}>New Application</DialogTitle>
            <DialogContent sx={{ pt: 2, pb: 2 }}>
                <TextField label="Name" fullWidth margin="dense" value={name} onChange={e => setName(e.target.value)} />
                <TextField label="Domain" fullWidth margin="dense" value={domain} onChange={e => setDomain(e.target.value)} />
                <TextField label="Port" fullWidth type="number" margin="dense" value={port} onChange={e => setPort(e.target.value)} />
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
                <Button onClick={onClose} variant="outlined">Cancel</Button>
                <Button variant="contained" onClick={handleAdd}>Add</Button>
            </DialogActions>
        </Dialog>
    );
}

function ApplicationTable({ applications, onSelect, onDelete }) {
    const [filter, setFilter] = useState('All');

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'normal' }}>
                        Applications
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Filter by</InputLabel>
                        <Select
                            value={filter}
                            label="Filter by"
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <MenuItem value="All">All</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#9e9e9e' }} />
                                </InputAdornment>
                            ),
                            style: { borderRadius: '8px', backgroundColor: '#f5f5f5' }
                        }}
                    />
                </Box>
            </Box>
            <TableContainer>
                <Table stickyHeader aria-label="application table">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Domain</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Port</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {applications.map((app) => (
                            <TableRow
                                hover
                                key={app.id}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                    }
                                }}
                                onClick={() => onSelect(app.id)}
                            >
                                <TableCell>{app.name}</TableCell>
                                <TableCell>{app.domain}</TableCell>
                                <TableCell>{app.port}</TableCell>
                                <TableCell>
                                    <IconButton edge="end" onClick={(e) => { e.stopPropagation(); onDelete(app.id); }}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

// Dialog component for displaying and editing configurations
function ConfigDetailsDialog({ open, onClose, configs, onUpdateConfig, envTypeName, selectedAppId }) {
    const [editedConfigs, setEditedConfigs] = useState({});

    useEffect(() => {
        const initialEdited = {};
        configs.forEach(config => {
            initialEdited[config.id] = config.config || '';
        });
        setEditedConfigs(initialEdited);
    }, [configs]);

    const handleChange = (id, newValue) => {
        setEditedConfigs(prev => ({ ...prev, [id]: newValue }));
    };

    const handleSave = () => {
        configs.forEach(config => {
            const currentEditedText = editedConfigs[config.id];
            if (currentEditedText !== config.config) {
                onUpdateConfig(config.id, currentEditedText, selectedAppId);
            }
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ pb: 1, borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', textAlign: 'center' }}> {/* textAlign: 'center' eklendi */}
                {envTypeName} Configurations
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 2, pb: 2 }}>
                <List sx={{ pt: 0 }}>
                    {configs.map(config => (
                        <ListItem key={config.id} sx={{ flexDirection: 'column', alignItems: 'flex-start', mb: 2, border: '1px solid #e0e0e0', borderRadius: '8px', p: 1.5 }}>
                            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 0.5, textTransform: 'uppercase' }}>
                                Type: {getConfigTypeName(config.config_type)}
                            </Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                multiline
                                rows={4}
                                value={editedConfigs[config.id] || ''}
                                onChange={(e) => handleChange(config.id, e.target.value)}
                                sx={{ mt: 0.5, mb: 1 }}
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
                <Button onClick={onClose} variant="outlined">Cancel</Button>
                <Button variant="contained" onClick={handleSave}>Save Changes</Button>
            </DialogActions>
        </Dialog>
    );
}


function ConfigListDialog({ open, onClose, applicationId, selectedAppName }) {
    const [configs, setConfigs] = useState([]);
    const [newConfigText, setNewConfigText] = useState('');
    const [newEnvType, setNewEnvType] = useState(EnvType.TEST);
    const [newConfigType, setNewConfigType] = useState(ConfigType.APPSETTINGS);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [selectedEnvType, setSelectedEnvType] = useState(null);
    const [configsForDetailsDialog, setConfigsForDetailsDialog] = useState([]);

    useEffect(() => {
        if (!applicationId) {
            setConfigs([]);
            return;
        }

        // Simulating API call
        setTimeout(() => {
            setConfigs(tempConfigData[applicationId] || []);
        }, 300);
    }, [applicationId, open]);

    const handleAdd = async () => {
        if (!newConfigText) return alert('Please enter config content.');

        const newConfigItem = {
            id: `temp-conf-${Date.now()}`,
            application_id: applicationId,
            env_type: newEnvType,
            config_type: newConfigType,
            config: newConfigText
        };
        setConfigs(prev => [...prev, newConfigItem]);
        setNewConfigText('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this configuration? (Temporary)')) return;
        setConfigs(prev => prev.filter(c => c.id !== id));
    };

    const handleEnvTypeClick = (envType) => {
        setSelectedEnvType(envType);
        setConfigsForDetailsDialog(configs.filter(c => c.env_type === envType));
        setDetailsDialogOpen(true);
    };

    const handleUpdateConfigValue = (configId, newConfigText, currentAppId) => {
        setConfigs(prevConfigs =>
            prevConfigs.map(config =>
                config.id === configId
                    ? { ...config, config: newConfigText }
                    : config
            )
        );
        if (tempConfigData[currentAppId]) {
            const configIndex = tempConfigData[currentAppId].findIndex(c => c.id === configId);
            if (configIndex !== -1) {
                tempConfigData[currentAppId][configIndex].config = newConfigText;
            }
        }
    };

    // Group configs by EnvType
    const groupedConfigs = configs.reduce((acc, config) => {
        const env = config.env_type;
        if (!acc[env]) {
            acc[env] = [];
        }
        acc[env].push(config);
        return acc;
    }, {});

    const sortedEnvTypes = Object.keys(groupedConfigs).sort((a, b) => parseInt(a) - parseInt(b));

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ pb: 1, borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', textAlign: 'center' }}> {/* textAlign: 'center' eklendi */}
                {selectedAppName ? `${selectedAppName}` : 'Application Configurations'}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 2, pb: 2 }}>
                {applicationId ? (
                    <>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: '500', mb: 2, color: '#424242' }}>
                            Configurations by Environment
                        </Typography>
                        <List sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
                            {sortedEnvTypes.length > 0 ? (
                                sortedEnvTypes.map(envType => (
                                    <ListItem
                                        key={envType}
                                        button
                                        onClick={() => handleEnvTypeClick(parseInt(envType))}
                                        sx={{
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '8px',
                                            backgroundColor: '#f8f8f8',
                                            '&:hover': {
                                                backgroundColor: '#e3f2fd',
                                                borderColor: '#90caf9',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                            },
                                            transition: 'all 0.2s ease-in-out',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            py: 2,
                                            px: 2,
                                        }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                                            {getEnvTypeName(parseInt(envType))}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {groupedConfigs[envType].length} configurations
                                        </Typography>
                                    </ListItem>
                                ))
                            ) : (
                                <Typography variant="body2" color="textSecondary" sx={{ ml: 2, mt: 1 }}>
                                    No configurations for this application.
                                </Typography>
                            )}
                        </List>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h6" gutterBottom sx={{ fontWeight: '500', mb: 2, color: '#424242' }}>
                            Add New Configuration
                        </Typography>
                        <Paper sx={{ p: 3, borderRadius: '12px', backgroundColor: '#ffffff', boxShadow: 'none', border: 'none' }}> {/* boxShadow ve border kaldýrýldý */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {/* EnvType Select */}
                                <FormControl fullWidth size="small">
                                    <InputLabel id="env-type-select-label">Environment Type</InputLabel>
                                    <Select
                                        labelId="env-type-select-label"
                                        value={newEnvType}
                                        label="Environment Type"
                                        onChange={(e) => setNewEnvType(e.target.value)}
                                    >
                                        {Object.values(EnvType).map(type => (
                                            <MenuItem key={type} value={type}>{getEnvTypeName(type)}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* ConfigType Select */}
                                <FormControl fullWidth size="small">
                                    <InputLabel id="config-type-select-label">Configuration Type</InputLabel>
                                    <Select
                                        labelId="config-type-select-label"
                                        value={newConfigType}
                                        label="Configuration Type"
                                        onChange={(e) => setNewConfigType(e.target.value)}
                                    >
                                        {Object.values(ConfigType).map(type => (
                                            <MenuItem key={type} value={type}>{getConfigTypeName(type)}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Single Config TextField */}
                                <TextField
                                    label="Config Content"
                                    value={newConfigText}
                                    onChange={e => setNewConfigText(e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={6}
                                    size="small"
                                    placeholder="Enter configuration content (e.g., JSON, connection string, etc.)"
                                />
                                <Button variant="contained" onClick={handleAdd} sx={{ alignSelf: 'flex-end' }}>Add Configuration</Button>
                            </Box>
                        </Paper>
                    </>
                ) : (
                    <Typography variant="h6" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
                        Please select an application to view or add configurations.
                    </Typography>
                )}
            </DialogContent>
            <ConfigDetailsDialog
                open={detailsDialogOpen}
                onClose={() => setDetailsDialogOpen(false)}
                configs={configsForDetailsDialog}
                onUpdateConfig={handleUpdateConfigValue}
                envTypeName={getEnvTypeName(selectedEnvType)}
                selectedAppId={applicationId}
            />
        </Dialog>
    );
}

export default function App() {
    const [applications, setApplications] = useState([]);
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [selectedAppName, setSelectedAppName] = useState(null);
    const [newAppDialogOpen, setNewAppDialogOpen] = useState(false);
    const [configListDialogOpen, setConfigListDialogOpen] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState('applications');

    useEffect(() => {
        setApplications(tempData);
    }, []);

    const handleAddApplication = (app) => setApplications(prev => [...prev, app]);

    const handleSelectApplication = (id) => {
        setSelectedAppId(id);
        const app = applications.find(a => a.id === id);
        setSelectedAppName(app ? app.name : null);
        setConfigListDialogOpen(true);
    };

    const handleDeleteApplication = async (id) => {
        if (!window.confirm('Are you sure you want to delete this application and all its configurations? (Temporary)')) return;
        setApplications(prev => prev.filter(a => a.id !== id));
        delete tempConfigData[id];
        if (selectedAppId === id) {
            setSelectedAppId(null);
            setSelectedAppName(null);
            setConfigListDialogOpen(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            {/* Left Navigation / Sidebar */}
            <Box sx={{
                width: 260,
                flexShrink: 0,
                backgroundColor: '#ffffff',
                borderRight: '1px solid #e0e0e0',
                pt: 4,
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            }}>
                <Box sx={{ pl: 3, pb: 3 }}>
                    <Typography variant="h5" color="primary" sx={{ fontWeight: '700', letterSpacing: '0.5px' }}>
                        ConfigMaster
                    </Typography>
                </Box>
                <Divider />
                <List component="nav" sx={{ pt: 2 }}>
                    <ListItem
                        button
                        selected={selectedMenuItem === 'applications'}
                        onClick={() => setSelectedMenuItem('applications')}
                        sx={{
                            py: 1.5,
                            px: 3,
                            '&.Mui-selected': {
                                backgroundColor: '#e8f0fe',
                                color: '#1976d2',
                                borderLeft: '4px solid #1976d2',
                                '& .MuiListItemIcon-root': {
                                    color: '#1976d2',
                                },
                                '&:hover': {
                                    backgroundColor: '#e8f0fe',
                                }
                            },
                            '&:hover': {
                                backgroundColor: '#f0f0f0',
                            },
                        }}
                    >
                        <AppsIcon sx={{ mr: 2.5 }} />
                        <ListItemText primary="Applications" />
                    </ListItem>
                    <ListItem
                        button
                        selected={selectedMenuItem === 'settings'}
                        onClick={() => setSelectedMenuItem('settings')}
                        sx={{
                            py: 1.5,
                            px: 3,
                            '&.Mui-selected': {
                                backgroundColor: '#e8f0fe',
                                color: '#1976d2',
                                borderLeft: '4px solid #1976d2',
                                '& .MuiListItemIcon-root': {
                                    color: '#1976d2',
                                },
                                '&:hover': {
                                    backgroundColor: '#e8f0fe',
                                }
                            },
                            '&:hover': {
                                backgroundColor: '#f0f0f0',
                            },
                        }}
                    >
                        <SettingsIcon sx={{ mr: 2.5 }} />
                        <ListItemText primary="Settings" />
                    </ListItem>
                </List>
            </Box>

            {/* Main Content Area */}
            <Box sx={{ flexGrow: 1, p: 4 }}>
                {/* Header / Toolbar */}
                <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 4 }}>
                    <Toolbar sx={{ justifyContent: 'space-between', px: 0 }}>
                        <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: '700', color: '#333' }}>
                            {selectedMenuItem === 'applications' && 'Application Management'}
                            {selectedMenuItem === 'settings' && 'System Settings'}
                        </Typography>
                    </Toolbar>
                </AppBar>

                {/* Content Section - Application List */}
                {selectedMenuItem === 'applications' && (
                    <>
                        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="contained" onClick={() => setNewAppDialogOpen(true)}
                                sx={{
                                    py: 1.2,
                                    px: 3,
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 8px rgba(25, 118, 210, 0.2)',
                                    '&:hover': {
                                        boxShadow: '0 6px 12px rgba(25, 118, 210, 0.3)',
                                    }
                                }}>
                                + Add Application
                            </Button>
                        </Box>
                        <ApplicationTable
                            applications={applications}
                            onSelect={handleSelectApplication}
                            onDelete={handleDeleteApplication}
                        />
                        {/* ConfigListDialog'u burada çaðýrýyoruz */}
                        <ConfigListDialog
                            open={configListDialogOpen}
                            onClose={() => setConfigListDialogOpen(false)}
                            applicationId={selectedAppId}
                            selectedAppName={selectedAppName}
                        />
                    </>
                )}

                {/* Placeholders for other menu items */}
                {selectedMenuItem === 'settings' && (
                    <Paper sx={{ p: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '12px', minHeight: '300px' }}>
                        <Typography variant="h6" color="textSecondary">
                            Coming Soon (:
                        </Typography>
                    </Paper>
                )}

                <NewApplicationDialog
                    open={newAppDialogOpen}
                    onClose={() => setNewAppDialogOpen(false)}
                    onAdd={handleAddApplication}
                />
            </Box>
        </Box>
    );
}