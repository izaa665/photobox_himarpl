import React, { useEffect, useRef } from 'react';

// Bentuk blok Tetris & warnanya
const SHAPES = [
  { matrix: [[1, 1, 1, 1]], color: '#00f0f0' }, // I (Cyan)
  { matrix: [[1, 1], [1, 1]], color: '#f0f000' }, // O (Kuning)
  { matrix: [[0, 1, 0], [1, 1, 1]], color: '#a000f0' }, // T (Ungu)
  { matrix: [[0, 1, 1], [1, 1, 0]], color: '#00f000' }, // S (Hijau)
  { matrix: [[1, 1, 0], [0, 1, 1]], color: '#f00000' }, // Z (Merah)
  { matrix: [[1, 0, 0], [1, 1, 1]], color: '#0000f0' }, // J (Biru)
  { matrix: [[0, 0, 1], [1, 1, 1]], color: '#f0a000' }, // L (Oranye)
];

const TetrisBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const blockSize = 24; // Ukuran 1 kotak piksel
    const pieceCount = 15; // Jumlah blok yang melayang bersamaan

    // Membuat objek blok acak
    const createPiece = () => {
      const type = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      return {
        ...type,
        x: Math.floor(Math.random() * (canvas.width / blockSize)) * blockSize,
        y: -100 - Math.random() * 500,
        speed: 1 + Math.random() * 1.5, // Kecepatan jatuh
        opacity: 0.6 + Math.random() * 0.4, // Transparansi dipertebal (0.6 - 1.0)
      };
    };

    const pieces = Array.from({ length: pieceCount }, createPiece);

    // Fungsi menggambar 1 kotak bergaya 8-bit (bertekstur/emboss)
    const drawPixelBlock = (x, y, color, opacity) => {
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, blockSize, blockSize);

      // Garis highlight putih tipis di atas & kiri (efek 3D retro)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(x, y, blockSize, 3);
      ctx.fillRect(x, y, 3, blockSize);

      // Garis bayangan hitam di bawah & kanan
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(x, y + blockSize - 3, blockSize, 3);
      ctx.fillRect(x + blockSize - 3, y, 3, blockSize);
      ctx.globalAlpha = 1.0;
    };

    // Loop animasi
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pieces.forEach((piece) => {
        // Gambar tiap kotak dalam bentuk Tetromino
        piece.matrix.forEach((row, rIdx) => {
          row.forEach((cell, cIdx) => {
            if (cell) {
              const drawX = piece.x + cIdx * blockSize;
              const drawY = piece.y + rIdx * blockSize;
              drawPixelBlock(drawX, drawY, piece.color, piece.opacity);
            }
          });
        });

        // Gerakkan blok ke bawah
        piece.y += piece.speed;

        // Reset blok jika sudah lewat dari bawah layar
        if (piece.y > canvas.height + 100) {
          Object.assign(piece, createPiece());
          piece.y = -50;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

export default TetrisBackground;
