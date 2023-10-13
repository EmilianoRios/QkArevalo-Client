import { LayoutPrivate, NavBarPrivate } from '@/components'
import { ClientModelMap, GlobalColors } from '@/models'
import {
  createNewClientService,
  deleteOneClientService,
  getAllClientsService
} from '@/services'
import { formatearDni } from '@/utils'
import {
  Button,
  Card,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack
} from '@chakra-ui/react'
import { Field, Formik, FormikHelpers } from 'formik'
import { useEffect, useState } from 'react'
import { CiMenuKebab } from 'react-icons/ci'
import * as Yup from 'yup'

function Main() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>()
  const [clientErrorForm, setclientErrorForm] = useState<string>()
  const [clientFetchError, setClientFetchError] = useState<string>()
  const [listOfClients, setListOfClients] = useState([])

  interface MyFormValues {
    name: string
    dni: string
  }

  const initialValues: MyFormValues = {
    name: '' as string,
    dni: '' as string
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('NOMBRE OBLIGATORIO'),
    dni: Yup.string()
      .required('DNI OBLIGATORIO')
      .matches(
        /^(\d{8}|\d{2}\.\d{3}\.\d{3})$/,
        'El formato debe ser 12345678 o 12.345.678'
      )
  })

  const onSubmit = async (
    data: MyFormValues,
    actions: FormikHelpers<MyFormValues>
  ) => {
    setIsSubmitting(true)
    const dniFormateado = formatearDni(data.dni)
    try {
      await createNewClientService({ ...data, dni: dniFormateado })
      actions.resetForm()
      setIsSubmitting(false)
    } catch (error) {
      setIsSubmitting(false)
      setclientErrorForm(
        'Ha ocurrido un error al cargar el cliente, intente cerrando sesión y volviendo a ingresar.'
      )
    }
    getAllClients()
  }

  const getAllClients = async () => {
    try {
      const data = await getAllClientsService()
      setListOfClients(data)
    } catch (error) {
      console.log(error)
      setClientFetchError(
        'Ha ocurrido un error al cargar los clientes, intente cerrando sesión y volviendo a ingresar.'
      )
    }
  }

  const deleteOneClient = async (clientId: string) => {
    try {
      await deleteOneClientService(clientId)
      getAllClients()
    } catch (error) {
      getAllClients()
    }
  }

  useEffect(() => {
    getAllClients()
  }, [])

  return (
    <LayoutPrivate>
      <NavBarPrivate title={'Mis Clientes'} />
      <Flex flexDirection={'column'} px={4}>
        <Divider my={4} />
        <Flex h={'70vh'} overflow={'auto'} flexDirection={'column'} gap={2}>
          {listOfClients &&
            listOfClients.map((client: ClientModelMap) => {
              return (
                <Card
                  key={client.id}
                  p={2}
                  bgGradient={GlobalColors.BGWID}
                  border='1px solid'
                  borderColor={GlobalColors.BORDERCONTENT}>
                  <Flex alignItems={'center'} justifyContent={'space-between'}>
                    <Flex flexDirection={'column'} overflow={'hidden'}>
                      <Heading size={'md'} noOfLines={1}>
                        {client.name}
                      </Heading>
                      <Text color={GlobalColors.EMPHASIZED}>{client.dni}</Text>
                    </Flex>
                    <Flex>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<CiMenuKebab />}
                          aria-label='Options'
                          variant='outline'
                        />
                        <MenuList bg={'black'}>
                          <MenuItem
                            bg={'black'}
                            onClick={() => {
                              deleteOneClient(client.id)
                            }}>
                            Eliminar
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Flex>
                  </Flex>
                </Card>
              )
            })}
          {listOfClients?.length === 0 && (
            <VStack pb={12}>
              <Text>
                {clientFetchError
                  ? 'Ha ocurrido un error!.'
                  : '¡Ningún cliente por aquí! 🙂'}
              </Text>
            </VStack>
          )}
        </Flex>
        <Divider my={4} />
        <Flex alignContent={'center'} alignItems={'center'} m={'0 auto'}>
          <VStack>
            <Formik
              onSubmit={onSubmit}
              validationSchema={validationSchema}
              initialValues={initialValues}>
              {(formik) => (
                <form onSubmit={formik.handleSubmit}>
                  <VStack pb={4}>
                    <Flex gap={4} w={'100%'}>
                      <FormControl
                        isInvalid={Boolean(
                          formik.errors.name && formik.touched.name
                        )}>
                        <FormLabel p={0} m={0}>
                          Nombre:
                        </FormLabel>
                        <Field
                          w={'100%'}
                          type='string'
                          name='name'
                          placeholder='Nombre'
                          as={Input}
                        />
                        <FormErrorMessage>
                          {formik.errors.name}
                        </FormErrorMessage>
                      </FormControl>
                      <FormControl
                        isInvalid={Boolean(
                          formik.errors.dni && formik.touched.dni
                        )}>
                        <FormLabel p={0} m={0}>
                          DNI:
                        </FormLabel>
                        <Field
                          type='string'
                          name='dni'
                          placeholder='DNI'
                          as={Input}
                        />
                        <FormErrorMessage>{formik.errors.dni}</FormErrorMessage>
                      </FormControl>
                    </Flex>
                    {clientErrorForm ? (
                      <Flex
                        alignItems={'center'}
                        justifyContent={'center'}
                        m={'0 auto'}
                        p={1}
                        borderRadius={10}
                        bgClip={'text'}
                        bgGradient={GlobalColors.WARNINGCOLOR}>
                        <Text textAlign={'center'} as='b'>
                          {clientErrorForm}
                        </Text>
                      </Flex>
                    ) : (
                      ''
                    )}

                    <HStack alignContent={'center'} alignItems={'center'}>
                      <Button
                        type='submit'
                        isLoading={isSubmitting}
                        bgGradient={GlobalColors.SENDMESSAGEBUTTON}
                        _hover={{
                          bgGradient: GlobalColors.SENDMESSAGEBUTTONHOVER
                        }}
                        p={4}
                        w={'150px'}
                        borderRadius={18}>
                        Cargar
                      </Button>
                    </HStack>
                  </VStack>
                </form>
              )}
            </Formik>
          </VStack>
        </Flex>
      </Flex>
    </LayoutPrivate>
  )
}
export default Main
