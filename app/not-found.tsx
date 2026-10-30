"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Sparkles } from "lucide-react";
import styles from "./not-found.module.css";

const className = (name: string) => styles[name] ?? name;

const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;

  uniform vec2 u_resolution;
  uniform vec2 u_pointer;
  uniform float u_time;
  uniform float u_pulse;

  varying vec2 v_uv;

  void main() {
    float aspect = u_resolution.x / u_resolution.y;
    vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0);
    vec2 pointer = (u_pointer - 0.5) * vec2(aspect, 1.0);
    float pointerDistance = length(p - pointer);
    float influence = exp(-pointerDistance * 3.2);

    p += normalize(p - pointer + vec2(0.0001)) * influence * 0.045;
    vec2 center = vec2(aspect * 0.22, 0.015);
    float radius = length(p - center);
    float angle = atan(p.y - center.y, p.x - center.x);
    float pulseWave = sin(length(p - pointer) * 24.0 - u_time * 2.4) * u_pulse;
    float flow = sin(
      radius * 9.0 - u_time * 0.62 +
      sin(angle * 4.0 + u_time * 0.2) * 0.75 +
      influence * 1.8 + pulseWave * 0.42
    );
    float bands = smoothstep(0.18, 0.96, flow * 0.5 + 0.5) * exp(-radius * 0.72);
    float halo = exp(-pow(radius - 0.7, 2.0) * 8.5);
    float core = exp(-radius * 3.8);

    vec3 color = vec3(0.008, 0.016, 0.042);
    color += vec3(0.018, 0.12, 0.36) * halo * 0.82;
    color += vec3(0.02, 0.42, 0.95) * bands * 0.34;
    color += vec3(0.2, 0.055, 0.52) * bands * (1.0 - smoothstep(0.05, 0.9, flow)) * 0.24;
    color += vec3(0.035, 0.25, 0.58) * core * 0.38;
    color += vec3(0.16, 0.44, 0.95) * influence * 0.055;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const titleFragmentShaderSource = `
  precision mediump float;

  uniform sampler2D u_mask;
  uniform vec2 u_pointer;
  uniform float u_time;
  uniform float u_pulse;

  varying vec2 v_uv;

  void main() {
    float mask = texture2D(u_mask, v_uv).a;
    if (mask < 0.02) discard;

    float wave = sin(v_uv.x * 17.0 - u_time * 1.8 + sin(v_uv.y * 8.0) * 1.6);
    float shimmer = smoothstep(-0.15, 0.85, wave);
    float pointerGlow = exp(-distance(v_uv, u_pointer) * 8.0);
    float glint = pow(max(0.0, sin(v_uv.x * 33.0 - u_time * 3.2)), 18.0);
    vec3 cyan = vec3(0.34, 0.91, 1.0);
    vec3 blue = vec3(0.23, 0.48, 1.0);
    vec3 violet = vec3(0.72, 0.36, 1.0);
    vec3 color = mix(cyan, blue, smoothstep(0.02, 0.62, v_uv.x));
    color = mix(color, violet, smoothstep(0.48, 0.96, v_uv.x) * (0.62 + shimmer * 0.38));
    color += vec3(0.7, 0.83, 1.0) * (glint * 0.58 + pointerGlow * 0.42 + u_pulse * 0.35);

    gl_FragColor = vec4(color, mask);
  }
`;

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("O navegador não conseguiu criar o shader.");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? "Erro desconhecido.";
    gl.deleteShader(shader);
    throw new Error(`Falha ao compilar o shader: ${message}`);
  }

  return shader;
}

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const titleCanvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { alpha: false, antialias: false });

    if (!canvas || !gl) {
      return;
    }

    let program: WebGLProgram | null = null;
    let animationFrame = 0;
    let pointerX = 0.72;
    let pointerY = 0.52;
    let clickAt = 0;
    const startedAt = performance.now();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    try {
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
      const fragmentShader = createShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentShaderSource,
      );
      program = gl.createProgram();

      if (!program) {
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        throw new Error("O navegador não conseguiu criar o programa WebGL.");
      }

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const message = gl.getProgramInfoLog(program) ?? "Erro desconhecido.";
        gl.deleteProgram(program);
        program = null;
        throw new Error(`Falha ao conectar os shaders: ${message}`);
      }
    } catch (error) {
      console.error("Não foi possível iniciar o shader da página 404:", error);
      return;
    }

    const activeProgram = program;
    gl.useProgram(activeProgram);

    const positionLocation = gl.getAttribLocation(activeProgram, "a_position");
    const resolutionLocation = gl.getUniformLocation(
      activeProgram,
      "u_resolution",
    );
    const pointerLocation = gl.getUniformLocation(activeProgram, "u_pointer");
    const timeLocation = gl.getUniformLocation(activeProgram, "u_time");
    const pulseLocation = gl.getUniformLocation(activeProgram, "u_pulse");
    const positions = gl.createBuffer();

    if (!positions) {
      gl.deleteProgram(activeProgram);
      console.error("Não foi possível criar a geometria do shader da página 404.");
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positions);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const draw = (now: number) => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(canvas.clientWidth * pixelRatio));
      const height = Math.max(1, Math.round(canvas.clientHeight * pixelRatio));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolutionLocation, width, height);
      gl.uniform2f(pointerLocation, pointerX, pointerY);
      gl.uniform1f(timeLocation, (now - startedAt) / 1000);
      gl.uniform1f(
        pulseLocation,
        clickAt ? Math.exp(-Math.max(0, now / 1000 - clickAt) * 1.8) : 0,
      );
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!reducedMotion.matches) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX / window.innerWidth;
      pointerY = 1 - event.clientY / window.innerHeight;
      if (reducedMotion.matches) draw(performance.now());
    };

    const handlePointerDown = () => {
      clickAt = performance.now() / 1000;
      if (reducedMotion.matches) draw(performance.now());
    };

    const handleResize = () => {
      if (reducedMotion.matches) draw(performance.now());
    };

    draw(startedAt);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", handleResize);
      gl.deleteBuffer(positions);
      gl.deleteProgram(activeProgram);
    };
  }, []);

  useEffect(() => {
    const title = titleRef.current;
    const canvas = titleCanvasRef.current;
    const gl = canvas?.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });

    if (!title || !canvas || !gl) {
      return;
    }

    let program: WebGLProgram | null = null;
    let animationFrame = 0;
    let pointerX = 0.5;
    let pointerY = 0.5;
    let pulseAt = 0;
    let maskDirty = true;
    const startedAt = performance.now();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    try {
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
      const fragmentShader = createShader(
        gl,
        gl.FRAGMENT_SHADER,
        titleFragmentShaderSource,
      );
      program = gl.createProgram();

      if (!program) {
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        throw new Error("O navegador não conseguiu criar o shader do título.");
      }

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const message = gl.getProgramInfoLog(program) ?? "Erro desconhecido.";
        gl.deleteProgram(program);
        program = null;
        throw new Error(`Falha ao conectar o shader do título: ${message}`);
      }
    } catch (error) {
      console.error("Não foi possível iniciar o shader do título 404:", error);
      return;
    }

    const activeProgram = program;
    gl.useProgram(activeProgram);

    const positionLocation = gl.getAttribLocation(activeProgram, "a_position");
    const pointerLocation = gl.getUniformLocation(activeProgram, "u_pointer");
    const timeLocation = gl.getUniformLocation(activeProgram, "u_time");
    const pulseLocation = gl.getUniformLocation(activeProgram, "u_pulse");
    const maskLocation = gl.getUniformLocation(activeProgram, "u_mask");
    const positions = gl.createBuffer();
    const texture = gl.createTexture();
    const maskCanvas = document.createElement("canvas");
    const maskContext = maskCanvas.getContext("2d");

    if (!positions || !texture || !maskContext) {
      if (positions) gl.deleteBuffer(positions);
      if (texture) gl.deleteTexture(texture);
      gl.deleteProgram(activeProgram);
      console.error("Não foi possível criar os recursos do shader do título 404.");
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positions);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(maskLocation, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    title.classList.add(className("numberShader"));

    const draw = (now: number) => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(canvas.clientWidth * pixelRatio));
      const height = Math.max(1, Math.round(canvas.clientHeight * pixelRatio));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        maskCanvas.width = width;
        maskCanvas.height = height;
        maskDirty = true;
      }

      if (maskDirty) {
        const style = window.getComputedStyle(title);
        maskContext.clearRect(0, 0, width, height);
        maskContext.save();
        maskContext.scale(pixelRatio, pixelRatio);
        maskContext.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        maskContext.textBaseline = "alphabetic";
        maskContext.fillStyle = "#fff";
        maskContext.letterSpacing = style.letterSpacing;

        const metrics = maskContext.measureText("404.");
        const baseline =
          (canvas.clientHeight -
            metrics.actualBoundingBoxAscent -
            metrics.actualBoundingBoxDescent) /
            2 +
          metrics.actualBoundingBoxAscent;
        maskContext.fillText("404.", 0, baseline);
        maskContext.restore();

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          maskCanvas,
        );
        maskDirty = false;
      }

      gl.viewport(0, 0, width, height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(pointerLocation, pointerX, pointerY);
      gl.uniform1f(timeLocation, (now - startedAt) / 1000);
      gl.uniform1f(
        pulseLocation,
        pulseAt ? Math.exp(-Math.max(0, now / 1000 - pulseAt) * 2.4) : 0,
      );
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!reducedMotion.matches) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = title.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width;
      pointerY = 1 - (event.clientY - rect.top) / rect.height;
      if (reducedMotion.matches) draw(performance.now());
    };

    const handlePointerDown = (event: PointerEvent) => {
      const rect = title.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width;
      pointerY = 1 - (event.clientY - rect.top) / rect.height;
      pulseAt = performance.now() / 1000;
      if (reducedMotion.matches) draw(performance.now());
    };

    const observer = new ResizeObserver(() => {
      maskDirty = true;
      if (reducedMotion.matches) draw(performance.now());
    });

    observer.observe(title);
    title.addEventListener("pointermove", handlePointerMove, { passive: true });
    title.addEventListener("pointerdown", handlePointerDown, { passive: true });
    draw(startedAt);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      title.removeEventListener("pointermove", handlePointerMove);
      title.removeEventListener("pointerdown", handlePointerDown);
      title.classList.remove(className("numberShader"));
      gl.deleteBuffer(positions);
      gl.deleteTexture(texture);
      gl.deleteProgram(activeProgram);
    };
  }, []);

  return (
    <main className={className("page")}>
      <canvas
        ref={canvasRef}
        className={className("shader")}
        aria-hidden="true"
      />
      <div className={className("veil")} aria-hidden="true" />
      <div className={className("grid")} aria-hidden="true" />

      <div className={className("shell")}>
        <header className={className("topbar")}>
          <Link
            className={className("brand")}
            href="/"
            aria-label="Gestão Escolar, início"
          >
            <span className={className("brandMark")}>
              <Sparkles size={16} strokeWidth={1.8} />
            </span>
            <span>
              <strong>GESTÃO</strong>
              <span className={className("brandSub")}>ESCOLAR</span>
            </span>
          </Link>
          <span className={className("systemStatus")}>
            <span className={className("statusDot")} />
            SISTEMA ONLINE
          </span>
        </header>

        <section className={className("hero")} aria-labelledby="error-title">
          <div className={className("copy")}>
            <div className={className("eyebrow")}>
              <span className={className("eyebrowLine")} />
              ERRO <span className={className("eyebrowCode")}>404</span>
              <span className={className("eyebrowDivider")}>/</span>
              ROTA NÃO ENCONTRADA
            </div>

            <p ref={titleRef} className={className("number")} aria-hidden="true">
              <canvas
                ref={titleCanvasRef}
                className={className("numberCanvas")}
                aria-hidden="true"
              />
              404<span>.</span>
            </p>
            <h1 id="error-title">
              Parece que
              <br />
              você saiu <span>da rota.</span>
            </h1>
            <p className={className("description")}>
              A página que você procura não está por aqui. Talvez o endereço
              tenha mudado — ou ela esteja em outra dimensão.
            </p>

            <div className={className("actions")}>
              <Link className={className("homeButton")} href="/">
                Voltar ao início
                <ArrowUpRight size={17} strokeWidth={1.8} />
              </Link>
              <button
                className={className("backButton")}
                type="button"
                onClick={() => router.back()}
              >
                <ArrowLeft size={16} strokeWidth={1.8} />
                Voltar página
              </button>
            </div>

            <p className={className("hint")}>
              <span className={className("hintKey")}>DICA</span>
              Mova o cursor e veja o espaço reagir.
            </p>
          </div>

          <div className={className("coordinates")} aria-hidden="true">
            <span>SECTOR 04</span>
            <span className={className("coordinateDivider")} />
            <span>LAT 00° 00′ 00″</span>
          </div>
        </section>

        <footer className={className("footer")}>
          <span>GESTÃO ESCOLAR <span className={className("footerSlash")}>/</span> PORTAL</span>
          <span className={className("footerMessage")}>
            <span className={className("footerDot")} />
            NAVEGANDO PELO DESCONHECIDO
          </span>
        </footer>
      </div>
    </main>
  );
}
