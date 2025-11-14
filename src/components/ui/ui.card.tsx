export function LuraschiCard({children}: {children?: React.ReactNode}) {
    return (
        <div className="my-5 border border-sky-500 bg-slate-900/80 text-white rounded-lg p-5">
            {children}
        </div>  
    )
}