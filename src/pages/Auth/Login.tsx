import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import MainLayout from "../../shared/MainLayout.tsx";
import PageHeader from "../../shared/Header.tsx";
import Button from "../../shared/Button.tsx";
import {useAppContext} from "../../app/context/AppContext.ts";
import {AxiosError} from "axios";

enum PageState {
    Loading,
    Error,
    Idle
}

const Login: React.FC = () => {
    const { api } = useAppContext()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [errorMessage, setErrorMessage] = useState('')
    const [state, setState] = useState(PageState.Idle)
    const navigate = useNavigate()

    const login = async (e: React.FormEvent) => {
        e.preventDefault()
        setState(PageState.Loading)

        api.auth.login(email, password)
            .then(() => {
                navigate("/")
            })
            .catch((e: AxiosError) => {
                setState(PageState.Error)
                let error = "Произошла непредвиденная ошибка"

                if (e.status === 403) {
                    error = "Неправильная почта или пароль"
                }

                setErrorMessage(error)
            })
    }

    return <MainLayout>
        <>
            <PageHeader pageName="Вход" backlink="/auth" />
            { state == PageState.Error && <p className="text-red-500 mb-4">{errorMessage}</p> }
            { state == PageState.Loading && <p className="mb-4">Загрузка...</p> }
            { state != PageState.Loading &&
                <form onSubmit={login}>
                    <input
                        type="email"
                        placeholder="Электронная почта"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 mb-4 border rounded"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 mb-4 border rounded"
                        required
                    />
                    <Button type="submit" className="w-full">
                        Войти
                    </Button>
                </form>
            }
        </>
    </MainLayout>
}

export default Login