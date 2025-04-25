import React, { useState } from 'react';
import {
  TextField,
  Box,
  CircularProgress,
  Paper,
  IconButton,
  InputAdornment,
  Chip,
  Stack,
  Menu,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
} from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Movie } from '../types';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';

interface MovieSearchProps {
  onMovieSelect: (movie: Movie) => void;
  onFilterChange?: (filters: MovieFilters) => void;
}

interface MovieFilters {
  sortBy: 'date' | 'rating';
  sortOrder: 'asc' | 'desc';
}

const MovieSearch: React.FC<MovieSearchProps> = ({ onMovieSelect, onFilterChange }) => {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filters, setFilters] = useState<MovieFilters>({
    sortBy: 'rating',
    sortOrder: 'desc'
  });

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (sortBy: 'date' | 'rating') => {
    const newFilters = {
      ...filters,
      sortBy,
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'
    };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
    handleFilterClose();
  };

  const searchMovies = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.get<Movie[]>(`/api/search?query=${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching movies:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box 
        sx={{ 
          width: '100%', 
          maxWidth: 1200, 
          mx: 'auto', 
          mb: 4,
          p: 3,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              fullWidth
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                searchMovies(e.target.value);
              }}
              placeholder="Search for movies..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(8px)',
                  '& input': {
                    color: '#ffffff',
                    fontSize: '1.1rem',
                    '&::placeholder': {
                      color: 'rgba(255, 255, 255, 0.7)'
                    }
                  },
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)'
                    }
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    '& fieldset': {
                      borderColor: '#90caf9'
                    }
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  </InputAdornment>
                ),
                endAdornment: loading && (
                  <InputAdornment position="end">
                    <CircularProgress color="primary" size={20} />
                  </InputAdornment>
                )
              }}
            />
            <Button
              variant="contained"
              onClick={handleFilterClick}
              startIcon={<FilterListIcon />}
              sx={{
                borderRadius: '16px',
                minWidth: '120px',
                height: '56px',
                backgroundColor: 'rgba(144, 202, 249, 0.15)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(144, 202, 249, 0.3)',
                color: '#90caf9',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(144, 202, 249, 0.25)',
                  border: '1px solid rgba(144, 202, 249, 0.5)'
                }
              }}
            >
              Filter
            </Button>
          </Box>
          
          <Stack direction="row" spacing={2}>
            <Chip
              label={`Sort by: ${filters.sortBy}`}
              variant="outlined"
              size="medium"
              color="primary"
              sx={{
                borderRadius: '12px',
                backgroundColor: 'rgba(144, 202, 249, 0.1)',
                borderColor: 'rgba(144, 202, 249, 0.3)',
                color: '#90caf9',
                '& .MuiChip-label': {
                  fontSize: '0.9rem'
                }
              }}
            />
            <Chip
              label={`Order: ${filters.sortOrder}`}
              variant="outlined"
              size="medium"
              color="primary"
              sx={{
                borderRadius: '12px',
                backgroundColor: 'rgba(144, 202, 249, 0.1)',
                borderColor: 'rgba(144, 202, 249, 0.3)',
                color: '#90caf9',
                '& .MuiChip-label': {
                  fontSize: '0.9rem'
                }
              }}
            />
          </Stack>
        </Stack>

        {searchResults.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={3}>
              {searchResults.map((movie) => (
                <Grid item xs={12} sm={6} md={4} key={movie.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      onClick={() => onMovieSelect(movie)}
                      sx={{
                        height: '100%',
                        cursor: 'pointer',
                        background: 'rgba(30, 30, 30, 0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
                          border: '1px solid rgba(144, 202, 249, 0.5)'
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="300"
                        image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.jpg'}
                        alt={movie.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent>
                        <Typography variant="h6" component="h3" sx={{ color: '#fff', mb: 1 }}>
                          {movie.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Rating
                            value={movie.vote_average / 2}
                            precision={0.5}
                            readOnly
                            size="small"
                          />
                          <Typography variant="body2" sx={{ ml: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                            ({movie.vote_average.toFixed(1)})
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {movie.overview}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleFilterClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              backgroundColor: 'rgba(30, 30, 30, 0.95)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              '& .MuiMenuItem-root': {
                color: '#fff',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }
            }
          }}
        >
          <MenuItem onClick={() => handleSortChange('date')}>
            <SortIcon sx={{ mr: 1 }} /> Sort by Date
          </MenuItem>
          <MenuItem onClick={() => handleSortChange('rating')}>
            <SortIcon sx={{ mr: 1 }} /> Sort by Rating
          </MenuItem>
        </Menu>
      </Box>
    </motion.div>
  );
};

export default MovieSearch;