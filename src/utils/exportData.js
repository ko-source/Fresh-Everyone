import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export const exportDataToXLSX = (dataJSON, filename) => {

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

  const ws = XLSX.utils.json_to_sheet(dataJSON);
  const wb = { Sheets: { Orders: ws }, SheetNames: ['Orders'] };
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, filename + '.xlsx');

}
