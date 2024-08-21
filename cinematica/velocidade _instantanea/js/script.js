document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    let theme = 'light';
    let sliderValue = 50;
    const controlHeight = 50;

    function resizeCanvas() {
        canvas.width = window.innerWidth * 0.9;
        canvas.height = window.innerHeight * 0.7;
        draw();
    }

    function toggleTheme() {
        theme = theme === 'light' ? 'dark' : 'light';
        document.body.className = theme;
        draw();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawAxes();
        drawFunction();
        drawControls();
        drawCircle();
    }

    function drawAxes() {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - controlHeight);
        ctx.lineTo(canvas.width, canvas.height - controlHeight);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, canvas.height - controlHeight);
        ctx.stroke();

        // Draw tick marks
        const tickSpacing = 50;
        ctx.font = '10px Arial';
        for (let x = tickSpacing; x < canvas.width; x += tickSpacing) {
            ctx.moveTo(x, canvas.height - controlHeight - 5);
            ctx.lineTo(x, canvas.height - controlHeight + 5);
            ctx.stroke();
            ctx.fillText((x / 10).toFixed(1), x - 10, canvas.height - controlHeight + 20);
        }
        for (let y = tickSpacing; y < canvas.height - controlHeight; y += tickSpacing) {
            ctx.moveTo(-5, canvas.height - controlHeight - y);
            ctx.lineTo(5, canvas.height - controlHeight - y);
            ctx.stroke();
            ctx.fillText((y / 10).toFixed(1), 10, canvas.height - controlHeight - y + 5);
        }
    }

    function drawFunction() {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - controlHeight); // Start at (0,0)
        for (let x = 0; x < canvas.width; x++) {
            const y = 0.5 * x + 20 * Math.sin(x / 50); // Linear function with irregular ups and downs
            ctx.lineTo(x, canvas.height - controlHeight - y);
        }
        ctx.stroke();
    }

    function drawControls() {
        const controlY = canvas.height - controlHeight;

        // Draw control background
        ctx.fillStyle = theme === 'light' ? '#ddd' : '#333';
        ctx.fillRect(0, controlY, canvas.width, controlHeight);

        // Draw slider
        const sliderX = (sliderValue / 100) * canvas.width;
        ctx.fillStyle = '#888';
        ctx.fillRect(sliderX - 5, controlY + 10, 10, 30);

        // Draw toggle theme button
        ctx.beginPath();
        ctx.arc(canvas.width - 30, controlY + 25, 15, 0, 2 * Math.PI);
        ctx.fillStyle = '#ff0';
        ctx.fill();
        ctx.fillStyle = theme === 'light' ? '#000' : '#fff';
        ctx.fillText('🌙', canvas.width - 37, controlY + 30);

        // Add event listener for dragging
        canvas.addEventListener('mousedown', onMouseDown);
    }

    function drawCircle() {
        const sliderX = (sliderValue / 100) * canvas.width;
        const circleY = canvas.height - controlHeight - (0.5 * sliderX + 20 * Math.sin(sliderX / 50));

        // Draw circle
        ctx.beginPath();
        ctx.arc(sliderX, circleY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = theme === 'light' ? '#000' : '#fff';
        ctx.fill();
    }

    function onMouseDown(event) {
        const controlY = canvas.height - controlHeight;
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (mouseY > controlY && mouseY < canvas.height) {
            // Mouse is within control region
            if (mouseX > canvas.width - 45 && mouseX < canvas.width - 15) {
                toggleTheme();
            } else {
                const sliderPosition = Math.max(0, Math.min(100, (mouseX / canvas.width) * 100));
                sliderValue = sliderPosition;
                draw();
            }

            // Add event listeners for dragging
            canvas.addEventListener('mousemove', onMouseMove);
            canvas.addEventListener('mouseup', onMouseUp);
            canvas.addEventListener('mouseleave', onMouseUp);
        }
    }

    function onMouseMove(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;

        const sliderPosition = Math.max(0, Math.min(100, (mouseX / canvas.width) * 100));
        sliderValue = sliderPosition;
        draw();
    }

    function onMouseUp() {
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mouseup', onMouseUp);
        canvas.removeEventListener('mouseleave', onMouseUp);
    }

    window.addEventListener('resize', resizeCanvas);

    resizeCanvas();
});