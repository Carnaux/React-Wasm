/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";

export const VideoBackground = (props: any) => {
  const [vo, setVo] = useState<any>(null);
  const [streaming, setStreaming] = useState(false);
  const [requestedStream, setRequestedStream] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const processFrame = (_vo: any) => {
    if (videoRef.current && contextRef.current) {
      console.log("Processing frame...");
      console.log(_vo);
      const { offsetWidth, offsetHeight } = videoRef.current;
      const context = contextRef.current;
      context.drawImage(videoRef.current, 0, 0, offsetWidth, offsetHeight);
      const frameData = context.getImageData(0, 0, offsetWidth, offsetHeight);

      const uint8ArrData = new Uint8Array(frameData.data);
      const numBytes = uint8ArrData.length * uint8ArrData.BYTES_PER_ELEMENT;
      const dataPtr = props.wasmModule._malloc(numBytes);
      const dataOnHeap = new Uint8Array(
        props.wasmModule.HEAPU8.buffer,
        dataPtr,
        numBytes
      );
      dataOnHeap.set(uint8ArrData);

      const res = _vo.PredictPose(dataOnHeap.byteOffset, dataOnHeap.length);
      console.log(res);

      // requestAnimationFrame(processFrame);
    }
  };

  const requestCameraPermission = async () => {
    console.log("Requesting camera permission...");
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: false,
      })
      .then((stream) => {
        videoRef.current!.srcObject = stream;
        videoRef.current!.play();

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvasRef!.current = canvas;
        contextRef.current = context;

        const vo = new props.wasmModule.VisualOdometry(
          videoRef.current?.offsetWidth,
          videoRef.current?.offsetHeight
        );

        setVo(vo);
        console.log("aqui", vo);
        // processFrame();
        setTimeout(() => {
          processFrame(vo);
        }, 1000);
      })
      .catch((err) => {
        console.error(`An error occurred: ${err}`);
      });
  };

  // useEffect(() => {
  //   if (videoRef.current && !streaming) {
  //     videoRef.current.addEventListener(
  //       "playing",
  //       (ev) => {
  //         if (!streaming) {
  //           setStreaming(true);
  //           console.log("Streaming...");
  //           processFrame();
  //         }
  //       },
  //       false
  //     );
  //   }
  // }, [processFrame, streaming]);

  useEffect(() => {
    if (!requestedStream && props.permissionAsked && props.wasmModule) {
      setRequestedStream(true);
      requestCameraPermission();
    }
  }, [
    requestedStream,
    props.permissionAsked,
    props.wasmModule,
    requestCameraPermission,
  ]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      id="myVideo"
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 1,
      }}
    ></video>
  );
};
