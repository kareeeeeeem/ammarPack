import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export type PackyVariant = 'hero' | 'story' | 'products' | 'process' | 'quote';
export type PackyReaction = 'jump' | 'spin' | 'shy' | 'wave' | 'surprise' | 'reveal' | 'celebrate';
export type PackyTravel = { scene: PackyVariant; progress: number; motion: 'idle' | 'walk' | 'run' | 'jump' | 'fly' | 'slide' | 'roll' | 'land' | 'peek' | 'present'; direction: number; velocity: number; phase: number; turning: boolean };

export type PackyController = {
  setPointer: (horizontal: number, vertical: number) => void;
  setHover: (hovered: boolean) => void;
  setProgress: (progress: number) => void;
  setTravel: (travel: PackyTravel) => void;
  setPaused: (paused: boolean) => void;
  speak: () => void;
  react: (reaction: PackyReaction) => void;
  dispose: () => void;
};

const clamp = (value: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(maximum, value));
const easeOut = (value: number) => 1 - Math.pow(1 - clamp(value, 0, 1), 3);
const springOut = (value: number) => {
  const progress = clamp(value, 0, 1);
  return 1 + 2.5 * Math.pow(progress - 1, 3) + 1.5 * Math.pow(progress - 1, 2);
};

function makeKraftTexture() {
  const surface = document.createElement('canvas');
  surface.width = 256;
  surface.height = 256;
  const context = surface.getContext('2d');
  if (!context) throw new Error('Canvas texture unavailable');
  context.fillStyle = '#d7a76f';
  context.fillRect(0, 0, 256, 256);
  let seed = 34521;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let stroke = 0; stroke < 950; stroke += 1) {
    const horizontal = random() * 256;
    const vertical = random() * 256;
    const length = 3 + random() * 55;
    context.strokeStyle = random() > 0.55 ? 'rgba(255,236,199,.15)' : 'rgba(102,58,25,.09)';
    context.lineWidth = random() * 1.1 + 0.2;
    context.beginPath();
    context.moveTo(horizontal, vertical);
    context.lineTo(horizontal + length, vertical + (random() - 0.5) * 3);
    context.stroke();
  }
  const texture = new THREE.CanvasTexture(surface);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.5, 1.3);
  texture.anisotropy = 2;
  return texture;
}

