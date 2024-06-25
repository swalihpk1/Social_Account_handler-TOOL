import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../app/store";
import { useSelector } from "react-redux"


const PrivateRoute: React.FC = () => {
    const userInfo = useSelector((state: RootState) => state.auth.userInfo);
    return userInfo ? <Outlet /> : <Navigate to='/login' replace />
}

export default PrivateRoute; 