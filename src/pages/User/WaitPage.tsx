import React from "react";
import MainLayout from "../../shared/MainLayout.tsx";
import PageHeader from "../../shared/Header.tsx";

const WaitPage: React.FC = () => {
    return <MainLayout>
        <PageHeader pageName="Ожидайте подтверждения администратором" />
    </MainLayout>
}

export default WaitPage