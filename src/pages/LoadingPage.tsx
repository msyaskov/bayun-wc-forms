export default function LoadingPage() {
    return <div className='fixed grid place-content-center inset-0 bg-white z-[9999]'>
        <div className='text-center space-y-8'>
            <div><span className="loading loading-ring ring-blue-500 w-40"></span></div>
            <div>Loading..</div>
        </div>
    </div>
}