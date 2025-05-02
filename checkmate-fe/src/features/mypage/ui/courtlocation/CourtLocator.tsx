//법원 위치 찾기
import KakaoMap from "./KakaoMap";

export default function CourtLocation() {
    return (
        <div>
            <div className="text-3xl font-bold">
                관할 법원 위치
            </div>
            <div>
                <KakaoMap />
            </div>
        </div>
    );
};
