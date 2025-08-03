import { Suspense, lazy } from "react";
import { useAppSelector, type RootState } from "../store";
import { Route, Routes } from "react-router-dom";
import { AuthRedirect } from "./AuthRedirect";
import { ProtectedRoute } from "./ProtectedRoutes";

const SignUp = lazy(() => import("../pages/SignUpPage"));
const Login = lazy(() => import("../pages/LoginPage"));
const Home = lazy(() => import("../pages/HomePage"));
const ArticleList = lazy(() => import("../pages/ArticleListPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));

const AppRoutes = () => {
    const { user } = useAppSelector((state: RootState) => state.auth);

    return (
        <Suspense fallback={<span>Loading..</span>}>
             <Routes>
                <Route element={<AuthRedirect user={user} />}>
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                </Route>

                <Route element={<ProtectedRoute user={user} /> }>
                    <Route path="/" element={<Home />} />
                    <Route path="/articles" element={<ArticleList />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>
             </Routes>
        </Suspense>
    )
}

export default AppRoutes;