import React, { useState, useRef, useEffect } from "react";

export default function ImageResizer({ image, onCancel, onSave, initialScale = 1, initialPosition = { x: 0, y: 0 } }) {
  const [scale, setScale] = useState(initialScale);
  const [position, setPosition] = useState(initialPosition);
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 220 });

  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.clientWidth;
      setContainerSize({ width, height: 220 });
    }
  }, []);

  useEffect(() => {
    setScale(initialScale);
    setPosition(initialPosition);
  }, [image, initialScale, initialPosition]);

  const handleScaleChange = (e) => {
    const newScale = parseFloat(e.target.value);
    setScale(newScale);
  };

  const handlePositionChange = (e) => {
    const { name, value } = e.target;
    setPosition(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleDrag = (e) => {
    if (e.type === 'mousedown') {
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const startPos = { ...position };

      const handleMouseMove = (moveEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;
        setPosition({
          x: startPos.x + deltaX,
          y: startPos.y + deltaY
        });
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  const handleSave = () => {
    const canvas = document.createElement('canvas');
    canvas.width = containerSize.width;
    canvas.height = containerSize.height;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image;
    
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const scaledWidth = img.naturalWidth * scale;
      const scaledHeight = img.naturalHeight * scale;

      ctx.drawImage(
        img,
        0, 0, img.naturalWidth, img.naturalHeight, 
        position.x, position.y, scaledWidth, scaledHeight
      );

      canvas.toBlob((blob) => {
        if (blob) {
          onSave(blob, { scale, position });
        }
      }, 'image/jpeg', 0.9);
    };

    img.onerror = () => {
      console.error('Failed to load image');
    };
  };

  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
    setScale(1);
  };

  const centerImage = () => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const scaledWidth = img.naturalWidth * scale;
      const scaledHeight = img.naturalHeight * scale;
      
      setPosition({
        x: (containerSize.width - scaledWidth) / 2,
        y: (containerSize.height - scaledHeight) / 2
      });
    };
  };

  const getVisibleArea = () => {
    if (!imageRef.current) return { visible: false };
    
    const img = imageRef.current;
    const scaledWidth = img.naturalWidth * scale;
    const scaledHeight = img.naturalHeight * scale;
    
    const visibleWidth = Math.min(scaledWidth, containerSize.width - position.x);
    const visibleHeight = Math.min(scaledHeight, containerSize.height - position.y);
    
    return {
      visible: position.x <= 0 && position.y <= 0 && 
               position.x + scaledWidth >= containerSize.width && 
               position.y + scaledHeight >= containerSize.height,
      visibleWidth: Math.max(0, visibleWidth),
      visibleHeight: Math.max(0, visibleHeight)
    };
  };

  const visibleArea = getVisibleArea();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-xl w-[90%] max-w-4xl">
        <h3 className="text-lg font-semibold mb-2">Resize and Position Image</h3>
        <p className="text-sm text-gray-600 mb-2">
          Adjust the image size and position. The image will be displayed at full width and 220px height in the preview.
          {!visibleArea.visible && (
            <span className="text-orange-600 block mt-1">
              ⚠️ Some areas might be cut off in the final preview
            </span>
          )}
        </p>

        <div 
          ref={containerRef}
          className="relative w-full h-[220px] bg-gray-100 border-2 border-dashed border-gray-400 rounded-lg overflow-hidden mb-4"
        >
          <img
            ref={imageRef}
            src={image}
            alt="Resize preview"
            className="absolute cursor-move"
            style={{
              transform: `scale(${scale})`,
              left: position.x,
              top: position.y,
              transformOrigin: 'top left'
            }}
            onMouseDown={handleDrag}
          />
          
          <div className="absolute inset-0 border-2 border-red-500 pointer-events-none opacity-70"></div>
        </div>

        <div className="text-sm text-gray-600 mb-4 p-2 bg-gray-50 rounded">
          <p>💡 <strong>Tip:</strong> Make sure the important parts of your image are within the red border area</p>
          <p>🔄 Drag the image to reposition, use sliders for fine adjustments</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Zoom Scale: {scale.toFixed(2)}x
            </label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={scale}
              onChange={handleScaleChange}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Horizontal Position: {position.x}px
              </label>
              <input
                type="range"
                min={-1000}
                max={1000}
                value={position.x}
                onChange={handlePositionChange}
                name="x"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Vertical Position: {position.y}px
              </label>
              <input
                type="range"
                min={-1000}
                max={1000}
                value={position.y}
                onChange={handlePositionChange}
                name="y"
                className="w-full"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={centerImage}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
            >
              Center Image
            </button>
            <button
              type="button"
              onClick={resetPosition}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <button 
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            type="button"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}