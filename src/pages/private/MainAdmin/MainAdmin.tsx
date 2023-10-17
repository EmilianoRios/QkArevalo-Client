import { LayoutPrivate, NavBarPrivateAdmin } from '@/components'
import { ClientModelMap, GlobalColors } from '@/models'
import {
  createNewClientService,
  deleteOneClientService,
  getAllClientsForEmployeeService,
  getAllClientsService,
  updateOneClientService
} from '@/services'
import { formatDNI } from '@/utils'
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
import React, { useCallback, useEffect, useState } from 'react'
import { CiMenuKebab } from 'react-icons/ci'
import { useSelector } from 'react-redux'
import * as Yup from 'yup'

function MainAdmin() {
  const authState = useSelector(
    (state: { user: { id: string; name: string } }) => state.user
  )
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isLoadingList, setIsLoadingList] = useState<boolean>(false)
  const [clientErrorForm, setClientErrorForm] = useState<string>()
  const [clientFetchError, setClientFetchError] = useState<string>()
  const [
    updateListOfClientsFromChildComp,
    setUpdateListOfClientsFromChildComp
  ] = useState<boolean>(false)
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
  const [switchClientList, setSwitchClientList] = useState<boolean>(false)
  const cancelRef = React.useRef(null)

  let numberOfClients = (listOfClients && listOfClients.length) || 0

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
      .matches(
        /^(?:\d{8}|\d{2}\.\d{3}\.\d{3})?$/,
        'El formato debe ser 12345678 o 12.345.678'
      )
      .notRequired()
  })

  const handleClientErrorForm = (message: string) => {
    setClientErrorForm(message)
    setTimeout(() => {
      setClientErrorForm('')
    }, 5000)
  }

  const onSubmit = async (
    data: MyFormValues,
    actions: FormikHelpers<MyFormValues>
  ) => {
    setIsSubmitting(true)
    const cleanDNI = formatDNI(data.dni)
    try {
      await createNewClientService({
        ...data,
        dni: cleanDNI,
        employeeId: authState.id
      })
      actions.resetForm()
      setIsSubmitting(false)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data?.error === 'P2002') {
          handleClientErrorForm('El cliente ingresado ya existe.')
        }
      } else {
        handleClientErrorForm('Ha ocurrido un error al cargar el cliente.')
      }
      setIsSubmitting(false)
    }
    getAllClients()
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

  const fetchEmployeeClients = useCallback(async () => {
    setIsLoadingList(true)
    try {
      const data = await getAllClientsForEmployeeService(authState.id)
      setListOfClients(data)
      setListOfClientsFiltered(data)
      setSearchTerm('')
    } catch (error) {
      if (error instanceof AxiosError) {
        setClientFetchError(error?.message)
      }
    }
    setIsLoadingList(false)
  }, [authState])

  const fetchAllClients = async () => {
    setIsLoadingList(true)
    try {
      const data = await getAllClientsService()
      setListOfClients(data)
      setListOfClientsFiltered(data)
      setSearchTerm('')
    } catch (error) {
      if (error instanceof AxiosError) {
        setClientFetchError(error?.message)
      }
    }
    setIsLoadingList(false)
  }

  const getAllClients = async () => {
    if (!switchClientList) {
      fetchEmployeeClients()
    } else {
      fetchAllClients()
    }
  }

  useEffect(() => {
    if (!switchClientList) {
      fetchEmployeeClients()
    } else {
      fetchAllClients()
    }
    setUpdateListOfClientsFromChildComp(false)
  }, [switchClientList, fetchEmployeeClients, updateListOfClientsFromChildComp])

  return (
    <LayoutPrivate>
      <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered>
        <AlertDialogOverlay />
        <AlertDialogContent bg={GlobalColors.BORDERCONTENT}>
          <AlertDialogHeader>Eliminar cliente?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <Text>Estas seguro que deseas eliminar este cliente?</Text>
            <Flex p={2}>
              {userToDelete?.name} - {userToDelete?.dni}
            </Flex>
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
      <NavBarPrivateAdmin
        title={switchClientList ? 'Todos los Clientes' : 'Mis Clientes'}
        user={authState.name}
        setStateUpdateList={setUpdateListOfClientsFromChildComp}
      />
      <Flex flexDirection={'column'} px={4}>
        <Divider my={4} />
        <Flex h={'60vh'} overflow={'auto'} flexDirection={'column'} gap={2}>
          {listOfClientsFiltered &&
            listOfClientsFiltered.map((client: ClientModelMap) => {
              return (
                <Card
                  key={client.id}
                  p={2}
                  bgGradient={`linear(to-tr, ${
                    GlobalColors.BGGRADIENTPRIMARY
                  },${setColorStatus(client.status)} )`}
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
                          <Heading textAlign={'center'} fontSize={'2rem'}>
                            {numberOfClients--}
                          </Heading>
                        </Flex>
                      )}
                      <Flex flexDirection={'column'}>
                        <Flex
                          flexDirection={'column'}
                          w={switchClientList ? '250px' : 'auto'}>
                          <Heading size={'md'} noOfLines={1} fontSize={'1rem'}>
                            {client.name}
                          </Heading>
                          <Text
                            color={GlobalColors.EMPHASIZED}
                            fontSize={'0.9rem'}>
                            {client.dni || 'Sin DNI.'}
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                    {switchClientList && (
                      <Flex
                        justifyContent={'center'}
                        alignContent={'flex-start'}>
                        <Text>{client.employee?.name}</Text>
                      </Flex>
                    )}
                    <Flex>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<CiMenuKebab />}
                          aria-label='Options'
                          variant='outline'
                        />
                        <MenuList bg={GlobalColors.BORDERCONTENT} gap={4}>
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
                  ? 'Ha ocurrido un error!. 😭'
                  : '¡Ningún cliente por aquí! 🙂'}
              </Text>
            </VStack>
          )}
        </Flex>
        <Divider my={4} />
        <Flex
          gap={4}
          flexWrap={'wrap'}
          alignContent={'center'}
          alignItems={'center'}
          m={'0 auto'}>
          <Button
            isLoading={isLoadingList}
            bgGradient={GlobalColors.SENDMESSAGEBUTTON}
            _hover={{
              bgGradient: GlobalColors.SENDMESSAGEBUTTONHOVER
            }}
            p={4}
            w={'auto'}
            borderRadius={18}
            onClick={() => {
              switchClientList
                ? setSwitchClientList(false)
                : setSwitchClientList(true)
            }}>
            <Text
              fontSize={{
                base: '0.8rem',
                md: '0.8rem',
                lg: '0.9rem'
              }}>
              {switchClientList ? 'Mis Clientes' : 'Todos los Clientes'}
            </Text>
          </Button>
          <Button
            isLoading={isLoadingList}
            bgGradient={GlobalColors.SENDMESSAGEBUTTON}
            _hover={{
              bgGradient: GlobalColors.SENDMESSAGEBUTTONHOVER
            }}
            p={4}
            w={'auto'}
            borderRadius={18}
            onClick={() => {
              getAllClients()
            }}>
            <Text
              fontSize={{
                base: '0.8rem',
                md: '0.8rem',
                lg: '0.9rem'
              }}>
              Actualizar Lista
            </Text>
          </Button>
        </Flex>
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
                  <Flex gap={4}>
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
                    <Flex alignContent={'end'} alignItems={'end'}>
                      <Button
                        type='submit'
                        isLoading={isSubmitting}
                        bgGradient={GlobalColors.SENDMESSAGEBUTTON}
                        _hover={{
                          bgGradient: GlobalColors.SENDMESSAGEBUTTONHOVER
                        }}
                        p={4}
                        w={'auto'}
                        borderRadius={18}>
                        <Text
                          fontSize={{
                            base: '0.8rem',
                            md: '0.8rem',
                            lg: '0.9rem'
                          }}>
                          Cargar
                        </Text>
                      </Button>
                    </Flex>
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
                </VStack>
              </form>
            )}
          </Formik>
        </Flex>
      </Flex>
    </LayoutPrivate>
  )
}
export default MainAdmin
