const PaginationFull = ({ page, totalPages, onPageChange }) => {
  if (totalPages < 1) return null

  const maxVisible = 7
  const currentSet = Math.floor((page - 1) / maxVisible)
  const startPage = currentSet * maxVisible + 1
  const endPage = Math.min(startPage + maxVisible - 1, totalPages)

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  )

  return (
    <div className="flex my-3 items-center justify-end text-gray-500 dark:text-gray-300">
      <div className="flex border divide-x border-gray-300 divide-gray-300 dark:divide-gray-700 dark:border-gray-700">
        <button
          disabled={page === 1}
          className="font-bold w-9 h-9 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(1)}
        >
          {'<<'}
        </button>
        <button
          disabled={page === 1}
          className="text-base font-bold w-9 h-9 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(page - 1)}
        >
          {'<'}
        </button>

        {pages.map(item => (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={`w-9 h-9 text-base font-semibold ${
              item === page
                ? 'text-black border border-blue-500 cursor-pointer dark:bg-blue-600 bg-blue-50'
                : 'dark:bg-gray-800 cursor-pointer bg-blue-50 hover:bg-blue-100 dark:hover:bg-gray-700'
            }`}
          >
            {item}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          className="text-base font-bold w-9 h-9 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(page + 1)}
        >
          {'>'}
        </button>
        <button
          disabled={page === totalPages}
          className="text-base font-bold w-9 h-9 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(totalPages)}
        >
          {'>>'}
        </button>
      </div>
    </div>
  )
}

export default PaginationFull