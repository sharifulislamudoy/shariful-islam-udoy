import { Outlet } from 'react-router';
import Navbar from '../Shared/Navbar';
import CustomCursor from '../components/Custom-Cursor/CustomCursor';



const Main = () => {
    return (
        <div>
            <Navbar />
            <Outlet />
            <CustomCursor />
        </div>
    );
};

export default Main;