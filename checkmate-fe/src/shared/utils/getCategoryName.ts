import { categories } from "@/shared/constants/categories";

// 카테고리 id와 이름 매핑
const getCategorName = (id:number): string => {
    const found = categories.find(cat => cat.id === id);
    return found ? found.name: '알수없음';
};
export default getCategorName;
