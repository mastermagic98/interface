(function () {
  'use strict';

  Lampa.Platform.tv();

  const config = {
    flakeCount: 150,
    minSpeed: 0.3,
    maxSpeed: 2.0,
    minRadius: 1,
    maxRadius: 4,
    minOpacity: 0.4,
    maxOpacity: 0.9,
    windStrength: 0.8,
    windChange: 0.0005
  };

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  const snowflakes = [];
  let animationId = null;
  let windDirection = 0;
  let windTarget = 0;

  function resizeCanvas() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.scale(dpr, dpr);
  }
  resizeCanvas();

  function seededRandom(seed) {
    return function () {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }

  function createSnowflake() {
    const seed = Math.random() * 1000000;
    const rnd = seededRandom(seed);
    const branches = Math.floor(rnd() * 3) + 2;
    const complexity = rnd() * 0.5 + 0.3;

    const branchData = [];
    for (let i = 1; i <= branches; i++) {
      branchData.push({
        position: i / (branches + 1),
        length: 0.3 + rnd() * 0.2,
        leftAngle: -Math.PI / 3 + (rnd() - 0.5) * 0.3,
        rightAngle: Math.PI / 3 + (rnd() - 0.5) * 0.3,
        hasSideBranches: i > 1 && rnd() > 0.5
      });
    }

    return {
      x: rnd() * canvas.width / dpr,
      y: rnd() * canvas.height / dpr,
      radius: rnd() * (config.maxRadius - config.minRadius) + config.minRadius,
      speed: rnd() * (config.maxSpeed - config.minSpeed) + config.minSpeed,
      opacity: rnd() * (config.maxOpacity - config.minOpacity) + config.minOpacity,
      drift: (rnd() - 0.5) * config.windStrength,
      angle: rnd() * Math.PI * 2,
      rotation: rnd() * Math.PI * 2,
      rotationSpeed: (rnd() - 0.5) * 0.02,
      type: Math.floor(rnd() * 5),
      branches: branches,
      complexity: complexity,
      branchData: branchData
    };
  }

  function createSnowflakes() {
    snowflakes.length = 0;
    for (let i = 0; i < config.flakeCount; i++) {
      snowflakes.push(createSnowflake());
    }
  }
  createSnowflakes();

  function drawSnowflake(flake) {
    ctx.save();
    ctx.globalAlpha = flake.opacity;
    ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = Math.max(0.5, flake.radius * 0.15);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.translate(flake.x, flake.y);
    ctx.rotate(flake.rotation);

    const r = flake.radius;
    const sixFold = Math.PI / 3;

    for (let arm = 0; arm < 6; arm++) {
      ctx.save();
      ctx.rotate(arm * sixFold);
      drawSnowflakeArm(ctx, r, flake);
      ctx.restore();
    }

    ctx.beginPath();
    const centerSize = r * 0.15;
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = Math.cos(angle) * centerSize;
      const y = Math.sin(angle) * centerSize;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  function drawSnowflakeArm(ctx, radius, flake) {
    const armLength = radius;
    const branchData = flake.branchData;
    const complexity = flake.complexity;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, armLength);
    ctx.stroke();

    branchData.forEach((branch, index) => {
      const branchPos = branch.position * armLength;
      const branchLength = radius * branch.length * complexity;
      const leftAngle = branch.leftAngle;
      const rightAngle = branch.rightAngle;

      ctx.beginPath();
      ctx.moveTo(0, branchPos);
      ctx.lineTo(
        Math.sin(leftAngle) * branchLength,
        branchPos + Math.cos(leftAngle) * branchLength
      );
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, branchPos);
      ctx.lineTo(
        Math.sin(rightAngle) * branchLength,
        branchPos + Math.cos(rightAngle) * branchLength
      );
      ctx.stroke();

      if (branch.hasSideBranches) {
        const sideBranchPos = branchPos + branchLength * 0.6;
        const sideBranchLength = branchLength * 0.4;

        ctx.beginPath();
        ctx.moveTo(
          Math.sin(leftAngle) * branchLength * 0.6,
          branchPos + Math.cos(leftAngle) * branchLength * 0.6
        );
        ctx.lineTo(
          Math.sin(leftAngle - Math.PI / 4) * sideBranchLength,
          sideBranchPos + Math.cos(leftAngle - Math.PI / 4) * sideBranchLength
        );
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(
          Math.sin(rightAngle) * branchLength * 0.6,
          branchPos + Math.cos(rightAngle) * branchLength * 0.6
        );
        ctx.lineTo(
          Math.sin(rightAngle + Math.PI / 4) * sideBranchLength,
          sideBranchPos + Math.cos(rightAngle + Math.PI / 4) * sideBranchLength
        );
        ctx.stroke();
      }
    });

    if (flake.type > 2) {
      branchData.forEach(branch => {
        const dotPos = branch.position * armLength;
        ctx.beginPath();
        ctx.arc(0, dotPos, radius * 0.08, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  function updateWind() {
    windTarget += (Math.random() - 0.5) * 0.1;
    windTarget = Math.max(-1, Math.min(1, windTarget));
    windDirection += (windTarget - windDirection) * 0.05;
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    updateWind();

    snowflakes.forEach(flake => {
      drawSnowflake(flake);

      flake.y += flake.speed;
      flake.x += flake.drift + Math.sin(flake.angle) * 0.3 + windDirection * 0.5;
      flake.angle += 0.01;
      flake.rotation += flake.rotationSpeed;

      // Wrap around screen
      if (flake.y > canvas.height / dpr + flake.radius) {
        flake.y = -flake.radius;
        flake.x = Math.random() * canvas.width / dpr;
      }
      if (flake.x < -flake.radius) {
        flake.x = canvas.width / dpr + flake.radius;
      } else if (flake.x > canvas.width / dpr + flake.radius) {
        flake.x = -flake.radius;
      }
    });

    animationId = requestAnimationFrame(animate);
  }

  function start() {
    if (!animationId) {
      animate();
    }
  }

  function stop() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  function cleanup() {
    stop();
    if (canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
    window.removeEventListener('resize', handleResize);
  }

  function handleResize() {
    resizeCanvas();
    snowflakes.forEach(flake => {
      if (flake.x > canvas.width / dpr) {
        flake.x = Math.random() * canvas.width / dpr;
      }
      if (flake.y > canvas.height / dpr) {
        flake.y = Math.random() * canvas.height / dpr;
      }
    });
  }

  window.addEventListener('resize', handleResize);
  canvas.addEventListener('click', cleanup);

  start();

  window.addEventListener('beforeunload', cleanup);
})();
