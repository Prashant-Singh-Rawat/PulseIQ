import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import useHealthStore from '../store/healthStore';

// ─── ANATOMICAL VERTEX DEFORMATION ENGINE ─────────────────────────────────
// Math-based organic distortion to warp a sphere into a real human heart shape
const AnatomicalVentricleGeometry = () => {
    const geoRef = useRef();

    useEffect(() => {
        if (!geoRef.current) return;
        
        const posAttribute = geoRef.current.attributes.position;
        const v = new THREE.Vector3();
        
        for (let i = 0; i < posAttribute.count; i++) {
            v.fromBufferAttribute(posAttribute, i);
            
            // 1. Core Shape Tapering (Pinch top, bulge bottom)
            const yNorm = v.y / 1.6; 
            
            if (v.y > 0) {
                // Squeeze upper region (Atria base)
                v.x *= (1 - v.y * 0.25);
                v.z *= (1 - v.y * 0.25);
            } else {
                // Expand lower region (Ventricles)
                v.x *= (1 + Math.abs(v.y) * 0.1);
                v.z *= (1 + Math.abs(v.y) * 0.1);
                
                // Form the Apex (Heart leans downward and left)
                v.x += Math.pow(Math.abs(yNorm), 2) * 0.6; 
                v.z += Math.pow(Math.abs(yNorm), 2) * 0.2;
            }
            
            // 2. Anatomical Indentations & Asymmetry
            // Interventricular sulcus (crease down the front)
            if (v.z > 0 && v.x > -0.5 && v.x < 0.5) {
                const crease = Math.sin(v.x * Math.PI) * Math.cos(v.y * 1.5) * 0.15;
                v.z -= Math.max(0, crease);
            }

            // 3. Organic Surface Noise
            const noiseX = Math.sin(v.x * 6 + v.y * 4) * 0.03;
            const noiseY = Math.cos(v.y * 5 + v.z * 4) * 0.04;
            const noiseZ = Math.sin(v.z * 6 + v.x * 5) * 0.03;
            
            v.x += noiseX;
            v.y += noiseY;
            v.z += noiseZ;

            posAttribute.setXYZ(i, v.x, v.y, v.z);
        }
        
        geoRef.current.computeVertexNormals();
        geoRef.current.attributes.position.needsUpdate = true;
    }, []);

    return <sphereGeometry ref={geoRef} args={[1.5, 128, 128]} />;
};

