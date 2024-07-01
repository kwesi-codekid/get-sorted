import { ReactNode } from "react";
import {
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
} from "@nextui-org/react";

import noDataIllustration from "~/assets/illustrations/no-data.svg";

const CustomTable = ({
  columns,
  loadingState,
  children,
  page,
  setPage,
  totalPages,
  customHeightClass,
}: {
  columns: string[];
  loadingState: any;
  children: ReactNode | any;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  customHeightClass?: string;
}) => {
  return (
    <div className="h-full flex flex-col gap-1">
      <Table
        aria-label="data table"
        classNames={{
          base: `${
            customHeightClass
              ? customHeightClass
              : "md:!h-[78vh] font-nunito text-xs"
          } h-[65vh] overflow-y-auto w-screen md:w-full overflow-x-auto  shadow-none`,
          wrapper:
            "dark:bg-slate-900 vertical-scrollbar horizontal-scrollbar shadow-none bg-white rounded-2xl dark:border border-white/5",
          th: "dark:bg-slate-800",
          td: "text-sm",
        }}
      >
        <TableHeader>
          {columns.map((column, index: number) => (
            <TableColumn
              key={index}
              className={`font-montserrat text-text-sm dark:text-white`}
            >
              {column}
            </TableColumn>
          ))}
        </TableHeader>

        <TableBody
          loadingState={loadingState}
          loadingContent={<Spinner />}
          emptyContent={
            <div className="md:!h-[65vh] h-[60vh] flex flex-col gap-8 items-center justify-center">
              <img src={noDataIllustration} alt="No data" className="w-1/3" />
              <p className="text-center text-slate-500 dark:text-slate-400 font-montserrat font-semibold text-lg">
                No data available
              </p>
            </div>
          }
        >
          {children}
        </TableBody>
      </Table>

      <div className="flex w-full items-center justify-between">
        {totalPages > 1 && (
          <Pagination
            page={page}
            total={totalPages}
            onChange={(page: number) => setPage(page)}
            color="primary"
            showControls
            showShadow
            size="sm"
            classNames={{
              item: "font-montserrat font-semibold bg-white dark:bg-slate-800 dark:text-white",
              next: "font-montserrat font-semibold bg-white dark:bg-slate-800 dark:text-white",
              prev: "font-montserrat font-semibold bg-white dark:bg-slate-800 dark:text-white",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CustomTable;
