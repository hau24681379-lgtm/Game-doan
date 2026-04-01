import React, { useRef, useEffect, useState } from 'react';
import { Box, Paper, Button, Stack, Slider, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function FreeDraw({ gameState, setGameState, onWin }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#fff');
  const [lineWidth, setLineWidth] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Load state if exists
    if (gameState.image) {
      const img = new Image();
      img.src = gameState.image;
      img.onload = () => ctx.drawImage(img, 0, 0);
    }
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  const saveState = () => {
    const image = canvasRef.current.toDataURL();
    setGameState({ image });
    onWin(1); // Small points for drawing
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        {['#fff', '#f44336', '#4caf50', '#2196f3', '#ffeb3b'].map(c => (
          <Box
            key={c}
            onClick={() => setColor(c)}
            sx={{
              width: 30, height: 30, bgcolor: c, borderRadius: '50%',
              cursor: 'pointer', border: color === c ? '3px solid #777' : '1px solid #333'
            }}
          />
        ))}
        <Button variant="outlined" startIcon={<DeleteIcon />} onClick={clear}>Xóa</Button>
      </Stack>
      
      <Box sx={{ width: 300 }}>
        <Typography>Độ dày cọ: {lineWidth}</Typography>
        <Slider value={lineWidth} min={1} max={20} onChange={(e, val) => setLineWidth(val)} />
      </Box>

      <Paper elevation={0} variant="outlined" sx={{ bgcolor: '#000', cursor: 'crosshair', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          width={500}
          height={400}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </Paper>
    </Box>
  );
}
