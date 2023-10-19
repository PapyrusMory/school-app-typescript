import { useContext, useEffect } from 'react'
import { Button, Col, Form, Input, message, Row } from 'antd'
import '../../resources/authentication.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { Store } from '../../redux/Store'
import { useLoginMutation } from '../../hooks/userHooks'

const Login = () => {
  const navigate = useNavigate()
  const { search } = useLocation()
  const redirectInUrl = new URLSearchParams(search).get('redirect')
  const redirect = redirectInUrl ? redirectInUrl : '/'
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { userInfo } = state

  interface FormValues {
    name: string
    password: string
  }

  const { mutateAsync: login, isPending } = useLoginMutation()

  const onFinish = async (values: FormValues) => {
    try {
      const data = await login(values)
      ctxDispatch({ type: 'USER_SIGNIN', payload: data })
      localStorage.setItem('userInfo', JSON.stringify(data))
      message.success(
        `Connexion réussie. Content de vous revoir ${values.name}`
      )
      navigate(redirect || '/')
    } catch (error) {
      message.error('Quelque chose ne va pas')
    }
  }

  useEffect(() => {
    const ac = new AbortController()
    if (userInfo) {
      navigate(redirect)
    }
    return () => ac.abort()
  }, [redirect, userInfo, navigate])

  return (
    <div className='authentication'>
      <Row>
        <Col lg={8} xs={22}>
          <Form
            initialValues={{ remember: true }}
            layout='vertical'
            onFinish={onFinish}
          >
            <h1>
              <b>SCHOOL-APP 2.0</b>
            </h1>
            <hr />
            <h2 className='form-title'>Connexion</h2>

            <Form.Item name='name' label='Nom'>
              <Input />
            </Form.Item>
            <Form.Item name='password' label='Mot de passe'>
              <Input type='password' />
            </Form.Item>

            <div className='d-flex justify-content-between align-items-center'>
              <Button disabled={isPending} htmlType='submit' type='primary'>
                Valider
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  )
}

export default Login
