import { SideBar } from "@/features/mypage";

export default function MyPage() {
    return (
        <div className="flex flex-row gap-2">
            <div>
                <SideBar />
            </div>
            <div>
                <div>
                    안녕하세요 000님
                </div>
                <div>
                    메인 컴포넌트
                </div>
            </div>
        </div>
    );
}