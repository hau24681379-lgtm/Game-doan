import React from 'react';
import { Box, Paper, Tooltip, Zoom } from '@mui/material';

const GRID_SIZE = 12; // 12x12 grid

export default function GameBoard({ games, selectedIndex, onGameClick }) {
  // Create a grid map
  const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
  
  // Place games onto the grid
  games.forEach((game, index) => {
    if (game.position_x < GRID_SIZE && game.position_y < GRID_SIZE) {
      grid[game.position_y][game.position_x] = { ...game, index };
    }
  });

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
      <Paper 
        elevation={6} 
        sx={{ 
          p: 3, 
          bgcolor: 'background.paper', 
          borderRadius: 8,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        }}
      >
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, 
            gap: 1.5,
            width: 'fit-content'
          }}
        >
          {grid.map((row, y) => 
            row.map((cell, x) => (
              <Box key={`${x}-${y}`} sx={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cell ? (
                  <Tooltip title={cell.name} TransitionComponent={Zoom} arrow>
                    <Box
                      onClick={() => onGameClick(cell.index)}
                      sx={{
                        width: cell.index === selectedIndex ? 45 : 35,
                        height: cell.index === selectedIndex ? 45 : 35,
                        borderRadius: '50%',
                        bgcolor: cell.icon_color,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: cell.index === selectedIndex ? `0 0 20px ${cell.icon_color}` : 'none',
                        border: cell.index === selectedIndex ? '3px solid #fff' : '2px solid transparent',
                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        transform: cell.index === selectedIndex ? 'scale(1.1)' : 'scale(1)',
                        zIndex: cell.index === selectedIndex ? 10 : 1,
                        '&:hover': {
                           transform: 'scale(1.2)',
                           boxShadow: `0 0 25px ${cell.icon_color}`,
                        }
                      }}
                    >
                      <Box sx={{ fontSize: '10px', color: 'white', fontWeight: 'bold', pointerEvents: 'none', textAlign: 'center' }}>
                        {cell.name.split(' ')[0]}
                      </Box>
                    </Box>
                  </Tooltip>
                ) : (
                  <Box 
                    sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.5s',
                    }} 
                  />
                )}
              </Box>
            ))
          )}
        </Box>
      </Paper>
    </Box>
  );
}