// ─── PROCEDURAL BIOLOGICAL HEART ───────────────────────────────────────────
const CodeBiologicalHeart = () => {
    const groupRef = useRef();
    
    const bpm = useHealthStore(state => state.bpm);
    const bp = useHealthStore(state => state.bp);
    const stress = useHealthStore(state => state.stress);

    // Exact material specified by user requirements
    const tissueMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#820b0b'),       // Deep, natural blood red
        roughness: 0.75,                          // Highly rough organic tissue
        metalness: 0.05,                          // Minimal metallic bounce
        clearcoat: 0.05,                          // Almost removed clearcoat to kill white hot-spots
        emissive: new THREE.Color('#2a0000'),    // Subtle inner glow
        emissiveIntensity: 0.1,                   // Dynamically bound below
    });

    const vesselsMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#6B0000'), 
        roughness: 0.8, 
        clearcoat: 0.05,
    });
    
    const veinMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#2b1030'), 
        roughness: 0.8,
        clearcoat: 0.05,
    });

    useFrame((state) => {
        if (!groupRef.current) return;
        const time = state.clock.getElapsedTime();

        // 1. Requested Non-Linear Exact Pulse Formula
        const bps = bpm / 60;
        const bpmFactor = bps * Math.PI * 2;
        
        // Exact scale formula requested
        // Math.pow(...) creates the sharp biological snap
        // We modify it slightly to get the "lub-dub" double beat
        const baseBeat = Math.pow(Math.sin((time * bpmFactor) / 2), 16); 
        const secBeat = Math.pow(Math.sin((time * bpmFactor) / 2 - 0.25), 8) * 0.5;
        const combinedBeat = baseBeat + secBeat;

        // Apply scale pulse
        const uniformScale = 1 + combinedBeat * 0.05;
        
        // Add biological torsional contraction (Slight twist on beat)
        const twistX = 1 - combinedBeat * 0.03; 
        const squeezeY = 1 + combinedBeat * 0.06;
        const twistZ = uniformScale;
        
        groupRef.current.scale.set(twistX, squeezeY, twistZ);

        // 2. Breathing Movement & Rotation
        groupRef.current.position.y = Math.sin(time * 0.5) * 0.04;
        groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.02 + (combinedBeat * 0.015);
        groupRef.current.rotation.x = Math.sin(time * 0.4) * 0.01 - (combinedBeat * 0.01);

        // 3. Stress & Irregularity Jitter
        if (stress > 6) {
            const jitterAmount = (stress / 10) * 0.01;
            groupRef.current.position.x = (Math.random() - 0.5) * jitterAmount;
            groupRef.current.position.z = (Math.random() - 0.5) * jitterAmount;
        }

        // 4. BP Emissive Target
        tissueMaterial.emissiveIntensity = THREE.MathUtils.lerp(
            tissueMaterial.emissiveIntensity,
            0.05 + (combinedBeat * 0.2) + Math.max(0, (bp - 120) / 100),
            0.1
        );
    });

    return (
        <group ref={groupRef} position={[0, -0.2, 0]}>
            
            {/* MAIN ANATOMICAL VENTRICLES */}
            <mesh material={tissueMaterial} castShadow receiveShadow position={[0, -0.4, 0]}>
                <AnatomicalVentricleGeometry />
            </mesh>

            {/* AORTA (Ascending Arch) */}
            <group position={[0.3, 1.2, 0.1]} rotation={[0, 0, -0.2]}>
                <mesh material={vesselsMaterial} castShadow receiveShadow>
                    <cylinderGeometry args={[0.35, 0.4, 1.2, 32]} />
                </mesh>
                <mesh material={vesselsMaterial} castShadow receiveShadow position={[-0.2, 0.6, 0]} rotation={[0, 0, 0.6]}>
                    <cylinderGeometry args={[0.3, 0.35, 0.6, 32]} />
                </mesh>
            </group>

            {/* PULMONARY ARTERY */}
            <mesh material={veinMaterial} castShadow receiveShadow position={[-0.3, 1.0, 0.5]} rotation={[0.4, 0, 0.3]}>
                <cylinderGeometry args={[0.3, 0.4, 1.1, 32]} />
            </mesh>

            {/* SUPERIOR VENA CAVA */}
            <mesh material={veinMaterial} castShadow receiveShadow position={[0.7, 0.9, -0.3]} rotation={[-0.1, 0, 0.1]}>
                <cylinderGeometry args={[0.25, 0.3, 1.0, 32]} />
            </mesh>
            
            {/* RIGHT ATRIUM BULGE */}
            <mesh material={tissueMaterial} castShadow receiveShadow position={[0.9, 0.4, 0]} scale={[0.7, 0.9, 0.6]}>
                <sphereGeometry args={[0.7, 64, 64]} />
            </mesh>

            {/* LEFT ATRIUM BULGE */}
            <mesh material={tissueMaterial} castShadow receiveShadow position={[-0.8, 0.3, -0.2]} scale={[0.6, 0.8, 0.5]}>
                <sphereGeometry args={[0.6, 64, 64]} />
            </mesh>

        </group>
    );
};

// ─── MEDICAL CINEMATIC LIGHTING ────────────────────────────────────────────
const RealisticHeartScene = () => {
    return (
        <>
            <ambientLight intensity={1.2} color="#ffebe6" />
            
            {/* Main Key Light - Very Soft, Side Angle */}
            <directionalLight position={[6, 4, 4]} intensity={1.0} color="#ffdfd8" castShadow />
            
            {/* Fill Light */}
            <directionalLight position={[-6, 2, 4]} intensity={0.6} color="#ff9999" />
            
            {/* Cinematic Rim Light (Edge Highlight) - Pushed further back */}
            <directionalLight position={[0, 2, -10]} intensity={1.5} color="#aaddff" />
            
            {/* Core Red Subsurface Glow */}
            <pointLight position={[0, 0, 3]} intensity={0.5} color="#ff3333" distance={5} />
            
            <Float speed={0.5} rotationIntensity={0.02} floatIntensity={0.05}>
                 <CodeBiologicalHeart />
            </Float>

            <OrbitControls 
                enablePan={false}
                enableZoom={false}
                minDistance={4}
                maxDistance={12}
                autoRotate={true}
                autoRotateSpeed={0.4}
                maxPolarAngle={Math.PI / 1.6}
                minPolarAngle={Math.PI / 2.5}
            />

            <Environment preset="studio" />
            <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={12} blur={2.0} far={4} color="#110000" />
        </>
    );
};

export default React.memo(RealisticHeartScene);
