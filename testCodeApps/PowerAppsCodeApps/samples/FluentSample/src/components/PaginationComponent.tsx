import { 
  Button, 
  Text, 
  makeStyles, 
  shorthands,
  Dropdown,
  Option
} from '@fluentui/react-components';
import { 
  ChevronLeftRegular, 
  ChevronRightRegular,
  ChevronDoubleLeftRegular,
  ChevronDoubleRightRegular
} from '@fluentui/react-icons';
import type { PaginationState, PaginationControls } from '../hooks/usePagination';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.gap('16px'),
    ...shorthands.padding('16px', '0'),
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  pageInfo: {
    fontSize: '14px',
    color: '#605e5c',
  },
  pageSizeContainer: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  dropdown: {
    minWidth: '80px',
  },
});

interface PaginationComponentProps {
  paginationState: PaginationState;
  paginationControls: PaginationControls;
  showPageSizeSelector?: boolean;
  pageSizeOptions?: number[];
}

export default function PaginationComponent({
  paginationState,
  paginationControls,
  showPageSizeSelector = true,
  pageSizeOptions = [5, 10, 20, 50],
}: PaginationComponentProps) {
  const styles = useStyles();
  const { currentPage, pageSize, totalItems, totalPages } = paginationState;
  const { goToPage, nextPage, previousPage, setPageSize, canGoNext, canGoPrevious } = paginationControls;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <Button
          icon={<ChevronDoubleLeftRegular />}
          appearance="subtle"
          disabled={!canGoPrevious}
          onClick={() => goToPage(1)}
          title="First page"
        />
        <Button
          icon={<ChevronLeftRegular />}
          appearance="subtle"
          disabled={!canGoPrevious}
          onClick={previousPage}
          title="Previous page"
        />
        
        <Text className={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </Text>
        
        <Button
          icon={<ChevronRightRegular />}
          appearance="subtle"
          disabled={!canGoNext}
          onClick={nextPage}
          title="Next page"
        />
        <Button
          icon={<ChevronDoubleRightRegular />}
          appearance="subtle"
          disabled={!canGoNext}
          onClick={() => goToPage(totalPages)}
          title="Last page"
        />
      </div>

      <div className={styles.controls}>
        <Text className={styles.pageInfo}>
          Showing {startItem}-{endItem} of {totalItems} items
        </Text>
        
        {showPageSizeSelector && (
          <div className={styles.pageSizeContainer}>
            <Text size={200}>Items per page:</Text>
            <Dropdown
              className={styles.dropdown}
              value={pageSize.toString()}
              onOptionSelect={(_, data) => {
                if (data.optionValue) {
                  setPageSize(parseInt(data.optionValue));
                }
              }}
            >
              {pageSizeOptions.map(size => (
                <Option key={size} value={size.toString()} text={size.toString()}>
                  {size}
                </Option>
              ))}
            </Dropdown>
          </div>
        )}
      </div>
    </div>
  );
}
