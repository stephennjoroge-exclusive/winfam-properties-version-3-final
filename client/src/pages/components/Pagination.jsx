const Pagination = ({ page, totalPages, onPageChange }) => {
    return (
        <div className="flex items-center text-gray-500 dark:text-gray-300">
            <div className="flex  border divide-x h-7 border-gray-300 divide-gray-300 dark:divide-gray-700 dark:border-gray-700">   
                <button disabled={page === 1} className="text-base font-bold w-9 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => {onPageChange(1)}}>{'<<'}</button>
                <button disabled={page === 1} className="text-base font-bold w-9 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => {onPageChange(page - 1)}}>{'<'}</button>
                <div>
                    <span className="text-lg font-bold w-10 px-3 py-1">{page}</span>
                </div>
                <button disabled={page === totalPages} className="text-base font-bold disabled:opacity-50 w-9 disabled:cursor-not-allowed" onClick={() => {onPageChange(page + 1)}}>{'>'}</button>
                <button disabled={page === totalPages} className="text-base font-bold w-9 disabled:cursor-not-allowed" onClick={() => {onPageChange(totalPages)}}>{'>>'}</button>
            </div>
        </div>
    )
}

export default Pagination