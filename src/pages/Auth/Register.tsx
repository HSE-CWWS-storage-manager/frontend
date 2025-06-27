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

const Register: React.FC = () => {
    const { api } = useAppContext()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [errorMessage, setErrorMessage] = useState('')
    const [state, setState] = useState(PageState.Idle)
    const navigate = useNavigate()

    const register = async (e: React.FormEvent) => {
        e.preventDefault()
        setState(PageState.Loading)

        try {
            await api.auth.register(email, password, confirmPassword)
            navigate("/")
        } catch (e) {
            setState(PageState.Error)

            let error = "Произошла непредвиденная ошибка"

            if (e instanceof AxiosError) {
                if (e.status === 500) {
                    error = "Данная почта уже занята"
                }
            }

            setErrorMessage(error)
        }
    }

    return <MainLayout>
        <>
            <PageHeader pageName="Регистрация" backlink="/auth" />
            { state == PageState.Error && <p className="text-red-500 mb-4">{errorMessage}</p> }
            { state == PageState.Loading && <p className="mb-4">Загрузка...</p> }
            { state == PageState.Idle &&
                <form onSubmit={register}>
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
                    <input
                        type="password"
                        placeholder="Подтвердите пароль"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 mb-4 border rounded"
                        required
                    />
                    <Button type="submit" className="w-full">
                        Зарегестрироваться
                    </Button>
                </form>
            }
        </>
    </MainLayout>
}

export default Register