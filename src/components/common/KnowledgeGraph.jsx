import { useEffect, useRef } from "react";

export default function KnowledgeGraph() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const mouse = {
      x: null,
      y: null,
      radius: 150,
    };

    const nodes = [];

    class Node {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;

        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;

        this.radius = Math.random() * 2 + 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x && mouse.y) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;

          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            this.x += dx * 0.01;
            this.y += dy * 0.01;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        ctx.fillStyle = "#D9B85E";
        ctx.fill();
      }
    }

    function createNodes() {
      nodes.length = 0;

      for (let i = 0; i < 220; i++) {
        nodes.push(new Node());
      }
    }

    function connectNodes() {
      for (let a = 0; a < nodes.length; a++) {
        for (let b = a; b < nodes.length; b++) {
          const dx = nodes[a].x - nodes[b].x;
          const dy = nodes[a].y - nodes[b].y;

          const distance = dx * dx + dy * dy;

          if (distance < 25000) {
            ctx.beginPath();

            
            ctx.strokeStyle = `rgba(217,184,94,${
              1 - distance / 18000
            })`;

            ctx.lineWidth = 0.6;

            ctx.moveTo(nodes[a].x, nodes[a].y);
            ctx.lineTo(nodes[b].x, nodes[b].y);

            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      connectNodes();

      nodes.forEach((node) => {
        node.update();
        node.draw();
      });

      requestAnimationFrame(animate);
    }

    createNodes();
    animate();

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width;
      canvas.height = height;

      createNodes();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
    />
  );
}