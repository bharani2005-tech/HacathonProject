
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { MapPin, Zap, Shield, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const HomePage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Three.js setup for 3D spinning location pin
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });

    renderer.setSize(300, 300);
    renderer.setClearColor(0x000000, 0);

    // Create pin geometry
    const pinShape = new THREE.Shape();
    pinShape.moveTo(0, 0);
    pinShape.bezierCurveTo(0, -0.5, -0.5, -0.5, -0.5, -1);
    pinShape.bezierCurveTo(-0.5, -1.5, 0, -2, 0, -3);
    pinShape.bezierCurveTo(0, -2, 0.5, -1.5, 0.5, -1);
    pinShape.bezierCurveTo(0.5, -0.5, 0, -0.5, 0, 0);

    const extrudeSettings = {
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 3,
    };

    const geometry = new THREE.ExtrudeGeometry(pinShape, extrudeSettings);
    const material = new THREE.MeshPhongMaterial({
      color: 0x34EDF3,
      emissive: 0x34EDF3,
      emissiveIntensity: 0.5,
      shininess: 100,
    });

    const pin = new THREE.Mesh(geometry, material);
    scene.add(pin);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x34EDF3, 1);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xF715AB, 1);
    pointLight2.position.set(-5, 5, -5);
    scene.add(pointLight2);

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      pin.rotation.y += 0.01;
      pin.rotation.x = Math.sin(Date.now() * 0.001) * 0.2;
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Real-Time Tracking',
      description: 'Track locations with pinpoint accuracy using GPS technology',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure Login',
      description: 'Your data is protected with industry-standard encryption',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Interactive 3D Maps',
      description: 'Visualize locations in stunning 3D with smooth animations',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Updates',
      description: 'Get live location updates as they happen in real-time',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MapPin className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold gradient-text">TRACK BUDDY</h1>
          </div>
          <Button
            onClick={() => navigate('/auth')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-cyan transition-all duration-300 hover:scale-105"
          >
            Login / Sign Up
          </Button>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="flex flex-col items-center space-y-8 fade-in-up">
            {/* 3D Canvas */}
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="w-[300px] h-[300px] float-animation"
              />
              <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent rounded-full blur-2xl"></div>
            </div>

            <div className="max-w-3xl space-y-6">
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                Track Locations in
                <span className="gradient-text"> Real-Time</span>
                <br />
                with Style
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Experience the future of location tracking with our cutting-edge 3D interface.
                Powered by advanced GPS technology and stunning visualizations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  onClick={() => navigate('/tracking')}
                  size="lg"
                  className="bg-gradient-primary text-white hover:opacity-90 shadow-glow-cyan transition-all duration-300 hover:scale-105 text-lg px-8 py-6"
                >
                  Start Tracking Now
                </Button>
                <Button
                  onClick={() => navigate('/auth')}
                  size="lg"
                  variant="outline"
                  className="border-primary/50 text-foreground hover:bg-primary/10 transition-all duration-300 hover:scale-105 text-lg px-8 py-6"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <h3 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Powerful <span className="gradient-text">Features</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="glass p-6 hover:shadow-card transition-all duration-300 hover:scale-105 hover:-translate-y-2 group cursor-pointer border-border/30"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="text-primary group-hover:text-secondary transition-colors duration-300 group-hover:scale-110 transform">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-semibold">{feature.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 mb-16">
          <Card className="glass p-12 text-center border-primary/30 shadow-glow-cyan">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to <span className="gradient-text">Get Started</span>?
            </h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust Live Tracker 3D for their location tracking needs.
              Start your journey today!
            </p>
            <Button
              onClick={() => navigate('/tracking')}
              size="lg"
              className="bg-gradient-secondary text-white hover:opacity-90 shadow-glow-magenta transition-all duration-300 hover:scale-105 text-lg px-8 py-6"
            >
              Launch Tracker
            </Button>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
