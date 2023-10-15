import { LayoutPrivate, NavBarPrivate } from '@/components'
import { ClientModelMap, GlobalColors } from '@/models'
import {
  createNewClientService,
  deleteOneClientService,
  getAllClientsService,
  updateOneClientService
} from '@/services'
import { formatearDni } from '@/utils'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
  MenuDivider,
  MenuItem,
  MenuList,
  MenuOptionGroup,
  Text,
  VStack,
  useDisclosure
} from '@chakra-ui/react'
import { AxiosError } from 'axios'
import { Field, Formik, FormikHelpers } from 'formik'
import React, { useEffect, useState } from 'react'
import { CiMenuKebab } from 'react-icons/ci'
import * as Yup from 'yup'

function Main() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>()
  const [clientErrorForm, setclientErrorForm] = useState<string>()
  const [clientFetchError, setClientFetchError] = useState<string>()
  const [listOfClients, setListOfClients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [listOfClientsFiltered, setListOfClientsFiltered] = useState([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [userToDelete, setUserToDelete] = useState({
    id: '',
    name: '',
    dni: '',
    status: ''
  })
  const cancelRef = React.useRef(null)

  let number = listOfClients.length || 0

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
      setListOfClientsFiltered(data)
    } catch (error) {
      if (error instanceof AxiosError) {
        setClientFetchError(
          error?.response?.data?.error ||
            'Ha ocurrido un error al cargar los clientes, intente cerrando sesión y volviendo a ingresar.'
        )
      } else {
        setClientFetchError(
          'Ha ocurrido un error al cargar los clientes, intente cerrando sesión y volviendo a ingresar.'
        )
      }
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value
    setSearchTerm(searchText)

    const filteredItems = listOfClients.filter(
      (item: ClientModelMap) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.dni.toLowerCase().includes(searchText.toLowerCase())
    )

    setListOfClientsFiltered(filteredItems)
  }

  const deleteOneClient = async (clientId: string) => {
    try {
      await deleteOneClientService(clientId)
      setUserToDelete({
        id: '',
        name: '',
        dni: '',
        status: ''
      })
      onClose()
      getAllClients()
    } catch (error) {
      getAllClients()
    }
  }

  const updateOneClient = async (clientId: string, status: string) => {
    try {
      await updateOneClientService({ clientId, status })
      getAllClients()
    } catch (error) {
      getAllClients()
    }
  }

  const setColorStatus = (status: string) => {
    if (status === 'PAID') {
      return GlobalColors.BGRADIENTPAID
    } else if (status === 'PENDING') {
      return GlobalColors.BGRADIENTPENDING
    } else if (status === 'CANCELLED') {
      return GlobalColors.BGRADIENTCANCELLED
    }

    return GlobalColors.BGRADIENTDEFAULT
  }

  useEffect(() => {
    getAllClients()
  }, [])

  return (
    <LayoutPrivate>
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered>
        <AlertDialogOverlay />
        <AlertDialogContent bg={GlobalColors.BGGRADIENTPRIMARY}>
          <AlertDialogHeader>Eliminar cliente?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <Text>Estas seguro que deseas eliminar este cliente?</Text>
            {userToDelete?.name} {userToDelete?.dni}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button
              bgGradient={GlobalColors.WARNINGCOLOR}
              ml={3}
              onClick={() => deleteOneClient(userToDelete.id)}>
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <NavBarPrivate title={'Mis Clientes'} />
      <Flex flexDirection={'column'} px={4}>
        <Divider my={4} />
        <Flex h={'60vh'} overflow={'auto'} flexDirection={'column'} gap={2}>
          {listOfClientsFiltered &&
            listOfClientsFiltered.map((client: ClientModelMap) => {
              return (
                <Card
                  key={client.id}
                  p={2}
                  bgGradient={`linear(to-tr, ${setColorStatus(
                    client.status
                  )}, ${GlobalColors.BGGRADIENTPRIMARY})`}
                  border='1px solid'
                  borderColor={GlobalColors.BORDERCONTENT}>
                  <Flex alignItems={'center'} justifyContent={'space-between'}>
                    <Flex
                      overflow={'hidden'}
                      gap={4}
                      alignContent={'center'}
                      alignItems={'center'}>
                      {!searchTerm && (
                        <Flex w={'auto'}>
                          <Heading textAlign={'center'}>{number--}</Heading>
                        </Flex>
                      )}
                      <Flex flexDirection={'column'}>
                        <Heading size={'md'} noOfLines={1}>
                          {client.name}
                        </Heading>
                        <Text color={GlobalColors.EMPHASIZED}>
                          {client.dni}
                        </Text>
                      </Flex>
                    </Flex>
                    <Flex>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<CiMenuKebab />}
                          aria-label='Options'
                          variant='outline'
                        />
                        <MenuList bg={'black'} gap={4}>
                          <MenuOptionGroup title='Estados'>
                            <Flex flexDirection={'column'} gap={2} m={2}>
                              <MenuItem
                                borderRadius={4}
                                bg={GlobalColors.BGRADIENTPAID}
                                onClick={() => {
                                  updateOneClient(client.id, 'PAID')
                                }}>
                                Pagado
                              </MenuItem>
                              <MenuItem
                                borderRadius={4}
                                bg={GlobalColors.BGRADIENTPENDING}
                                onClick={() => {
                                  updateOneClient(client.id, 'PENDING')
                                }}>
                                Pendiente
                              </MenuItem>
                              <MenuItem
                                borderRadius={4}
                                bg={GlobalColors.BGRADIENTCANCELLED}
                                onClick={() => {
                                  updateOneClient(client.id, 'CANCELLED')
                                }}>
                                Cancelado
                              </MenuItem>
                              <MenuItem
                                borderRadius={4}
                                bg={GlobalColors.BGRADIENTDEFAULT}
                                onClick={() => {
                                  updateOneClient(client.id, 'DEFAULT')
                                }}>
                                Por Defecto
                              </MenuItem>
                            </Flex>
                          </MenuOptionGroup>
                          <MenuDivider />
                          <MenuOptionGroup title='Opciones'>
                            <MenuItem
                              bgGradient={GlobalColors.WARNINGCOLOR}
                              onClick={() => {
                                setUserToDelete(client)
                                onOpen()
                              }}>
                              Eliminar
                            </MenuItem>
                          </MenuOptionGroup>
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
        <Flex flexDirection={'column'}>
          <Flex flexDirection={'column'} mb={4}>
            <Text fontSize={'md'} className='chakra-form__label css-79e1m'>
              Buscar:
            </Text>
            <Input
              value={searchTerm}
              onChange={(event) => {
                handleSearch(event)
              }}
              placeholder='Nombre o DNI'
              variant='outline'
            />
          </Flex>
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
                      <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
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
        </Flex>
      </Flex>
    </LayoutPrivate>
  )
}
export default Main
