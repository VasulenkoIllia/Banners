import {Content, Header} from "antd/es/layout/layout";
import {Layout} from "antd";
import {Link, Outlet, useLocation} from "react-router-dom";

const menuItems = [
    {
        key: '/',
        label: 'Dashboard',
    },
    {
        key: '/materials',
        label: 'Materials',
    },
    {
        key: '/customers',
        label: 'Customers',
    },
    {
        key: '/products',
        label: 'Products',
    },
    {
        key: '/orders',
        label: 'Orders',
    },
    {
        key: '/expenses',
        label: 'Expense',
    },
];

export default function AppLayout() {
    const location = useLocation();

    return (
        <Layout>
            <Header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#fff',
                borderBottom: '1px solid rgba(5, 5, 5, 0.06)'
            }}>

                <div className="logo" style={{width: '100%'}}>
                    LOGO
                </div>

                <div className={'flex gap-4'}>
                    {menuItems.map((item) => (
                        <Link
                            to={item.key}
                            key={item.key}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '4px',
                                backgroundColor: location.pathname === item.key ? '#7793ac' : 'transparent',
                                color: location.pathname === item.key ? '#fff' : '#000',
                                textDecoration: 'none',
                            }}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </Header>

            <Content style={{padding: '24px 48px'}}>
                <Outlet/>
            </Content>
        </Layout>
    );
}
