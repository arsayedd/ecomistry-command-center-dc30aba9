
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DataTableProps<T> {
  columns: {
    key: string;
    header: string;
    cell: (item: T) => React.ReactNode;
  }[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  colSpan?: number;
}

export function DataTable<T>({ 
  columns, 
  data, 
  isLoading = false, 
  emptyMessage = "لا توجد بيانات متوفرة", 
  colSpan = 4
}: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={colSpan} className="h-24 text-center">
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            </TableCell>
          </TableRow>
        ) : data.length > 0 ? (
          data.map((item, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={`${index}-${column.key}`}>{column.cell(item)}</TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={colSpan} className="h-24 text-center">
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
