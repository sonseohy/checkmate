/// <reference types="vite/client" />

//  pwa 관련 타입을 typeScript에서 사용할 수 있도록 설정하기 위함
/// <reference types="vite-plugin-pwa/client" /> 

declare module 'pdfjs-dist/build/pdf.worker.entry';
declare module 'pdfjs-dist/build/pdf.worker.entry?worker' {
  const WorkerConstructor: {
    new (options?: { name?: string }): Worker;
  };
  export default WorkerConstructor;
}
declare module '*.mjs';