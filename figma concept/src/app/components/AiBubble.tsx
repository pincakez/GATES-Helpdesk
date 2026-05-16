interface ComparisonTable {
  headers: string[];
  rows: string[][];
}

interface AiBubbleProps {
  content: string;
  timestamp: string;
  image?: string;
  table?: ComparisonTable;
}

export function AiBubble({ content, timestamp, image, table }: AiBubbleProps) {
  return (
    <div className="flex flex-col items-start gap-1">
      <div className="bg-white border border-gray-100 shadow-sm text-gray-800 text-sm px-3.5 py-2.5 rounded-2xl rounded-bl-sm max-w-[90%] leading-relaxed">
        <div dir="auto">{content}</div>

        {image && (
          <img
            src={image}
            alt="Product"
            className="mt-2 rounded-xl max-w-[200px] w-full object-cover"
          />
        )}

        {table && (
          <div className="mt-3 overflow-x-auto">
            <table className="text-xs border-collapse w-full">
              <thead>
                <tr className="bg-[#f0fdf4]">
                  {table.headers.map((h) => (
                    <th
                      key={h}
                      className="px-2.5 py-1.5 text-left font-semibold text-[#166534] border border-gray-200 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-[#f8f9fb]"}
                  >
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className="px-2.5 py-1.5 border border-gray-200 text-gray-700"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <span className="text-[10px] text-gray-400 px-1">{timestamp}</span>
    </div>
  );
}
