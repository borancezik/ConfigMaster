import React, { useState, useEffect } from 'react';
import {
    Box, Button, Container, Dialog, DialogActions, DialogContent,
    DialogTitle, IconButton, List, ListItem, ListItemText,
    TextField, Typography, Paper, Divider,
    AppBar, Toolbar, InputAdornment,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Checkbox, Select, MenuItem, FormControl, InputLabel,
    Grid, CircularProgress,
    Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import AppsIcon from '@mui/icons-material/Apps';
import CloseIcon from '@mui/icons-material/Close';

// Helper for Snackbar Alert
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// API'nin temel URL'si.
const apiBase = 'http://localhost:8080/api';

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

function NewApplicationDialog({ open, onClose, onAdd }) {
    const [name, setName] = useState('');
    const [domain, setDomain] = useState('');
    const [port, setPort] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        if (!name || !domain || !port) {
            alert('Please fill in all fields.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${apiBase}/applications/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    domain: domain,
                    port: port
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to add application: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const apiResponse = await response.json();
            if (apiResponse.isSuccess && apiResponse.data) {
                onAdd(apiResponse.data);
                setName(''); setDomain(''); setPort('');
                onClose();
            } else {
                throw new Error(apiResponse.message || 'Failed to add application with unknown error.');
            }

        } catch (error) {
            console.error('Error adding application:', error);
            alert(`Error adding application: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ pb: 1, borderBottom: '1px solid #e0e0e0', fontWeight: 'bold' }}>New Application</DialogTitle>
            <DialogContent sx={{ pt: 2, pb: 2 }}>
                <TextField label="Name" fullWidth margin="dense" value={name} onChange={e => setName(e.target.value)} />
                <TextField label="Domain" fullWidth margin="dense" value={domain} onChange={e => setDomain(e.target.value)} />
                <TextField
                    label="Port"
                    fullWidth
                    margin="dense"
                    value={port}
                    onChange={e => setPort(e.target.value)}
                />
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
                <Button onClick={onClose} variant="outlined" disabled={loading}>Cancel</Button>
                <Button variant="contained" onClick={handleAdd} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Add'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function ApplicationTable({ applications, onSelect, onDelete, loading, error }) {
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.domain.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <CircularProgress sx={{ my: 3 }} />
                                    <Typography variant="body2" color="textSecondary">Loading applications...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography variant="body2" color="error">Error loading applications: {error}</Typography>
                                </TableCell>
                            </TableRow>
                        ) : filteredApplications.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography variant="body2" color="textSecondary">No applications found.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredApplications.map((app) => (
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
                                    onClick={() => onSelect(app.id, app.name)}
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
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

function ConfigDetailsDialog({ open, onClose, configs, onUpdateConfig, envTypeName, selectedAppId, onDeleteConfig, showSnackbar }) {
    const [editedConfigs, setEditedConfigs] = useState({});
    const [loading, setLoading] = useState(false);

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

    const handleSave = async () => {
        setLoading(true);
        let hasError = false; // Herhangi bir güncellemede hata olup olmadýðýný tutar
        try {
            // Her bir konfigürasyonu döngüye al
            for (const config of configs) {
                const currentEditedText = editedConfigs[config.id];
                // Yalnýzca deðiþiklik varsa API isteði yap
                if (currentEditedText !== config.config) {
                    const updateCommand = {
                        id: config.id,
                        applicationId: selectedAppId, // veya config.applicationId, hangisi doðruysa
                        envType: config.envType,
                        configType: config.configType,
                        config: currentEditedText
                    };

                    try {
                        const response = await fetch(`${apiBase}/configs/update`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(updateCommand),
                        });

                        const contentType = response.headers.get("content-type");
                        let apiResponse;
                        let errorMessage = `Failed to update config ${config.id}: ${response.status} ${response.statusText}`;

                        if (contentType && contentType.includes("application/json")) {
                            apiResponse = await response.json();
                            if (response.ok && apiResponse.isSuccess) {
                                onUpdateConfig(config.id, currentEditedText);
                                showSnackbar('Configuration updated successfully!', 'success');
                            } else {
                                hasError = true;
                                errorMessage = apiResponse.message || errorMessage;
                                showSnackbar(errorMessage, 'error');
                                console.error('Error updating config (API response):', apiResponse);
                            }
                        } else {
                            const rawText = await response.text();
                            hasError = true;
                            errorMessage = `Unexpected response format for config ${config.id}. Status: ${response.status}, Raw Response: ${rawText}`;
                            showSnackbar(errorMessage, 'error');
                            console.error('Error updating config (Raw response):', rawText);
                        }
                    } catch (fetchError) {
                        // Að hatasý, CORS veya JSON ayrýþtýrma hatasý gibi durumlar
                        hasError = true;
                        console.error(`Error during fetch for config ${config.id}:`, fetchError);
                        showSnackbar(`Network error or malformed response for config ${config.id}: ${fetchError.message}`, 'error');
                    }
                }
            }
            // Tüm iþlemler bittikten sonra, eðer hiç hata olmadýysa dialogu kapat
            if (!hasError) {
                onClose();
            }
        } catch (error) {
            // Toplam 'Save Changes' sürecinde beklenmedik bir hata olursa
            hasError = true;
            console.error('Error in save configurations process:', error);
            showSnackbar(`An unexpected error occurred: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (configId) => {
        if (!window.confirm('Are you sure you want to delete this configuration?')) return;

        setLoading(true);
        try {
            const response = await fetch(`${apiBase}/configurations/${configId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete configuration: ${response.status} ${response.statusText} - ${errorText}`);
            }

            onDeleteConfig(configId);
            setEditedConfigs(prev => {
                const newEdited = { ...prev };
                delete newEdited[configId];
                return newEdited;
            });
            showSnackbar('Configuration deleted successfully!', 'success');

        } catch (err) {
            console.error('Error deleting configuration:', err);
            showSnackbar(`Error deleting configuration: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ pb: 1, borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', textAlign: 'center' }}>
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
                {configs.length === 0 ? (
                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 2 }}>
                        No configurations found for this environment.
                    </Typography>
                ) : (
                    <List sx={{ pt: 0 }}>
                        {configs.map(config => (
                            <ListItem
                                key={config.id}
                                sx={{
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    mb: 2,
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    p: 1.5,
                                    position: 'relative',
                                    '&:hover .delete-button': {
                                        opacity: 1,
                                        pointerEvents: 'auto',
                                    },
                                }}
                            >
                                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 0.5, textTransform: 'uppercase' }}>
                                    Type: {getConfigTypeName(config.configType)}
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
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => handleDelete(config.id)}
                                    className="delete-button"
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        color: (theme) => theme.palette.error.main,
                                        zIndex: 1,
                                        opacity: 0,
                                        pointerEvents: 'none',
                                        transition: 'opacity 0.2s ease-in-out',
                                    }}
                                    disabled={loading}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
                <Button onClick={onClose} variant="outlined" disabled={loading}>Cancel</Button>
                <Button variant="contained" onClick={handleSave} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Snackbar gösterme helper fonksiyonu
    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const fetchConfigs = async () => {
        if (!applicationId) return;

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${apiBase}/configs/getbyapplicationid/${applicationId}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch configurations: ${response.status} ${response.statusText} - ${errorText}`);
            }
            const data = await response.json();
            setConfigs(data);
        } catch (err) {
            console.error('Error fetching configurations:', err);
            setError(err.message);
            showSnackbar(`Error fetching configurations: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && applicationId) {
            fetchConfigs();
        } else {
            setConfigs([]);
        }
    }, [applicationId, open]);

    const handleAdd = async () => {
        if (!newConfigText) {
            showSnackbar('Please enter config content.', 'warning');
            return;
        }

        setLoading(true);
        try {
            const newConfigItem = {
                applicationId: applicationId,
                envType: newEnvType,
                configType: newConfigType,
                config: newConfigText
            };

            const response = await fetch(`${apiBase}/configs/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newConfigItem),
            });

            const apiResponse = await response.json();

            if (response.ok && apiResponse.isSuccess) {
                showSnackbar('Configuration added successfully!', 'success');
                setNewConfigText('');
                fetchConfigs();
            } else {
                const errorMessage = apiResponse.message || `Failed to add configuration: ${response.status} ${response.statusText}`;
                throw new Error(errorMessage);
            }
        } catch (err) {
            console.error('Error adding configuration:', err);
            showSnackbar(`Error adding configuration: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteConfigFromList = (configIdToDelete) => {
        setConfigs(prev => prev.filter(c => c.id !== configIdToDelete));
        setConfigsForDetailsDialog(prev => prev.filter(c => c.id !== configIdToDelete));
        showSnackbar('Configuration deleted successfully!', 'success');
        // Ýsteðe baðlý olarak, tam yenileme isterseniz fetchConfigs() çaðrýlabilir
    };


    const handleDeleteEnvType = async (envTypeToDelete) => {
        if (!window.confirm(`Are you sure you want to delete ALL configurations for the ${getEnvTypeName(envTypeToDelete)} environment? This action cannot be undone.`)) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${apiBase}/configurations/application/${applicationId}/environment/${envTypeToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete configurations for environment ${getEnvTypeName(envTypeToDelete)}: ${response.status} ${response.statusText} - ${errorText}`);
            }

            showSnackbar(`${getEnvTypeName(envTypeToDelete)} environment configurations deleted successfully!`, 'success');

            setConfigs(prev => prev.filter(c => c.envType !== envTypeToDelete));
            if (selectedEnvType === envTypeToDelete) {
                setDetailsDialogOpen(false);
                setSelectedEnvType(null);
                setConfigsForDetailsDialog([]);
            }
        } catch (err) {
            console.error(`Error deleting configurations for environment ${getEnvTypeName(envTypeToDelete)}:`, err);
            showSnackbar(`Error deleting environment configurations: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };


    const handleEnvTypeClick = (envType) => {
        setSelectedEnvType(envType);
        setConfigsForDetailsDialog(configs.filter(c => c.envType === envType));
        setDetailsDialogOpen(true);
    };

    const handleUpdateConfigValue = (configId, newConfigText) => {
        setConfigs(prevConfigs =>
            prevConfigs.map(config =>
                config.id === configId
                    ? { ...config, config: newConfigText }
                    : config
            )
        );
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const groupedConfigs = configs.reduce((acc, config) => {
        const env = config.envType;
        if (!acc[env]) {
            acc[env] = [];
        }
        acc[env].push(config);
        return acc;
    }, {});

    const sortedEnvTypes = Object.keys(groupedConfigs).sort((a, b) => parseInt(a) - parseInt(b));

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ pb: 1, borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', textAlign: 'center' }}>
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
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <CircularProgress />
                        <Typography variant="body1" sx={{ ml: 2 }}>Loading configurations...</Typography>
                    </Box>
                ) : error ? (
                    <Typography variant="h6" color="error" sx={{ textAlign: 'center', mt: 4 }}>
                        Error: {error}
                    </Typography>
                ) : (
                    applicationId ? (
                        <>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: '500', mb: 2, color: '#424242' }}>
                                Configurations by Environment
                            </Typography>
                            <List sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
                                {sortedEnvTypes.length > 0 ? (
                                    sortedEnvTypes.map(envType => (
                                        <ListItem
                                            key={envType}
                                            sx={{
                                                border: '1px solid #e0e0e0',
                                                borderRadius: '8px',
                                                backgroundColor: '#f8f8f8',
                                                position: 'relative',
                                                overflow: 'hidden',
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
                                                '&:hover .delete-env-button': {
                                                    opacity: 1,
                                                    pointerEvents: 'auto',
                                                },
                                            }}
                                        >
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                width: '100%',
                                                cursor: 'pointer',
                                            }}
                                                onClick={() => handleEnvTypeClick(parseInt(envType))}
                                            >
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                                                        {getEnvTypeName(parseInt(envType))}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {groupedConfigs[envType].length} configurations
                                                    </Typography>
                                                </Box>
                                                <IconButton
                                                    aria-label="delete-environment"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteEnvType(parseInt(envType));
                                                    }}
                                                    className="delete-env-button"
                                                    sx={{
                                                        ml: 1,
                                                        color: (theme) => theme.palette.error.main,
                                                        opacity: 0,
                                                        pointerEvents: 'none',
                                                        transition: 'opacity 0.2s ease-in-out',
                                                    }}
                                                    disabled={loading}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
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
                            <Paper sx={{ p: 3, borderRadius: '12px', backgroundColor: '#ffffff', boxShadow: 'none', border: 'none' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                                    <Button variant="contained" onClick={handleAdd} sx={{ alignSelf: 'flex-end' }} disabled={loading}>
                                        {loading ? <CircularProgress size={24} /> : 'Add Configuration'}
                                    </Button>
                                </Box>
                            </Paper>
                        </>
                    ) : (
                        <Typography variant="h6" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
                            Please select an application to view or add configurations.
                        </Typography>
                    )
                )}
            </DialogContent>
            <ConfigDetailsDialog
                open={detailsDialogOpen}
                onClose={() => setDetailsDialogOpen(false)}
                configs={configsForDetailsDialog}
                onUpdateConfig={handleUpdateConfigValue}
                envTypeName={getEnvTypeName(selectedEnvType)}
                selectedAppId={applicationId}
                onDeleteConfig={handleDeleteConfigFromList}
                showSnackbar={showSnackbar}
            />
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
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
    const [loadingApplications, setLoadingApplications] = useState(true);
    const [applicationsError, setApplicationsError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            setLoadingApplications(true);
            setApplicationsError(null);
            try {
                const response = await fetch(`${apiBase}/applications`);
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to fetch applications: ${response.status} ${response.statusText} - ${errorText}`);
                }
                const data = await response.json();
                setApplications(data);
            } catch (error) {
                console.error('Error fetching applications:', error);
                setApplicationsError(error.message);
            } finally {
                setLoadingApplications(false);
            }
        };

        fetchApplications();
    }, []);

    const handleAddApplication = (app) => {
        setApplications(prev => [...prev, app]);
    };

    const handleSelectApplication = (id, name) => {
        setSelectedAppId(id);
        setSelectedAppName(name);
        setConfigListDialogOpen(true);
    };

    const handleDeleteApplication = async (id) => {
        if (!window.confirm('Are you sure you want to delete this application and all its configurations?')) return;

        setLoadingApplications(true);
        try {
            const response = await fetch(`${apiBase}/applications/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete application: ${response.status} ${response.statusText} - ${errorText}`);
            }

            setApplications(prev => prev.filter(a => a.id !== id));
            if (selectedAppId === id) {
                setSelectedAppId(null);
                setSelectedAppName(null);
                setConfigListDialogOpen(false);
            }
        } catch (error) {
            console.error('Error deleting application:', error);
            alert(`Error deleting application: ${error.message}`);
        } finally {
            setLoadingApplications(false);
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
                            loading={loadingApplications}
                            error={applicationsError}
                        />
                        <ConfigListDialog
                            open={configListDialogOpen}
                            onClose={() => setConfigListDialogOpen(false)}
                            applicationId={selectedAppId}
                            selectedAppName={selectedAppName}
                        />
                    </>
                )}

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