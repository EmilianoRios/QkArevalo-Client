/* import { FormSinglePage } from '@/components' */
import { GlobalColors, PrivateRoutes } from '@/models'
import { createUser, resetUser } from '@/redux'
import { logInUserService } from '@/services'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack
} from '@chakra-ui/react'
import { AxiosError } from 'axios'
import { Field, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

const Login = () => {
  const authState = useSelector(
    (state: { user: { id: string; name: string; role: string } }) => state.user
  )
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState<boolean>()
  const [logInErrorMessage, setLogInErrorMessage] = useState<string>()

  interface MyFormValues {
    username: string
    password: string
  }

  const initialValues: MyFormValues = {
    username: '' as string,
    password: '' as string
  }

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('USUARIO OBLIGATORIO'),
    password: Yup.string().required('CONTRASEÑA OBLIGATORIA')
  })

  const onSubmit = async (data: MyFormValues) => {
    setIsSubmitting(true)
    try {
      const userData = await logInUserService(data)
      dispatch(resetUser())
      dispatch(createUser(userData))
      setIsSubmitting(false)
      navigate(`/${PrivateRoutes.PRIVATE}`)
    } catch (error) {
      setIsSubmitting(false)
      if (error instanceof AxiosError) {
        setLogInErrorMessage(
          error?.response?.data?.error ||
            'Ha ocurrido un error intentelo más tarde.'
        )
      } else {
        setLogInErrorMessage('Ha ocurrido un error intentelo más tarde.')
      }
    }
  }

  useEffect(() => {
    const goToDashBoard = () => {
      navigate(`/${PrivateRoutes.PRIVATE}`)
    }
    if (authState.id) {
      goToDashBoard()
    }
  }, [navigate, authState.id])

  return (
    <Flex
      flexDirection={'column'}
      justifyContent={'center'}
      justifyItems={'center'}
      alignContent={'center'}
      alignItems={'center'}
      h={'100vh'}
      m={'0 auto'}>
      <Flex
        display={'column'}
        pt={4}
        px={4}
        bg={GlobalColors.BGCONTENT}
        border='1px solid'
        rounded={20}
        borderColor={GlobalColors.BORDERCONTENT}
        w={{ base: '80%', md: '80%', lg: '10%' }}
        maxW={{ base: '400px', lg: '400px' }}
        minW={{ lg: '400px' }}>
        <Flex alignItems={'center'} justifyContent={'center'}>
          <Heading
            as='h3'
            id='principalTitle'
            pb={4}
            fontSize={{ base: '24px', sm: '24px', md: '24px', lg: '34px' }}>
            Iniciar Sesión
          </Heading>
        </Flex>
        <Formik
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          initialValues={initialValues}>
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <VStack pb={4} justifyContent={'start'} alignItems={'start'}>
                <FormControl
                  isInvalid={Boolean(
                    formik.errors.username && formik.touched.username
                  )}>
                  <FormLabel p={0} m={0}>
                    Tu usuario:
                  </FormLabel>
                  <Field
                    type='string'
                    name='username'
                    placeholder='Usuario'
                    as={Input}
                  />
                  <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={Boolean(
                    formik.errors.password && formik.touched.password
                  )}>
                  <FormLabel p={0} m={0}>
                    Tu contraseña:
                  </FormLabel>
                  <Field
                    type='password'
                    name='password'
                    placeholder='Contraseña'
                    as={Input}
                  />
                  <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                </FormControl>
                {logInErrorMessage ? (
                  <Box
                    m={'0 auto'}
                    p={1}
                    borderRadius={10}
                    bgClip={'text'}
                    bgGradient={GlobalColors.WARNINGCOLOR}>
                    <Text as='b'>{logInErrorMessage}</Text>
                  </Box>
                ) : (
                  ''
                )}
                <Flex m={'0 auto'}>
                  <Button
                    type='submit'
                    isLoading={isSubmitting}
                    bgGradient={GlobalColors.SENDMESSAGEBUTTON}
                    _hover={{
                      bgGradient: GlobalColors.SENDMESSAGEBUTTONHOVER
                    }}
                    p={6}
                    borderRadius={18}>
                    Ingresar
                  </Button>
                </Flex>
              </VStack>
            </form>
          )}
        </Formik>
      </Flex>
    </Flex>
  )
}

export default Login
