import { AgGridReact } from 'ag-grid-react';
import {
  ModuleRegistry,
  ClientSideRowModelModule,
  ValidationModule,
  RowSelectionModule,
  GridOptions,
  ColumnAutoSizeModule,
  CellStyleModule,
} from 'ag-grid-community';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Contract } from '@/features/mypage/model/types';
import './ContractTable.css';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule,
  RowSelectionModule,
  ColumnAutoSizeModule,
  CellStyleModule,
]);

interface ContractTableProps {
  rowData: Contract[];
}

const ContractTable: React.FC<ContractTableProps> = ({ rowData }) => {
  const gridOptions: GridOptions = {
    rowSelection: 'multiple', // 여러 행을 선택 가능하게 설정
  };

  const colDefs: ColDef[] = [
    {
      headerName: '',
      checkboxSelection: true,
      width: 80,
      suppressSizeToFit: true,

    },
    {
      headerName: '분류',
      field: 'source_type',
      valueFormatter: (params) =>
        params.value === 'USER_UPLOAD' ? '작성' : '분석',
      cellClassRules: {
        // 필드값이 USER_UPLOAD일 때 .written, SERVICE_GENERATED일 때 .analyzed
        written: (params) => params.value === 'USER_UPLOAD',
        analyzed: (params) => params.value === 'SERVICE_GENERATED',
      },
    },
    { headerName: '계약서 명', field: 'title' },
    { headerName: '최종 수정일', field: 'created_at' },
    { headerName: '다운로드', 
      field: 'download',}
  ];

  return (
    <div className="ag-theme-alpine w-full  h-[100%]">
      <AgGridReact
        gridOptions={gridOptions}
        headerHeight={50}
        rowHeight={55}
        rowData={rowData}
        columnDefs={colDefs}
        suppressMovableColumns={true}
        suppressNoRowsOverlay={false}
        domLayout="autoHeight"
      />
    </div>
  );
};
export default ContractTable;
