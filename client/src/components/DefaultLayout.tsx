import React, { useContext, useEffect, useState } from 'react'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  HomeOutlined,
  CopyOutlined,
  ShoppingOutlined,
  UnorderedListOutlined,
  LoginOutlined,
  StockOutlined,
  ShoppingCartOutlined,
  VerticalAlignBottomOutlined,
  FallOutlined,
  TeamOutlined,
  TagsOutlined,
  ShopOutlined,
} from '@ant-design/icons'
import { Layout, Menu, theme } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { Props } from '../types/Props'
import '../resources/layout.css'
import { Store } from '../redux/Store'

const { Header, Sider, Content, Footer } = Layout

const DefaultLayout: React.FC<Props> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true)

  const toggle = () => {
    setCollapsed(!collapsed)
  }
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window
    return { width, height }
  }

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  )

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions())
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { state, dispatch: ctxDispatch } = useContext(Store)

  const { userInfo } = state

  const location = useLocation()

  const logoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' })
    localStorage.removeItem('userInfo')
    window.location.href = '/login'
  }

  const adminItems = [
    {
      key: '/accueil',
      icon: <HomeOutlined />,
      label: <Link to='/'>Accueil</Link>,
    },
    {
      key: '/cart',
      icon: <ShoppingCartOutlined />,
      label: <Link to='/cart'>Panier</Link>,
    },
    {
      key: '/admin/bilans',
      icon: <StockOutlined />,
      label: <Link to='/admin/bilans'>Bilans</Link>,
    },
    {
      key: '/admin/expenses',
      icon: <FallOutlined />,
      label: <Link to='/admin/expenses'>Dépenses</Link>,
    },
    {
      key: '/admin/users',
      icon: <TeamOutlined />,
      label: <Link to='/admin/users'>Utilisateurs</Link>,
    },
    {
      key: '/admin/categories',
      icon: <TagsOutlined />,
      label: <Link to='/admin/categories'>Catégories</Link>,
    },
    {
      key: '/admin/depots',
      icon: <ShopOutlined />,
      label: <Link to='/admin/depots'>Dépôts</Link>,
    },
    {
      key: '/admin/suppliers',
      icon: <ShoppingOutlined />,
      label: <Link to='/admin/suppliers'>Fournisseurs</Link>,
    },
    {
      key: '/admin/deliveries',
      icon: <VerticalAlignBottomOutlined />,
      label: <Link to='/admin/deliveries'>Livraisons</Link>,
    },
    {
      key: '/bills',
      icon: <CopyOutlined />,
      label: <Link to='/bills'>Factures</Link>,
    },
    {
      key: '/items',
      icon: <UnorderedListOutlined />,
      label: <Link to='/items'>Produits</Link>,
    },
    {
      key: '/customers',
      icon: <UserOutlined />,
      label: <Link to='/customers'>Clients</Link>,
    },
    {
      key: '/logout',
      icon: <LoginOutlined />,
      label: 'Déconnexion',
      onClick: () => logoutHandler(),
    },
  ]

  const items = [
    {
      key: '/accueil',
      icon: <HomeOutlined />,
      label: <Link to='/'>Accueil</Link>,
    },
    {
      key: '/cart',
      icon: <ShoppingCartOutlined />,
      label: <Link to='/cart'>Panier</Link>,
    },
    {
      key: '/bills',
      icon: <CopyOutlined />,
      label: <Link to='/bills'>Factures</Link>,
    },
    {
      key: '/items',
      icon: <UnorderedListOutlined />,
      label: <Link to='/items'>Produits</Link>,
    },
    {
      key: '/customers',
      icon: <UserOutlined />,
      label: <Link to='/customers'>Clients</Link>,
    },
    {
      key: '/logout',
      icon: <LoginOutlined />,
      label: 'Déconnexion',
      onClick: () => logoutHandler(),
    },
  ]

  return (
    <Layout>
      {windowDimensions.width <= 975 ? (
        <>
          <Sider
            trigger={null}
            collapsedWidth={0}
            collapsible
            collapsed={collapsed}
          >
            <div className='logo'>
              <h3>{collapsed ? '' : 'SCHOOL-APP'}</h3>
            </div>
            <Menu
              theme='dark'
              mode='inline'
              defaultSelectedKeys={[location.pathname]}
              items={!userInfo?.isAdmin ? items : adminItems}
            />
          </Sider>
        </>
      ) : (
        <>
          <Sider trigger={null} collapsible collapsed={!collapsed}>
            <div className='logo'>
              <h3>{!collapsed ? 'SA' : 'SCHOOL-APP'}</h3>
            </div>
            <Menu
              theme='dark'
              mode='inline'
              defaultSelectedKeys={[location.pathname]}
              items={!userInfo?.isAdmin ? items : adminItems}
            />
          </Sider>
        </>
      )}
      <Layout className='site-layout'>
        <Header
          className='site-layout-background'
          style={{ padding: 10, background: colorBgContainer }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: 'trigger',
              onClick: toggle,
            }
          )}
        </Header>
        <Content
          className='site-layout-background'
          style={{
            margin: '16px 16px auto',
            padding: 24,
            minHeight: '280',

            background: colorBgContainer,
          }}
        >
          {children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          <b>SCHOOL-APP</b> ©2023 créé par{' '}
          <a target='_blank' href='https://konemory.com'>
            <b className='footer_link'>Koné Mory</b>
          </a>{' '}
          +225 07 09 14 97 47
        </Footer>
      </Layout>
    </Layout>
  )
}

export default DefaultLayout