function makeBrandTexture() {
  const surface = document.createElement('canvas');
  surface.width = 512;
  surface.height = 256;
  const context = surface.getContext('2d');
  if (!context) throw new Error('Brand texture unavailable');
  context.fillStyle = '#f3e0bb';
  context.fillRect(0, 0, 512, 256);
  context.strokeStyle = '#9c6233';
  context.lineWidth = 5;
  context.strokeRect(13, 13, 486, 230);
  context.textAlign = 'center';
  context.fillStyle = '#5e412b';
  context.font = 'bold 62px Georgia, serif';
  context.fillText('AMMAR', 256, 116);
  context.font = 'bold 38px Arial, sans-serif';
  context.letterSpacing = '12px';
  context.fillText('PACK', 256, 180);
  const texture = new THREE.CanvasTexture(surface);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeShadowTexture() {
  const surface = document.createElement('canvas');
  surface.width = 128;
  surface.height = 128;
  const context = surface.getContext('2d');
  if (!context) throw new Error('Shadow texture unavailable');
  const gradient = context.createRadialGradient(64, 64, 8, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(73,45,25,.28)');
  gradient.addColorStop(1, 'rgba(73,45,25,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(surface);
}

export function mountPacky(canvas: HTMLCanvasElement, variant: PackyVariant, onFailure: () => void): PackyController {
  const viewport = canvas.getBoundingClientRect();
  const mobile = window.matchMedia('(pointer: coarse)').matches || viewport.width < 420;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !mobile, powerPreference: mobile ? 'low-power' : 'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.3 : 1.8));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  const stage = new THREE.Group();
  scene.add(stage);

  const kraftTexture = makeKraftTexture();
  const brandTexture = makeBrandTexture();
  const shadowTexture = makeShadowTexture();
  const kraft = new THREE.MeshStandardMaterial({ map: kraftTexture, color: 0xffe6bf, roughness: 0.92, metalness: 0 });
  const kraftLight = new THREE.MeshStandardMaterial({ color: 0xe8bd83, roughness: 0.91 });
  const kraftDark = new THREE.MeshStandardMaterial({ color: 0x986034, roughness: 0.98 });
  const navy = new THREE.MeshStandardMaterial({ color: 0x21334a, roughness: 0.67 });
  const ivory = new THREE.MeshStandardMaterial({ color: 0xfff8e8, roughness: 0.46 });
  const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x192337, roughness: 0.22 });
  const cheekMaterial = new THREE.MeshStandardMaterial({ color: 0xc9815d, roughness: 0.85 });
  const bodyRoot = new THREE.Group();
  stage.add(bodyRoot);

  const body = new THREE.Mesh(new RoundedBoxGeometry(2.18, 1.86, 1.45, 3, 0.095), kraft);
  bodyRoot.add(body);
  const rim = new THREE.Mesh(new RoundedBoxGeometry(2.2, 0.085, 1.48, 2, 0.035), kraftDark);
  rim.position.y = 0.91;
  bodyRoot.add(rim);
  const innerTop = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.025, 1.2), kraftDark);
  innerTop.position.y = 0.962;
  bodyRoot.add(innerTop);

  const lidPivot = new THREE.Group();
  lidPivot.position.set(0, 0.99, -0.71);
  bodyRoot.add(lidPivot);
  const lid = new THREE.Mesh(new RoundedBoxGeometry(2.3, 0.16, 1.58, 3, 0.045), kraftLight);
  lid.position.z = 0.72;
  lidPivot.add(lid);
  const lidStripe = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.012, 1.56), kraftDark);
  lidStripe.position.set(0, 0.086, 0.72);
  lidPivot.add(lidStripe);

  const label = new THREE.Mesh(new THREE.PlaneGeometry(0.88, 0.44), new THREE.MeshBasicMaterial({ map: brandTexture, transparent: true }));
  label.position.set(0, -0.56, 0.738);
  bodyRoot.add(label);
  const corrugation = new THREE.Group();
  for (let stripe = 0; stripe < 8; stripe += 1) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.016, 1.14), kraftDark);
    line.position.set(-1.075, -0.74 + stripe * 0.21, 0);
    corrugation.add(line);
  }
  bodyRoot.add(corrugation);

  const eyeRigs: THREE.Group[] = [];
  const pupils: THREE.Mesh[] = [];
  const eyebrows: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    const eye = new THREE.Group();
    eye.position.set(side * 0.43, 0.24, 0.754);
    const white = new THREE.Mesh(new THREE.SphereGeometry(0.23, 20, 14), ivory);
    white.scale.set(1, 1.27, 0.42);
    eye.add(white);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.116, 18, 12), pupilMaterial);
    pupil.position.z = 0.115;
    pupil.scale.z = 0.58;
    eye.add(pupil);
    const glint = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), ivory);
    glint.position.set(-0.038, 0.045, 0.172);
    eye.add(glint);
    bodyRoot.add(eye);
    eyeRigs.push(eye);
    pupils.push(pupil);
    const eyebrow = new THREE.Group();
    eyebrow.position.set(side * 0.43, 0.66, 0.793);
    const eyebrowMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.037, 0.27, 4, 8), navy);
    eyebrowMesh.rotation.z = Math.PI / 2 + side * 0.16;
    eyebrow.add(eyebrowMesh);
    bodyRoot.add(eyebrow);
    eyebrows.push(eyebrow);
    const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.105, 12, 9), cheekMaterial);
    cheek.position.set(side * 0.73, -0.25, 0.75);
    cheek.scale.z = 0.19;
    bodyRoot.add(cheek);
  }

  const smilePoints = [new THREE.Vector3(-0.25, -0.22, 0.78), new THREE.Vector3(-0.13, -0.35, 0.81), new THREE.Vector3(0, -0.38, 0.82), new THREE.Vector3(0.13, -0.35, 0.81), new THREE.Vector3(0.25, -0.22, 0.78)];
  const smile = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(smilePoints), 20, 0.028, 6, false), navy);
  bodyRoot.add(smile);
  const surprisedMouth = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.031, 8, 20), navy);
  surprisedMouth.position.set(0, -0.31, 0.796);
  surprisedMouth.visible = false;
  bodyRoot.add(surprisedMouth);

  const arms: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    const arm = new THREE.Group();
    arm.position.set(side * 1.04, 0.18, 0.02);
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(side * 0.24, -0.12, 0.1), new THREE.Vector3(side * 0.45, -0.28, 0.2)]);
    arm.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 12, 0.07, 8, false), navy));
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), ivory);
    hand.position.set(side * 0.47, -0.29, 0.2);
    arm.add(hand);
    for (let finger = -1; finger <= 1; finger += 1) {
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), ivory);
      tip.position.set(side * (0.57 + Math.abs(finger) * 0.01), -0.31 + finger * 0.075, 0.2);
      arm.add(tip);
    }
    bodyRoot.add(arm);
    arms.push(arm);
  }
  const feet: THREE.Mesh[] = [];
  for (const side of [-1, 1]) {
    const foot = new THREE.Mesh(new RoundedBoxGeometry(0.44, 0.21, 0.65, 3, 0.08), navy);
    foot.position.set(side * 0.58, -1.05, 0.28);
    bodyRoot.add(foot);
    feet.push(foot);
  }

  const tinyPackage = new THREE.Group();
  const tinyBody = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.38, 0.4, 2, 0.025), kraftLight);
  const tinyBand = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.41, 0.42), kraftDark);
  tinyPackage.add(tinyBody, tinyBand);
  tinyPackage.position.set(0, 0.82, 0.2);
  tinyPackage.scale.setScalar(0.01);
  bodyRoot.add(tinyPackage);

  const particles: THREE.Mesh[] = [];
  for (let index = 0; index < 9; index += 1) {
    const particle = new THREE.Mesh(new RoundedBoxGeometry(0.12, 0.11, 0.12, 2, 0.01), index % 3 === 0 ? kraftDark : kraftLight);
    particle.visible = false;
    stage.add(particle);
    particles.push(particle);
  }

  const heroPlatform = new THREE.Group();
  stage.add(heroPlatform);
  {
    const foreground = new THREE.Mesh(new RoundedBoxGeometry(3.3, 0.5, 1.7, 3, 0.045), kraftLight);
    foreground.position.set(0, -1.37, 0.8);
    heroPlatform.add(foreground);
    const tape = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.012, 1.7), kraftDark);
    tape.position.set(0, -1.113, 0.8);
    heroPlatform.add(tape);
  }
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 2.4), new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, -1.62, 0);
  stage.add(shadow);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a6544, 2.1));
  const keyLight = new THREE.DirectionalLight(0xfff0d7, 2.8);
  keyLight.position.set(-3, 5, 7);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0xffffff, 1.6);
  rimLight.position.set(4, 3, -4);
  scene.add(rimLight);

  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    renderer.setSize(bounds.width, bounds.height, false);
    camera.aspect = bounds.width / bounds.height;
    camera.position.set(3.5, 2.35, camera.aspect < 0.9 ? 8.6 : 7.4);
    camera.lookAt(0, -0.05, 0);
    camera.updateProjectionMatrix();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();

  let pointerHorizontal = 0;
  let pointerVertical = 0;
  let pupilHorizontal = 0;
  let pupilVertical = 0;
  let hovered = false;
  let scrollProgress = 0;
  let travel: PackyTravel = { scene: variant, progress: 0, motion: 'idle', direction: 1, velocity: 0, phase: 0, turning: false };
  let currentReaction: PackyReaction | null = null;
  let reactionStarted = 0;
  let speakingUntil = 0;
  let entryStarted = performance.now() / 1000;
  let blinkStarted = -10;
  let nextBlink = entryStarted + 2.4;
  let lastFrame = 0;
  let disposed = false;

  const onContextLost = (event: Event) => {
    event.preventDefault();
    renderer.setAnimationLoop(null);
    onFailure();
  };
  canvas.addEventListener('webglcontextlost', onContextLost);

  const animate = (timestamp: number) => {
    if (disposed || (mobile && timestamp - lastFrame < 30)) return;
    const delta = clamp((timestamp - lastFrame) / 1000, 0, 0.05);
    lastFrame = timestamp;
    const now = timestamp / 1000;
    const entry = now - entryStarted;
    const currentScene = travel.scene;
    heroPlatform.visible = currentScene === 'hero' && scrollProgress < 0.25;
    const entranceLook = currentScene === 'hero' && entry > 0.48 && entry < 1.55 ? Math.sin((entry - 0.48) * 6) * (1 - (entry - 0.48) / 1.07) : 0;
    const reactionTime = currentReaction ? now - reactionStarted : 0;
    if (currentReaction && reactionTime > (currentReaction === 'celebrate' ? 2.6 : 2.1)) currentReaction = null;

    if (now > nextBlink) {
      blinkStarted = now;
      nextBlink = now + 2.8 + Math.random() * 2.5;
    }
    const blinkPhase = (now - blinkStarted) / 0.2;
    const blink = blinkPhase >= 0 && blinkPhase <= 1 ? 1 - 0.94 * Math.sin(blinkPhase * Math.PI) : 1;
    const entryRise = springOut(entry / 1.1);
    const productReveal = currentScene === 'products' ? clamp(springOut((scrollProgress - 0.08) / 0.7), 0, 1) : 0;
    const defaultLid = currentScene === 'products' ? 0.1 + productReveal * 1.03 : currentScene === 'quote' ? 0.2 : 0.08;
    let lidOpen = currentScene === 'hero' ? 0.08 + springOut((entry - 0.55) / 0.75) * (1 - easeOut((entry - 1.38) / 0.65)) : defaultLid;
    let jump = 0;
    let squash = 1;
    let spin = 0;
    let wave = currentScene === 'process' ? 0.2 + 0.26 * Math.sin(scrollProgress * Math.PI) : 0;
    let surprised = travel.turning;
    let packageReveal = productReveal;
    let shy = 0;

    if (currentScene === 'hero' && entry > 0.95 && entry < 2.35) wave = Math.sin((entry - 0.95) * 17) * 0.35 + 0.85;
    if (travel.motion === 'present') wave = 0.55 + 0.12 * Math.sin(now * 2.2);
    if (currentReaction === 'jump') {
      if (reactionTime < 0.22) squash = 1 - 0.2 * Math.sin(Math.PI * reactionTime / 0.22);
      else if (reactionTime < 1.3) jump = 0.83 * Math.sin(Math.PI * (reactionTime - 0.22) / 1.08);
      if (reactionTime > 1.3 && reactionTime < 1.65) squash = 1 - 0.13 * Math.sin(Math.PI * (reactionTime - 1.3) / 0.35);
    }
    if (currentReaction === 'spin') spin = Math.PI * 2 * easeOut(reactionTime / 1.25);
    if (currentReaction === 'shy') shy = Math.sin(Math.PI * clamp(reactionTime / 1.8, 0, 1));
    if (currentReaction === 'wave') wave = 0.9 + 0.55 * Math.sin(reactionTime * 18) * Math.sin(Math.PI * clamp(reactionTime / 1.8, 0, 1));
    if (currentReaction === 'surprise') { surprised = reactionTime < 1.4; squash = 1 + 0.12 * Math.sin(Math.PI * clamp(reactionTime / 1.2, 0, 1)); }
    if (currentReaction === 'reveal' || currentReaction === 'celebrate') {
      const reveal = Math.sin(Math.PI * clamp(reactionTime / (currentReaction === 'celebrate' ? 2.6 : 2), 0, 1));
      lidOpen = Math.max(lidOpen, 1.2 * reveal);
      packageReveal = Math.max(packageReveal, reveal);
      wave = 0.35 * reveal;
    }

    const breathing = 1 + 0.013 * Math.sin(now * 1.8);
    const moving = travel.motion === 'walk' || travel.motion === 'run';
    const stride = moving ? Math.sin(now * (travel.motion === 'run' ? 14 : 8)) * Math.min(1, 0.3 + travel.velocity / 1100) : 0;
    const airborne = travel.motion === 'jump' ? Math.sin(Math.PI * travel.phase) * 0.42 : travel.motion === 'fly' ? 0.26 + Math.sin(Math.PI * travel.phase) * 0.16 : 0;
    const landing = travel.motion === 'land' ? Math.sin(Math.PI * travel.phase) * 0.14 : 0;
    bodyRoot.position.y = -2.2 * (1 - entryRise) + jump + airborne + Math.abs(stride) * 0.07 - shy * (currentScene === 'hero' ? 1.08 : 0.42) + 0.025 * Math.sin(now * 1.5);
    const travelSquash = travel.motion === 'land' ? 1 - landing : travel.motion === 'jump' && travel.phase < 0.16 ? 0.89 : 1;
    bodyRoot.scale.set(1 + (1 - squash * travelSquash) * 0.32, breathing * squash * travelSquash, 1 + (1 - squash * travelSquash) * 0.17);
    bodyRoot.rotation.y = spin + 0.025 * Math.sin(now * 1.1) + pointerHorizontal * 0.13 + entranceLook * 0.28 + (scrollProgress - 0.5) * 0.08 + (currentScene === 'story' ? -0.12 : 0) - shy * 0.28 + (moving ? travel.direction * 0.3 : 0);
    bodyRoot.rotation.z = 0.018 * Math.sin(now * 1.4) + (hovered ? 0.035 : 0) + shy * 0.08 + (travel.motion === 'run' ? -travel.direction * 0.12 : travel.motion === 'slide' ? -travel.direction * 0.2 : travel.motion === 'roll' ? travel.phase * Math.PI * 2 : travel.motion === 'jump' ? -travel.direction * Math.sin(Math.PI * travel.phase) * 0.2 : travel.motion === 'fly' ? -travel.direction * 0.18 : 0);
    lidPivot.rotation.x = -lidOpen;
    arms[0].rotation.z = (currentScene === 'quote' ? -0.82 : currentScene === 'story' ? -0.68 : -0.08) + 0.06 * Math.sin(now * 1.8) - shy * 0.6 + stride * 0.25;
    if (currentScene === 'story') arms[0].rotation.z -= 0.15 * Math.sin(scrollProgress * Math.PI);
    if (currentScene === 'quote') arms[0].rotation.z -= 0.07 * Math.sin(now * 2.5);
    arms[1].rotation.z = wave + shy * 1.05 + 0.06 * Math.sin(now * 2.1) - stride * 0.25 + (travel.motion === 'fly' ? 0.35 : 0);
    arms[1].rotation.x = -0.08 + 0.1 * Math.sin(now * 2.6);
    feet[0].rotation.z = -0.035 * Math.sin(now * 2.2) + stride * 0.3;
    feet[1].rotation.z = 0.035 * Math.sin(now * 2.2 + 1.2) - stride * 0.3;
    feet[0].position.y = -1.05 + 0.018 * Math.sin(now * 2.3) + Math.max(0, stride) * 0.13;
    feet[1].position.y = -1.05 + 0.018 * Math.sin(now * 2.3 + Math.PI) + Math.max(0, -stride) * 0.13;
    shadow.scale.setScalar(1 + airborne * 0.3);
    (shadow.material as THREE.MeshBasicMaterial).opacity = 1 - airborne * 0.65;
    pupilHorizontal += ((pointerHorizontal + entranceLook * 0.8) * 0.075 - pupilHorizontal) * (1 - Math.exp(-delta * 9));
    pupilVertical += (-pointerVertical * 0.055 - pupilVertical) * (1 - Math.exp(-delta * 9));
    for (let index = 0; index < 2; index += 1) {
      eyeRigs[index].scale.y = blink * (surprised ? 1.15 : hovered ? 1.045 : 1);
      pupils[index].position.x = pupilHorizontal;
      pupils[index].position.y = pupilVertical;
      eyebrows[index].position.y = 0.66 + (surprised ? 0.15 : hovered ? 0.045 : 0) - shy * 0.08;
      eyebrows[index].rotation.z = (index === 0 ? 1 : -1) * (surprised ? 0.22 : shy ? 0.32 : 0);
    }
    smile.visible = !surprised;
    smile.scale.y = now < speakingUntil ? 0.78 + 0.18 * Math.sin(now * 23) : 1;
    surprisedMouth.visible = surprised;
    tinyPackage.scale.setScalar(Math.max(0.01, packageReveal));
    tinyPackage.position.y = 0.82 + packageReveal * 0.75;
    tinyPackage.rotation.y = now * 0.55;

    for (let index = 0; index < particles.length; index += 1) {
      const particle = particles[index];
      const landingDust = travel.motion === 'land' && travel.phase > 0.04 && travel.phase < 0.4;
      const active = (currentReaction === 'celebrate' && reactionTime > 0.28 && reactionTime < 2.45) || landingDust;
      particle.visible = active;
      if (!active) continue;
      const flight = landingDust && currentReaction !== 'celebrate' ? (travel.phase - 0.04) / 0.36 : (reactionTime - 0.28) / 2.17;
      const angle = index * 2.39996;
      const radius = 0.45 + flight * (1.1 + index % 3 * 0.3);
      particle.position.set(Math.cos(angle) * radius, landingDust && currentReaction !== 'celebrate' ? -1.2 + 0.38 * flight : 0.8 + 2.2 * flight - 2.5 * flight * flight, Math.sin(angle) * radius);
      particle.rotation.set(flight * 8 + index, flight * 5, flight * 6);
      particle.scale.setScalar((1 - flight) * 0.9 + 0.1);
    }
    renderer.render(scene, camera);
  };

  animate(performance.now());
  renderer.setAnimationLoop(animate);
  return {
    setPointer: (horizontal, vertical) => { pointerHorizontal = clamp(horizontal, -1, 1); pointerVertical = clamp(vertical, -1, 1); },
    setHover: (value) => { hovered = value; },
    setProgress: (value) => { scrollProgress = clamp(value, 0, 1); },
    setTravel: (value) => { travel = value; scrollProgress = value.progress; },
    setPaused: (paused) => { renderer.setAnimationLoop(paused ? null : animate); if (!paused) lastFrame = performance.now(); },
    speak: () => { speakingUntil = performance.now() / 1000 + 1.1; },
    react: (reaction) => { currentReaction = reaction; reactionStarted = performance.now() / 1000; },
    dispose: () => {
      if (disposed) return;
      disposed = true;
      renderer.setAnimationLoop(null);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      resizeObserver.disconnect();
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        geometries.add(object.geometry);
        const meshMaterials = Array.isArray(object.material) ? object.material : [object.material];
        meshMaterials.forEach((material) => materials.add(material));
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      kraftTexture.dispose();
      brandTexture.dispose();
      shadowTexture.dispose();
      renderer.dispose();
    },
  };
}
