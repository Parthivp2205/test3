import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  index: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, index }) => (
  <Box sx={{ width: '100%', height: '100%' }}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ height: '100%' }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(to bottom, rgba(30, 30, 30, 0.9), rgba(20, 20, 20, 0.95))',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
          },
        }}
      >
        <CardMedia
          component="img"
          sx={{
            aspectRatio: '2/3',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
          image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder.jpg'}
          alt={movie.title}
        />
        <CardContent 
          sx={{ 
            flexGrow: 1,
            background: 'linear-gradient(to bottom, rgba(20, 20, 20, 0.8), rgba(10, 10, 10, 0.9))',
            padding: '1.2rem',
          }}
        >
          <Typography 
            gutterBottom 
            variant="h6" 
            component="h2" 
            noWrap
            sx={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#fff',
              marginBottom: '0.8rem',
            }}
          >
            {movie.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <Rating
              value={movie.vote_average / 2}
              precision={0.5}
              readOnly
              size="small"
              sx={{
                color: '#ffd700',
                '& .MuiRating-iconFilled': {
                  color: '#ffd700',
                },
              }}
            />
            <Typography 
              variant="body2" 
              sx={{ 
                ml: 1,
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.9rem',
              }}
            >
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
              overflow: 'hidden',
              lineHeight: 1.5,
              fontSize: '0.9rem',
            }}
          >
            {movie.overview}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  </Box>
);

interface MovieListProps {
  movies: Movie[];
}

const MovieList: React.FC<MovieListProps> = ({ movies }) => {
  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 3,
      p: 2,
      width: '100%',
      maxWidth: '1200px',
      mx: 'auto'
    }}>
      {movies.map((movie, index) => (
        <MovieCard key={movie.id} movie={movie} index={index} />
      ))}
    </Box>
  );
};

export default MovieList;