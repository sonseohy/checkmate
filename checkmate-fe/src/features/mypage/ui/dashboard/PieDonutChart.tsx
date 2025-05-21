import ReactApexChart from 'react-apexcharts';
import { Contract } from '@/features/mypage';
import { useEffect, useRef, useState } from 'react';

interface PieDonutChartProps {
  contractList: Contract[];
}

export const PieDonutChart: React.FC<PieDonutChartProps> = ({
  contractList,
}) => {
  /* ───── 데이터 집계 ───── */
  const uploads = contractList.filter(
    (c) => c.source_type === 'USER_UPLOAD',
  ).length;
  const series = [uploads, contractList.length - uploads]; // [분석, 작성]

  /* ───── 크기 계산 ───── */
  const wrapperRef = useRef<HTMLDivElement>(null);
  // 초기값을 null 대신 기본 크기(250)로 설정하여 처음부터 차트가 보이도록 함
  const [size, setSize] = useState<number>(250);

  /* ───── 모바일 최소 크기 보장 및 크기 계산 개선 ───── */
  useEffect(() => {
    // 초기 렌더링 시 딜레이를 주어 정확한 크기 계산
    const initialTimer = setTimeout(() => {
      calculateOptimalSize();
    }, 50);

    function calculateOptimalSize() {
      if (!wrapperRef.current) return;

      const { width, height } = wrapperRef.current.getBoundingClientRect();

      // 최소 크기 설정 (모바일에서도 적절한 크기 보장)
      const minSize = 200; // 모바일에서 최소 크기

      if (width > 0 && height > 0) {
        // 최소 크기와 계산된 크기 중 큰 값 사용
        // 단, 부모 컨테이너보다 크지 않도록 제한
        const optimalSize = Math.min(
          Math.max(Math.min(width, height) * 0.9, minSize), // ← 90 %
          Math.min(width, height),
        );

        setSize(optimalSize);
      } else {
        // 초기 렌더링 시 크기가 0인 경우, 기본값 설정
        setSize(minSize);
      }
    }

    // 초기 계산
    calculateOptimalSize();

    // 리사이즈 감지
    const ro = new ResizeObserver(calculateOptimalSize);
    if (wrapperRef.current) {
      ro.observe(wrapperRef.current);
    }

    // 컴포넌트가 마운트된 후 일정 시간 후에 다시 계산
    const recalculateTimer = setTimeout(() => {
      calculateOptimalSize();
    }, 300);

    return () => {
      ro.disconnect();
      clearTimeout(initialTimer);
      clearTimeout(recalculateTimer);
    };
  }, []);

  /* ───── ApexCharts 옵션 ───── */
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'donut',
      toolbar: { show: false },
      // 반응형 설정 강화
      animations: {
        enabled: true,
        speed: 300,
      },
      // 모바일에서도 잘 보이도록 패딩 조정
      sparkline: {
        enabled: false, // 작은 화면에서도 전체 차트 유지
      },
    },
    labels: ['분석', '작성'],
    colors: ['#B4C7FF', '#FFB4B5'],
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '16px', // 모바일 대응 폰트 크기 약간 축소
        fontFamily: 'Pretendard',
        fontWeight: 600,
      },
      formatter: (_v, o) => `${o.w.config.series[o.seriesIndex]}개`,
      dropShadow: { enabled: true, top: 1, left: 1, blur: 2, opacity: 0.4 },
    },
    tooltip: { enabled: false },
    legend: { show: false },
    states: { hover: { filter: { type: 'none' } } },
    plotOptions: {
      pie: {
        // 모바일에서도 적절한 크기를 유지하도록 설정
        offsetX: 0,
        offsetY: 0,
        customScale: 0.9, // 작은 화면에서도 크기 유지
        donut: {
          size: '50%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '22px', // 모바일 대응 폰트 크기 약간 축소
              offsetY: -8,
              fontFamily: 'Pretendard',
              fontWeight: 600,
            },
            value: {
              show: true,
              fontSize: '20px', // 모바일 대응 폰트 크기 약간 축소
              offsetY: 16,
              fontFamily: 'Pretendard',
              fontWeight: 600,
            },
            total: {
              show: true,
              label: '전체',
              fontSize: '24px', // 모바일 대응 폰트 크기 약간 축소
              fontFamily: 'Pretendard',
              fontWeight: 600,
              color: '#202020',
              formatter: (w) =>
                w.globals.seriesTotals.reduce(
                  (a: number, b: number) => a + b,
                  0,
                ),
            },
          },
        },
      },
    },
    // 반응형 설정 추가
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 240, // 모바일에서 최소 높이 설정
          },
          plotOptions: {
            pie: {
              customScale: 1.1, // 작은 화면에서 차트 크기 약간 확대
              donut: {
                labels: {
                  name: { fontSize: '20px' },
                  value: { fontSize: '18px' },
                  total: { fontSize: '22px' },
                },
              },
            },
          },
        },
      },
    ],
  };

  /* ───── 렌더 ───── */
  return (
    <div
      ref={wrapperRef}
      className="w-full h-full flex items-center justify-center overflow-visible"
      // 최소 높이 설정으로 컨테이너가 0 크기가 되는 것 방지
      style={{ minHeight: '240px' }}
    >
      {/* 항상 차트 렌더링 (size는 이제 항상 존재) */}
      <div
        className="flex items-center justify-center"
        style={{ minHeight: '240px' }}
      >
        <ReactApexChart
          key={`${series.join('-')}-${size}`}
          options={options}
          series={series}
          type="donut"
          width={size}
          height={size}
        />
      </div>
    </div>
  );
};
