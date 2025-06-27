import type AppApi from "../api/AppApi.ts";
import type AppStore from "../store/AppStore";
import React, {useContext} from "react";
import type AppService from "../service/AppService.ts";

interface IAppContext {
    store: AppStore;
    api: AppApi;
    service: AppService;
}

const AppContext = React.createContext<null | IAppContext>(null);

export const useAppContext = () => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error('useAppContext must be used within a AppContext');
    }

    return context as IAppContext;
}

export default AppContext;