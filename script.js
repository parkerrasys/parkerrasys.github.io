document.addEventListener('DOMContentLoaded', () => {
	const cards = document.querySelectorAll('.project-card');
	const modeToggle = document.querySelector('.mode-toggle');
	const modeIcon = document.querySelector('.mode-icon');
	const modeText = document.querySelector('.mode-text');
	const circuitDecoration = document.getElementById('circuit-decoration');
	
	// Create custom cursor container
	const cursorContainer = document.createElement('div');
	cursorContainer.className = 'cursor-container';
	document.body.appendChild(cursorContainer);
	
	// Add custom cursor elements
	const customCursor = document.createElement('div');
	customCursor.className = 'custom-cursor';
	cursorContainer.appendChild(customCursor);
	
	const clickCursor = document.createElement('div');
	clickCursor.className = 'click-cursor';
	cursorContainer.appendChild(clickCursor);
	
	// Add trailing effect elements
	const trailsCount = 5;
	const trailElements = [];
	
	for (let i = 0; i < trailsCount; i++) {
		const trail = document.createElement('div');
		trail.className = 'cursor-trail';
		trail.style.opacity = 1 - (i / trailsCount) * 0.8;
		trail.style.width = `${18 - i * 2.5}px`;
		trail.style.height = `${18 - i * 2.5}px`;
		cursorContainer.appendChild(trail);
		trailElements.push({
			element: trail,
			x: 0,
			y: 0
		});
	}
	
	// Custom cursor styles - add these to your CSS
	const style = document.createElement('style');
	style.textContent = `
		body {
			cursor: none;
		}
		.cursor-container {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			pointer-events: none;
			z-index: 10000;
			overflow: hidden;
		}
		.custom-cursor {
			position: fixed;
			width: 20px;
			height: 20px;
			border: 2px solid var(--accent-color);
			border-radius: 50%;
			transform: translate(-50%, -50%);
			transition: width 0.2s, height 0.2s, background-color 0.2s, border-color 0.2s;
			z-index: 10002;
		}
		.click-cursor {
			position: fixed;
			width: 8px;
			height: 8px;
			background-color: var(--accent-color);
			border-radius: 50%;
			transform: translate(-50%, -50%);
			transition: transform 0.1s, background-color 0.2s;
			z-index: 10003;
		}
		.cursor-trail {
			position: fixed;
			border: 1px solid var(--accent-color);
			border-radius: 50%;
			transform: translate(-50%, -50%);
			transition: opacity 0.5s, border-color 0.2s;
			z-index: 10001;
		}
		.cursor-down .custom-cursor {
			width: 25px;
			height: 25px;
			background-color: var(--accent-color);
			opacity: 0.3;
		}
		.cursor-down .click-cursor {
			transform: translate(-50%, -50%) scale(1.2);
		}
		.cursor-down .cursor-trail {
			background-color: var(--accent-color);
			opacity: 0.1;
		}
		
		/* Button hover state for cursor */
		.button-hover .custom-cursor,
		.button-hover .cursor-trail {
			border-color: #ffffff;
		}
		.button-hover .click-cursor {
			background-color: #ffffff;
		}
	`;
	document.head.appendChild(style);
	
	// Mouse position tracking with minimal delay
	let mouseX = 0, mouseY = 0;
	let cursorX = 0, cursorY = 0;
	const trailPositions = Array(trailsCount).fill().map(() => ({ x: 0, y: 0 }));
	const smoothFactor = 0.5; // Higher = less delay
	const trailFactor = 0.4; // Trail follow factor increased for less delay
	
	// Update mouse position immediately on move
	document.addEventListener('mousemove', (e) => {
		mouseX = e.clientX;
		mouseY = e.clientY;
	});
	
	// Mouse down effect
	document.addEventListener('mousedown', () => {
		document.body.classList.add('cursor-down');
	});
	
	// Mouse up effect
	document.addEventListener('mouseup', () => {
		document.body.classList.remove('cursor-down');
	});
	
	// Hide cursor when leaving window
	document.addEventListener('mouseleave', () => {
		cursorContainer.style.display = 'none';
	});
	
	// Show cursor when entering window
	document.addEventListener('mouseenter', () => {
		cursorContainer.style.display = 'block';
	});
	
	// Animation frame for cursor movement
	function updateCursorPosition() {
		// Faster cursor movement with higher smoothFactor
		cursorX += (mouseX - cursorX) * smoothFactor;
		cursorY += (mouseY - cursorY) * smoothFactor;
		
		// Update main cursors
		customCursor.style.left = `${cursorX}px`;
		customCursor.style.top = `${cursorY}px`;
		clickCursor.style.left = `${cursorX}px`;
		clickCursor.style.top = `${cursorY}px`;
		
		// Update trail positions with less delay
		for (let i = 0; i < trailElements.length; i++) {
			// Previous position to follow (main cursor for first trail)
			const targetX = i === 0 ? cursorX : trailPositions[i - 1].x;
			const targetY = i === 0 ? cursorY : trailPositions[i - 1].y;
			
			// Faster follow with less delay for each element
			trailPositions[i].x += (targetX - trailPositions[i].x) * (trailFactor - i * 0.03);
			trailPositions[i].y += (targetY - trailPositions[i].y) * (trailFactor - i * 0.03);
			
			// Apply position
			trailElements[i].element.style.left = `${trailPositions[i].x}px`;
			trailElements[i].element.style.top = `${trailPositions[i].y}px`;
		}
		
		requestAnimationFrame(updateCursorPosition);
	}
	
	// Start cursor animation
	updateCursorPosition();
	
	// Change cursor color on interactive elements
	const interactiveElements = document.querySelectorAll('a, button, .mode-toggle');
	interactiveElements.forEach(element => {
		element.addEventListener('mouseenter', () => {
			document.body.classList.add('button-hover');
		});
		
		element.addEventListener('mouseleave', () => {
			document.body.classList.remove('button-hover');
		});
	});
	
	// Prevent text selection on double-click and drag
	document.addEventListener('mousedown', function(e) {
	  // Check if double click
	  if (e.detail > 1) {
		e.preventDefault();
	  }
	});
	
	// Prevent text selection globally when dragging
	document.body.style.userSelect = 'none';
	document.body.style.webkitUserSelect = 'none';
	document.body.style.msUserSelect = 'none';
	document.body.style.mozUserSelect = 'none';
	
	// Enable text selection for specific elements that need it
	const textElements = document.querySelectorAll('input, textarea, [contenteditable="true"]');
	textElements.forEach(el => {
	  el.style.userSelect = 'text';
	  el.style.webkitUserSelect = 'text';
	  el.style.msUserSelect = 'text';
	  el.style.mozUserSelect = 'text';
	});
	
	// Particles system - restored to original behavior
	const createParticlesSystem = () => {
	  circuitDecoration.innerHTML = '';
	  
	  const canvas = document.createElement('canvas');
	  canvas.style.position = 'fixed';
	  canvas.style.top = '0';
	  canvas.style.left = '0';
	  canvas.style.width = '100%';
	  canvas.style.height = '100%';
	  canvas.style.pointerEvents = 'none';
	  canvas.style.zIndex = '-2';
	  circuitDecoration.appendChild(canvas);
	  
	  const ctx = canvas.getContext('2d');
	  
	  // Make canvas full screen and handle resize
	  const resizeCanvas = () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	  };
	  
	  window.addEventListener('resize', resizeCanvas);
	  resizeCanvas();
	  
	  // Particle class - original behavior
	  class Particle {
		constructor(x = null, y = null, size = null) {
		  this.x = x !== null ? x : Math.random() * canvas.width;
		  this.y = y !== null ? y : Math.random() * canvas.height;
		  this.size = size !== null ? size : Math.random() * 3 + 2; // Larger size
		  this.baseSize = this.size;
		  this.speedX = (Math.random() - 0.5) * 0.8;
		  this.speedY = (Math.random() - 0.5) * 0.8;
		  this.opacity = Math.random() * 0.5 + 0.5; // Random initial opacity
		  this.fadeDirection = Math.random() > 0.5 ? 0.005 : -0.005; // Random fade direction
		}
		
		update(mouseDown, mouse) {
		  // Move particle
		  this.x += this.speedX;
		  this.y += this.speedY;
		  
		  // Bounce off edges
		  if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
		  if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
		  
		  // Periodic fade in/out effect
		  this.opacity += this.fadeDirection;
		  
		  // Change fade direction when limits reached
		  if (this.opacity <= 0.3 || this.opacity >= 1) {
			this.fadeDirection *= -1;
		  }
		  
		  // Mouse attraction when mouse button is down
		  if (mouseDown && mouse.x !== null && mouse.y !== null) {
			const dx = mouse.x - this.x;
			const dy = mouse.y - this.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			
			if (distance < mouse.radius) {
			  const attractionForce = 0.075;
			  this.x += (dx / distance) * attractionForce * (mouse.radius - distance) / 2;
			  this.y += (dy / distance) * attractionForce * (mouse.radius - distance) / 2;
			  
			  // Grow particles when being attracted
			  this.size = this.baseSize + ((mouse.radius - distance) / mouse.radius) * 3;
			} else {
			  // Return to base size
			  if (this.size > this.baseSize) {
				this.size -= 0.1;
			  }
			}
		  } else {
			// Return to base size
			if (this.size > this.baseSize) {
			  this.size -= 0.1;
			}
		  }
		}
		
		draw() {
		  // Get accent color from CSS variable
		  const accentColor = getComputedStyle(document.body).getPropertyValue('--accent-color');
		  ctx.fillStyle = accentColor;
		  ctx.globalAlpha = this.opacity;
		  ctx.beginPath();
		  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		  ctx.fill();
		  ctx.globalAlpha = 1;
		}
	  }
	  
	  // Mouse position and state
	  let mouse = {
		x: null,
		y: null,
		radius: 150,
		isDown: false
	  };
	  
	  window.addEventListener('mousemove', (e) => {
		mouse.x = e.x;
		mouse.y = e.y;
	  });
	  
	  window.addEventListener('mousedown', () => {
		mouse.isDown = true;
	  });
	  
	  window.addEventListener('mouseup', (e) => {
		if (mouse.isDown) {
		  // Create burst effect on mouse up
		  createBurst(e.x, e.y);
		}
		mouse.isDown = false;
	  });
	  
	  // Create burst effect
	  function createBurst(x, y) {
		// Count particles near the mouse
		let nearbyParticles = 0;
		particlesArray.forEach(p => {
		  const dx = p.x - x;
		  const dy = p.y - y;
		  const distance = Math.sqrt(dx * dx + dy * dy);
		  if (distance < mouse.radius) nearbyParticles++;
		});
		
		// Create new particles based on how many were attracted
		const newParticlesCount = Math.min(20, Math.max(5, nearbyParticles / 2));
		
		for (let i = 0; i < newParticlesCount; i++) {
		  const angle = Math.random() * Math.PI * 2;
		  const speed = Math.random() * 2 + 1;
		  const newParticle = new Particle(
			x, 
			y, 
			Math.random() * 3 + 2
		  );
		  
		  // Set speed direction outward from burst point
		  newParticle.speedX = Math.cos(angle) * speed;
		  newParticle.speedY = Math.sin(angle) * speed;
		  
		  particlesArray.push(newParticle);
		}
		
		// Limit max particles
		if (particlesArray.length > maxParticles) {
		  particlesArray.splice(0, particlesArray.length - maxParticles);
		}
	  }
	  
	  // Create particles
	  const particlesArray = [];
	  const particleCount = Math.min(80, Math.floor(window.innerWidth * window.innerHeight / 12000));
	  const maxParticles = particleCount * 1.5;
	  
	  for (let i = 0; i < particleCount; i++) {
		particlesArray.push(new Particle());
	  }
	  
	  // Randomly replace particles
	  setInterval(() => {
		if (particlesArray.length > 10) {
		  const index = Math.floor(Math.random() * particlesArray.length);
		  particlesArray.splice(index, 1);
		  particlesArray.push(new Particle());
		}
	  }, 2000);
	  
	  // Animation function
	  function animate() {
		requestAnimationFrame(animate);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		for (let i = 0; i < particlesArray.length; i++) {
		  particlesArray[i].update(mouse.isDown, mouse);
		  particlesArray[i].draw();
		  
		  // Check for connections between particles
		  for (let j = i + 1; j < particlesArray.length; j++) {
			const dx = particlesArray[i].x - particlesArray[j].x;
			const dy = particlesArray[i].y - particlesArray[j].y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			const maxDistance = 120; // Increased connection distance
			
			if (distance < maxDistance) {
			  // Calculate opacity based on distance
			  const opacity = 1 - (distance / maxDistance);
			  const accentColor = getComputedStyle(document.body).getPropertyValue('--accent-color');
			  
			  // Get RGB values from hex color
			  let r, g, b;
			  if (accentColor.startsWith('#')) {
				r = parseInt(accentColor.slice(1, 3), 16);
				g = parseInt(accentColor.slice(3, 5), 16);
				b = parseInt(accentColor.slice(5, 7), 16);
			  } else {
				// Default values if there's an issue parsing
				r = 45; g = 212; b = 191;
			  }
			  
			  ctx.beginPath();
			  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.8})`;
			  ctx.lineWidth = 1.2;
			  ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
			  ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
			  ctx.stroke();
			}
		  }
		  
		  // Mouse repulsion when not holding down
		  if (!mouse.isDown && mouse.x !== null && mouse.y !== null) {
			const dx = particlesArray[i].x - mouse.x;
			const dy = particlesArray[i].y - mouse.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			
			if (distance < mouse.radius) {
			  const forceDirectionX = dx / distance;
			  const forceDirectionY = dy / distance;
			  const force = (mouse.radius - distance) / mouse.radius;
			  
			  particlesArray[i].x += forceDirectionX * force * 1.5;
			  particlesArray[i].y += forceDirectionY * force * 1.5;
			}
		  }
		}
		
		// Draw attraction radius when mouse is down
		if (mouse.isDown && mouse.x !== null && mouse.y !== null) {
		  ctx.beginPath();
		  ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
		  ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent-color') + '40';
		  ctx.stroke();
		}
	  }
	  
	  animate();
	};
	
	// Initialize particles system
	createParticlesSystem();
	

	
	// Dark/Light mode toggle
	modeToggle.addEventListener('click', () => {
	  document.body.classList.toggle('light-mode');
	  
	  if (document.body.classList.contains('light-mode')) {
		modeIcon.textContent = '🌙';
		modeText.textContent = 'Dark Mode';
	  } else {
		modeIcon.textContent = '☀️';
		modeText.textContent = 'Light Mode';
	  }
	});
	
	// Smooth scrolling for anchor links
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	  anchor.addEventListener('click', function(e) {
		e.preventDefault();
		
		const targetId = this.getAttribute('href');
		const targetElement = document.querySelector(targetId);
		
		if (targetElement) {
		  const headerHeight = document.querySelector('header').offsetHeight;
		  const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
		  
		  window.scrollTo({
			top: targetPosition,
			behavior: 'smooth'
		  });
		}
	  });
	});
  });
  
  document.addEventListener('contextmenu', function(event) {
	event.preventDefault();
	return false;
  }, true);


  