import type { CSSProperties, ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: ReactNode
  align?: 'left' | 'right'
  wrap?: boolean
  /** Extra classes on both th and td (e.g. width hints). */
  className?: string
  render: (row: T) => ReactNode
}

export function DataTable<T extends object>({
  title,
  columns,
  rows,
  rowKey,
  stickyPageHeader = false,
  stickyOffsetTop = 0,
  titleHeight = 44,
  fixedLayout = false,
  maxBodyHeight,
}: {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  title?: ReactNode
  /** Stick title + column headers to the viewport while the page scrolls. */
  stickyPageHeader?: boolean
  /** Distance from viewport top for the title row (px). */
  stickyOffsetTop?: number
  /** Approximate title bar height used to offset sticky column headers (px). */
  titleHeight?: number
  /** Use fixed column widths (pair with column className width hints). */
  fixedLayout?: boolean
  /** Cap body height and scroll vertically (sticky column headers inside the body). */
  maxBodyHeight?: number | string
}) {
  const titleStyle: CSSProperties | undefined = stickyPageHeader
    ? { top: stickyOffsetTop }
    : undefined
  const headStyle: CSSProperties | undefined = stickyPageHeader
    ? { top: stickyOffsetTop + (title ? titleHeight : 0) }
    : undefined
  const bodyScrollStyle: CSSProperties | undefined = maxBodyHeight
    ? { maxHeight: maxBodyHeight }
    : undefined

  return (
    <div
      className={`flex h-full flex-col rounded-2xl bg-card ${
        stickyPageHeader ? '' : 'overflow-hidden'
      }`}
    >
      {title ? (
        <div
          className={`px-5 py-3 ${
            stickyPageHeader
              ? 'sticky z-20 border-b border-line bg-card shadow-[0_1px_0_0_var(--ds-border-default)]'
              : 'border-b border-line'
          }`}
          style={titleStyle}
        >
          {typeof title === 'string' ? (
            <h3 className="text-sm font-semibold text-navy">{title}</h3>
          ) : (
            title
          )}
        </div>
      ) : null}
      <div
        className={
          stickyPageHeader
            ? 'min-h-0 flex-1'
            : maxBodyHeight
              ? 'min-h-0 overflow-auto'
              : 'min-h-0 flex-1 overflow-x-auto'
        }
        style={bodyScrollStyle}
      >
        <table
          className={`w-full border-separate border-spacing-0 text-sm ${fixedLayout ? 'table-fixed' : ''}`}
        >
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th
                  key={col.key}
                  style={headStyle}
                  className={`border-b border-line bg-card px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-navy-muted ${
                    stickyPageHeader
                      ? 'sticky z-20 bg-card shadow-[0_1px_0_0_var(--ds-border-default)]'
                      : maxBodyHeight
                        ? 'sticky top-0 z-[19] bg-card'
                        : ''
                  } ${col.align === 'right' ? 'text-right' : 'text-left'} ${
                    col.wrap ? '' : 'whitespace-nowrap'
                  } ${i === 0 ? 'pl-5' : ''} ${i === columns.length - 1 ? 'pr-5' : ''} ${
                    col.className ?? ''
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowKey(row)}
                className={`transition-colors ${rowIndex % 2 === 0 ? 'bg-card' : 'bg-slate-50/70'} hover:bg-rg-blue-soft/70`}
              >
                {columns.map((col, i) => (
                  <td
                    key={col.key}
                    className={`border-b border-line/80 px-4 py-3.5 align-middle text-navy ${
                      col.align === 'right' ? 'text-right' : 'text-left'
                    } ${col.wrap ? 'leading-5' : 'whitespace-nowrap'} ${
                      i === 0 ? 'pl-5 font-semibold' : ''
                    } ${i === columns.length - 1 ? 'pr-5' : ''} ${col.className ?? ''}`}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
