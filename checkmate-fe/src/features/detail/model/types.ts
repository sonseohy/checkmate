
//질문 리스트 
export interface questions {
    contractId: number;
    contractCategoryId: number;
    questionId: number;
    questionDetail: string;
};

export interface questionList {
    question: questions[];
}