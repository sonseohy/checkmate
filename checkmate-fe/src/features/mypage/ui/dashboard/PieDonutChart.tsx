//대시 보드/ 도넛 파이 차트 
import ReactApexChart from "react-apexcharts";
import { useMobile } from "@/shared";
import { Contract } from "@/features/mypage";

interface PieDonutChartProps {
  contractList: Contract[];
}

export const PieDonutChart: React.FC<PieDonutChartProps> = ({ contractList }) => {
    const isMobile = useMobile();

    const userUploadCount = contractList.filter(c => c.source_type === "USER_UPLOAD").length;
    const otherCount = contractList.length - userUploadCount;
    const serie = [userUploadCount, otherCount];

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: "donut"
        },
        labels: ['작성',' 분석'],
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '20px', // 각 항목의 값 크기 설정
                fontFamily: 'Pretendard',
                fontWeight: 'semibold',
            },
            formatter: function (_val, opts) {
                const realValue = opts.w.config.series[opts.seriesIndex] as number;
                return `${realValue}개`;
            },
            dropShadow: {
                enabled: true,
                top: 2,
                left: 2,
                blur: 3,
                opacity: 0.5,
            },
        },
        states: {
            hover: {
            filter: {
                type: 'none'    // ← hover 시 필터(밝게/어둡게) 적용 안 함
                }
            }
        },
        plotOptions: {
            pie: {
                customScale: 0.8,
                donut: {
                    size: "50%",
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '30px',
                            fontFamily: 'Pretendard',
                            fontWeight: 300,
                            offsetY: -10,
                            formatter: function (val) {
                                return val
                            }
                        },
                        value: {
                            show:true,
                            fontSize: '25px',
                            fontFamily: "Pretendard",
                            fontWeight: 600,
                            offsetY: 16,
                            formatter: function (val) {
                                return val
                            }
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            fontSize: '30px',
                            fontFamily: 'Pretendard',
                            fontWeight: 800,
                            color: '#202020',
                            formatter: function (w) {
                                // 전체 합계를 표시하는 부분
                                return w.globals.seriesTotals.reduce((a: number, b:number) => {
                                    return a + b
                                }, 0)
                            }
                        }
                    }
                },
            },
        },
        tooltip: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        colors: ['#FFB4B5','#B4C7FF'],
        
    };

    const series = serie;

    return (
        <div>

            <ReactApexChart options={options} series={series} type="donut" height={isMobile ? 300 : 400}/>
        </div>
    )
};
