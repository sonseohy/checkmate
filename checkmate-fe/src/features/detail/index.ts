

//api
export { getContractDetail, 
         getContractQuestions, 
         getContractownload } from "./api/detailApi";


export { default as ContractPdfViewer } from "./ui/ContractPdfViewer";
export { default as ContractDetail } from "./ui/ContractDetail";

//type
export type { questions, 
              questionList } from './model/types';