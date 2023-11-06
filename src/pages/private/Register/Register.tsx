/* import { FormSinglePage } from '@/components' */
import { GlobalColors, PrivateRoutes } from '@/models'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack
} from '@chakra-ui/react'
import { Field, Formik, FormikHelpers } from 'formik'
import { useState } from 'react'
import * as Yup from 'yup'
import { Roles } from '@/models'
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { registerNewUserService } from '@/services'

const Register = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState<boolean>()
  const [logInErrorMessage, setLogInErrorMessage] = useState<string>()

  const [showPass, setShowPass] = useState(false)
  const handleClickShowPass = () => setShowPass(!showPass)

  interface MyFormValues {
    name: string
    username: string
    email: string
    password: string
    role: string
  }

  const initialValues: MyFormValues = {
    name: '',
    username: '',
    email: '',
    password: '',
    role: ''
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('NOMBRE OBLIGATORIO'),
    username: Yup.string().required('USUARIO OBLIGATORIO'),
    email: Yup.string().required('NOMBRE OBLIGATORIO'),
    password: Yup.string().required('CONTRASEÑA OBLIGATORIA'),
    role: Yup.string().required('SELECCIONA UN ROL')
  })

  const onSubmit = async (
    data: MyFormValues,
    actions: FormikHelpers<MyFormValues>
  ) => {
    setIsSubmitting(true)
    registerNewUserService(data)
      .then(() => {
        actions.resetForm({})
      })
      .catch(() => {
        setLogInErrorMessage('Ha ocurrido un error al crear el usuario.')
      })
    setIsSubmitting(false)
  }

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
            Registrar Empleado
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
                    formik.errors.name && formik.touched.name
                  )}>
                  <FormLabel p={0} m={0}>
                    Nombre:
                  </FormLabel>
                  <Field
                    type='string'
                    name='name'
                    placeholder='Nombre'
                    as={Input}
                  />
                  <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={Boolean(
                    formik.errors.username && formik.touched.username
                  )}>
                  <FormLabel p={0} m={0}>
                    Usuario:
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
                    formik.errors.email && formik.touched.email
                  )}>
                  <FormLabel p={0} m={0}>
                    Correo:
                  </FormLabel>
                  <Field
                    type='string'
                    name='email'
                    placeholder='Correo'
                    as={Input}
                  />
                  <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={Boolean(
                    formik.errors.password && formik.touched.password
                  )}>
                  <FormLabel p={0} m={0}>
                    Contraseña:
                  </FormLabel>
                  <InputGroup size='md'>
                    <Field
                      type={showPass ? 'text' : 'password'}
                      name='password'
                      placeholder='Contraseña'
                      as={Input}
                    />
                    <InputRightElement width='4.5rem'>
                      <Button
                        size={'sm'}
                        onClick={() => {
                          handleClickShowPass()
                        }}>
                        <Icon
                          as={showPass ? BsFillEyeFill : BsFillEyeSlashFill}
                        />
                      </Button>
                    </InputRightElement>
                  </InputGroup>
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
                <RadioGroup>
                  <Stack direction='row'>
                    <FormControl
                      isInvalid={Boolean(
                        formik.errors.role && formik.touched.role
                      )}>
                      <FormLabel p={0} m={0}>
                        Rol:
                      </FormLabel>
                      <Flex
                        gap={2}
                        justifyContent={'center'}
                        alignItems={'center'}
                        alignContent={'center'}>
                        <Field
                          type='radio'
                          name='role'
                          as={Radio}
                          value={Roles.REGULAR}>
                          REGULAR
                        </Field>
                        <Field
                          type='radio'
                          name='role'
                          as={Radio}
                          value={Roles.ADMIN}>
                          ADMIN
                        </Field>
                      </Flex>
                      <FormErrorMessage>
                        {formik.errors.password}
                      </FormErrorMessage>
                    </FormControl>
                  </Stack>
                </RadioGroup>
                <Flex m={'0 auto'} gap={2}>
                  <Button
                    type='submit'
                    isLoading={isSubmitting}
                    bgGradient={GlobalColors.SENDMESSAGEBUTTON}
                    _hover={{
                      bgGradient: GlobalColors.SENDMESSAGEBUTTONHOVER
                    }}
                    p={6}
                    borderRadius={18}>
                    Registrar
                  </Button>
                  <Button
                    type='submit'
                    bgGradient={GlobalColors.SENDMESSAGEBUTTON}
                    _hover={{
                      bgGradient: GlobalColors.SENDMESSAGEBUTTONHOVER
                    }}
                    p={6}
                    onClick={() => {
                      navigate(`/${PrivateRoutes.PRIVATE}`)
                    }}
                    borderRadius={18}>
                    Volver
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

export default Register
