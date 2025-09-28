import { Outlet } from 'react-router';
import Navbar from '../Shared/Navbar';



const Main = () => {
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    );
};

export default Main;