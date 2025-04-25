import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, Typography, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MovieSearch from './components/MovieSearch';
import MovieList from './components/MovieList';
import { Movie } from './types';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1', // Modern indigo
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#10b981', // Modern emerald
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: '#0f172a', // Modern slate
      paper: '#1e293b',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3.5rem',
      letterSpacing: '-0.5px',
      background: 'linear-gradient(45deg, #6366f1, #10b981)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h6: {
      fontWeight: 700,
      fontSize: '1.75rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
  },
});

const App: React.FC = () => {
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = React.useState<Movie[]>([]);

  const handleMovieSelect = (movie: Movie) => {
    const newMovies = [movie, ...movies];
    setMovies(newMovies);
    setFilteredMovies(newMovies);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Navigation Bar */}
        <Box
          component="nav"
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(10px)',
            padding: '1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(203, 213, 225, 0.1)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>

          <Typography
            variant="h6"
            sx={{
              color: 'primary.main',
              fontWeight: 800,
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            Movie Paradise
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {['Home', 'Live', 'TV', 'Movies', 'Sports', 'My Stuff'].map((item) => (
              <Button
                key={item}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'text.primary' },
                  fontSize: '0.95rem',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -2,
                    left: 0,
                    width: 0,
                    height: '2px',
                    backgroundColor: 'primary.main',
                    transition: 'width 0.3s ease'
                  },
                  '&:hover::after': {
                    width: '100%'
                  }
                }}
              >
                {item}
              </Button>
            ))}
          </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Button
              variant="outlined"
              sx={{
                borderColor: 'primary.light',
                color: 'primary.light',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)'
                }
              }}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #6366f1, #10b981)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(45deg, #4f46e5, #059669)'
                }
              }}
            >
              Get Started
            </Button>
          </Box>
        </Box>
        {/* Hero Banner */}
        <Box
          sx={{
            position: 'relative',
            height: '85vh',
            backgroundImage: movies[0]?.backdrop_path
              ? `url(https://image.tmdb.org/t/p/original${movies[0].backdrop_path})`
              : 'linear-gradient(45deg, #1e293b 0%, #0f172a 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.3) 0%, rgba(15, 23, 42, 0.8) 60%, #0f172a 100%)',
              backdropFilter: 'blur(4px)'
            }
          }}
        >
          <Container
            maxWidth="lg"
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              pb: 8,
              position: 'relative',
              zIndex: 1
            }}
          >
            <Typography
              variant="h1"
              sx={{
                color: 'white',
                mb: 2,
                maxWidth: '60%'
              }}
            >
              {movies[0]?.title || 'Discover Your Next Favorite'}
            </Typography>
            {movies[0] && (
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  mb: 3,
                  maxWidth: '50%',
                  fontSize: '1.1rem',
                  lineHeight: 1.5
                }}
              >
                {movies[0].overview}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrowIcon />}
                sx={{
                  background: 'linear-gradient(45deg, #6366f1, #10b981)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #4f46e5, #059669)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)'
                  },
                  px: 5,
                  py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: '16px'
                }}
              >
                Watch Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<InfoOutlinedIcon />}
                sx={{
                  borderColor: 'rgba(203, 213, 225, 0.3)',
                  borderWidth: '2px',
                  color: 'text.primary',
                  '&:hover': { 
                    borderColor: 'primary.light',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 20px 40px rgba(203, 213, 225, 0.1)'
                  },
                  px: 5,
                  py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: '16px'
                }}
              >
                More Info
              </Button>
            </Box>
          </Container>
        </Box>
          <MovieSearch 
            onMovieSelect={handleMovieSelect} 
            onFilterChange={(filters) => {
              const sorted = [...movies].sort((a, b) => {
                if (filters.sortBy === 'date') {
                  return filters.sortOrder === 'desc' 
                    ? new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
                    : new Date(a.release_date).getTime() - new Date(b.release_date).getTime();
                } else {
                  return filters.sortOrder === 'desc' 
                    ? b.vote_average - a.vote_average
                    : a.vote_average - b.vote_average;
                }
              });
              setFilteredMovies(sorted);
            }} 
          />
          <MovieList movies={filteredMovies} />
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
