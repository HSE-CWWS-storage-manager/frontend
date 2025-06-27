import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {Auth, Login, Register} from '../pages/Auth'
import RoleRedirect from "./RoleRedirect.tsx";
import React from "react";
import AppStore from "./store/AppStore.ts";
import AppApi from "./api/AppApi.ts";
import AppContext from "./context/AppContext.ts";
import Admin from "../pages/Admin";
import ProtectedRoute from "./ProtectedRoute.tsx";
import WaitPage from "../pages/User";
import MainMenu from "../pages/Operator/Pages/MainMenu.tsx";
import {EquipmentMenu} from "../pages/Operator";
import ScanPage from "../pages/Operator/Pages/ScanPage.tsx";
import EquipmentPage from "../pages/Operator/Pages/EquipmentPage.tsx";
import AppService from "./service/AppService.ts";
import GiveMenu from "../pages/Operator/Pages/GiveMenu.tsx";
import ReturnMenu from "../pages/Operator/Pages/ReturnMenu.tsx";
import AccountingMenu from "../pages/Operator/Pages/Accountings.tsx";

const store = new AppStore()
const api = new AppApi(store)
const service = new AppService(store, api)

const App: React.FC = () => {

    return (
        <AppContext.Provider value={{store, api, service}}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<RoleRedirect />}/>
                    <Route path='/auth'>
                        <Route index element={<Auth/>}/>
                        <Route path='login' element={<Login/>}/>
                        <Route path='register' element={<Register/>}/>
                    </Route>
                    <Route element={<ProtectedRoute requiredRole={"Operator"}/>}>
                        <Route path='/operator'>
                            <Route index element={<MainMenu/>}/>
                            <Route path='equipment/:id' element={<EquipmentPage/>}/>
                            <Route path='equipment/give/:id' element={<GiveMenu/>}/>
                            <Route path='equipment/return/:id' element={<ReturnMenu/>}/>
                            <Route path='equipment' element={<EquipmentMenu/>}/>
                            <Route path='scan' element={<ScanPage/>}/>
                            <Route path='accounting' element={<AccountingMenu/>}/>
                        </Route>
                    </Route>
                    <Route element={<ProtectedRoute requiredRole={"Admin"}/>}>
                        <Route path='/admin' element={<Admin/>} />
                    </Route>
                    <Route element={<ProtectedRoute requiredRole={"User"}/>}>
                        <Route path='/user' element={<WaitPage/>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AppContext.Provider>
    )
}

export default App
