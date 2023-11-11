import ReactScrollToTop from "react-scroll-to-top"

export default function ScrollToTop() {
    return <ReactScrollToTop smooth={true} style={{boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'}} className='grid place-content-center shadow text-blue-500 hover:text-blue-700 shadow-sm' component={<span className="material-symbols-outlined">keyboard_double_arrow_up</span>}/>
}