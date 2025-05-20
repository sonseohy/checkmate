//api
export {
  getContractDetail,
  getContractQuestions,
  getContractownload,
  deleteContractDetail,
  fetchQuestions,
} from './api/detailApi';

export { default as ContractPdfViewer } from './ui/ContractPdfViewer';
export { default as ContractDetail } from './ui/ContractDetail';

//type
export type { questions, questionList, ContractSummary } from './model/types';
