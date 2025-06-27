import React from "react"
import {Link} from "react-router-dom"
import PageHeader from "../../shared/Header.tsx"
import Button from "../../shared/Button.tsx"
import MainLayout from "../../shared/MainLayout.tsx"

const Auth: React.FC = () => {
	return <MainLayout>
		<PageHeader pageName="Аутентификация"/>
		<Link to="/auth/login"><Button className="w-full mb-4">Войти</Button></Link>
		<Link to="/auth/register"><Button className="w-full">Зарегестрироваться</Button></Link>
	</MainLayout>
}

export default Auth;